import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/utils/session";
import { getStorage } from "@/lib/storage";
import { extname } from "path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  const ext = extname(file.name) || `.${file.type.split("/")[1]}`;
  // e.g. "pages/clx123abc/avatar.png"
  const key = entityId
    ? `${folder}/${entityId}/avatar${ext}`
    : `${folder}/${session.user.id}/avatar${ext}`;

  const body = Buffer.from(await file.arrayBuffer());

  const storage = getStorage();
  const result = await storage.upload({ key, body, contentType: file.type });

  return NextResponse.json({ url: result.url });
}
