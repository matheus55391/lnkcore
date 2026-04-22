import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") || "user"
  );
}

async function generateUniqueSlug(name: string) {
  const seed = slugify(name);
  let candidate = seed;
  let index = 1;

  while (await prisma.page.findUnique({ where: { slug: candidate } })) {
    candidate = `${seed}-${index}`;
    index += 1;
  }

  return candidate;
}

export async function POST() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [page, subscription] = await Promise.all([
    prisma.page.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.userId },
    }),
  ]);

  if (!page) {
    await prisma.page.create({
      data: {
        userId: session.userId,
        slug: await generateUniqueSlug(session.name),
        title: session.name,
      },
    });
  }

  if (!subscription) {
    await prisma.subscription.create({
      data: {
        userId: session.userId,
        plan: "free",
        status: "canceled",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
