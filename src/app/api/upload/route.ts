import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getSession } from "@/utils/session";
import { getStorage } from "@/lib/storage";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plan";
import { Plan } from "@/@types";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Max dimension before resizing (keeps aspect ratio)
const MAX_DIMENSION = 1200;

async function processImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    // Strip all metadata (EXIF, GPS, ICC profiles, etc.) — security + size
    .withMetadata({})
    // Resize only if larger than MAX_DIMENSION (never upscale)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    // Convert to WebP — good compression with no perceptible quality loss
    .webp({ quality: 90, effort: 4 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image");
  const folder = formData.get("folder")?.toString() ?? "misc";
  const entityId = formData.get("entityId")?.toString();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum is 5 MB." },
      { status: 400 }
    );
  }

  // New key structure: {userId}/{folder}/{entityId}/avatar.webp
  const key = entityId
    ? `${session.user.id}/${folder}/${entityId}/avatar.webp`
    : `${session.user.id}/${folder}/avatar.webp`;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getStorage();
  const maxStoredImages = PLAN_LIMITS[user.plan].maxStoredImages;

  const [keyExists, currentCount] = await Promise.all([
    storage.objectExists(key),
    storage.countByPrefix(`${session.user.id}/`),
  ]);

  // Allow overwrite of an existing key; block only new objects above quota.
  if (!keyExists && currentCount >= maxStoredImages) {
    return NextResponse.json(
      {
        error:
          user.plan === Plan.FREE
            ? "Limite de imagens do plano gratuito atingido. Remova alguma imagem ou faça upgrade para o PRO."
            : "Limite de imagens do plano PRO atingido.",
      },
      { status: 403 }
    );
  }

  const raw = Buffer.from(await file.arrayBuffer());
  const body = await processImage(raw);

  const result = await storage.upload({ key, body, contentType: "image/webp" });

  return NextResponse.json({ url: result.url });
}
