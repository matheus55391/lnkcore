import { prisma } from "@/lib/prisma";
import { updatePageSchema } from "@/schemas/page";

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

export async function getPageByUserId(userId: string) {
  const page = await prisma.page.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (page) {
    return page;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    return null;
  }

  return prisma.page.create({
    data: {
      userId,
      slug: await generateUniqueSlug(user.name),
      title: user.name,
    },
  });
}

export async function getPublicPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      links: {
        orderBy: { position: "asc" },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function updatePageByUserId(userId: string, input: unknown) {
  const payload = updatePageSchema.parse(input);
  const existing = await getPageByUserId(userId);
  if (!existing) {
    throw new Error("Page not found");
  }

  return prisma.page.update({
    where: { id: existing.id },
    data: {
      slug: payload.slug,
      title: payload.title,
      description: payload.description || null,
      avatarUrl: payload.avatarUrl || null,
    },
  });
}
