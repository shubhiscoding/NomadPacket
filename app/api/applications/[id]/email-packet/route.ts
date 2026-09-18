import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/auth/session";
import { prisma } from "@/lib/prisma";
import { buildPacketZip } from "@/lib/packaging";
import { hasEntitlement } from "@/entitlement/guard";
import { sendPacketReadyEmail } from "@/notifications/send";

/**
 * Emails the full packet as a ZIP attachment to the signed-in user's own
 * address — the backup delivery channel alongside the download route
 * (AGENTS.md build order step 9). Same entitlement gate as the download
 * route, since this is an equivalent way to get the paid packet out.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!(await hasEntitlement(id))) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  let zipBuffer: Buffer;
  try {
    zipBuffer = await buildPacketZip(id);
  } catch {
    return NextResponse.json({ error: "No documents generated yet" }, { status: 409 });
  }

  try {
    await sendPacketReadyEmail({
      to: user.email,
      zipBuffer,
      zipFilename: `nomadpacket-${id}.zip`,
    });
  } catch (err) {
    console.error("Failed to send packet-ready email:", err);
    return NextResponse.json(
      { error: "We couldn't send the email. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
