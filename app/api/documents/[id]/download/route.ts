import { NextRequest, NextResponse } from "next/server";
import { loadOwnedApplication } from "@/lib/load-owned-application";
import { buildPacketZip } from "@/lib/packaging";
import { hasEntitlement } from "@/entitlement/guard";

/**
 * Gated download of the full packet as a single ZIP — `[id]` here is the
 * Application id (distinct from app/api/applications/[id]/documents/
 * [docId]/preview, which streams one ungated document for preview).
 * Entitlement is checked server-side via hasEntitlement(), never trusted
 * from any client-side "paid" signal (AGENTS.md §4) — see entitlement/
 * guard.ts for why it's currently a stub returning true.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await loadOwnedApplication(id);
  if ("error" in result) return result.error;

  if (!(await hasEntitlement(id))) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  let zipBuffer: Buffer;
  try {
    zipBuffer = await buildPacketZip(id);
  } catch {
    return NextResponse.json({ error: "No documents generated yet" }, { status: 409 });
  }

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="nomadpacket-${id}.zip"`,
    },
  });
}
