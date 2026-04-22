import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { createUserLink, listUserLinks } from "@/modules/link/service";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const links = await listUserLinks(session.userId);
  return NextResponse.json({ links });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const link = await createUserLink(session.userId, body);
    return NextResponse.json({ link });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
