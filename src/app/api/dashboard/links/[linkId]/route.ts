import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { deleteUserLink, updateUserLink } from "@/modules/link/service";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { linkId } = await params;
    const link = await updateUserLink(session.userId, linkId, body);
    return NextResponse.json({ link });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { linkId } = await params;
    await deleteUserLink(session.userId, linkId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
