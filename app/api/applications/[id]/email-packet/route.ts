import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadOwnedApplication } from "@/lib/load-owned-application";
import { buildPacketZip } from "@/lib/packaging";
import { hasEntitlement } from "@/entitlement/guard";
import { sendPacketReadyEmail } from "@/notifications/send";
import { consumeRateLimit } from "@/lib/rate-limit";

const PACKET_EMAIL_RATE_LIMIT = { max: 3, windowMs: 24 * 60 * 60 * 1000 };

/**
 * Emails the full packet as a ZIP attachment to the signed-in user's own
 * address — the backup delivery channel alongside the download route
 * (AGENTS.md build order step 9). Same entitlement gate as the download
 * route, since this is an equivalent way to get the paid packet out.
 *
 * Rate-limited per application (not per user) since that's what the
 * "Email me my packet" button on the checklist page is scoped to.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await loadOwnedApplication(id);
  if ("error" in result) return result.error;
  const { application } = result;

  if (!(await hasEntitlement(id))) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  const rateLimit = await consumeRateLimit(`packet-email:${id}`, PACKET_EMAIL_RATE_LIMIT);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "You've reached today's email limit for this packet — download it directly instead.",
        retryAfterMs: rateLimit.retryAfterMs,
      },
      { status: 429 },
    );
  }

  let zipBuffer: Buffer;
  try {
    zipBuffer = await buildPacketZip(id);
  } catch {
    return NextResponse.json({ error: "No documents generated yet" }, { status: 409 });
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: application.userId } });

  try {
    await sendPacketReadyEmail({
      to: user.email,
      zipBuffer,
      zipFilename: `nomadpacket-${id}.zip`,
    });
  } catch (err) {
    console.error("Failed to send packet-ready email:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't send the email — please download your packet directly instead while we look into it.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, remaining: rateLimit.remaining });
}
