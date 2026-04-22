import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { getPageByUserId, updatePageByUserId } from "@/modules/page/service";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await getPageByUserId(session.userId);
  return NextResponse.json({ page });
}

export async function PATCH(req: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const page = await updatePageByUserId(session.userId, body);
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
