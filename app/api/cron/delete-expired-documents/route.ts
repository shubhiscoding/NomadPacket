import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteDocument } from "@/lib/storage";
import { getEnv } from "@/lib/env";
import { RETENTION_DAYS } from "@/lib/retention";

/**
 * Daily retention sweep (scheduled via vercel.json's `crons` entry) —
 * deletes generated documents (and their stored files/blobs) once they're
 * older than RETENTION_DAYS. Required per AGENTS.md §4's explicit data-
 * retention rule for this product's sensitive financial/immigration
 * documents; there was previously no expiry at all, so storage grew
 * unbounded forever.
 *
 * Fails closed: if CRON_SECRET isn't configured, every request is
 * rejected rather than allowing an unauthenticated caller to trigger mass
 * deletion. Vercel automatically sends `Authorization: Bearer
 * $CRON_SECRET` on its own scheduled invocations once that env var is set
 * (https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs).
 */
export async function GET(request: NextRequest) {
  const cronSecret = getEnv().CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const expired = await prisma.generatedDocument.findMany({
    where: { generatedAt: { lt: cutoff } },
  });

  for (const doc of expired) {
    // Best-effort: a storage-side failure (e.g. already deleted) shouldn't
    // block removing the DB row for the other expired documents.
    await deleteDocument(doc.fileUrl).catch((err) => {
      console.error(`Failed to delete stored document ${doc.id} (${doc.fileUrl}):`, err);
    });
  }

  await prisma.generatedDocument.deleteMany({
    where: { id: { in: expired.map((doc) => doc.id) } },
  });

  return NextResponse.json({ deletedCount: expired.length });
}
