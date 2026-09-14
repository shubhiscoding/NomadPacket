import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/auth/session";
import { prisma } from "@/lib/prisma";
import { loadDocument } from "@/lib/storage";

/**
 * Ungated inline preview of a single generated document — per the
 * Definition of Done, the user must be able to see document previews
 * before paying. The full packet ZIP download (app/api/documents/[id]/
 * download once entitlement gating lands) is the payment-gated action,
 * not this. Still requires ownership (session + application match).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;

  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const document = await prisma.generatedDocument.findUnique({ where: { id: docId } });
  if (!document || document.applicationId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await loadDocument(document.fileUrl);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${document.type}.pdf"`,
    },
  });
}
