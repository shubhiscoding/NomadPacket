import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Application } from "@prisma/client";

/**
 * Creates a fresh draft Application, racesafe against the DB-level "one
 * non-PAID application per user" constraint (see the migration
 * 20260922150000_one_draft_application_per_user and the comment on
 * model Application in schema.prisma).
 *
 * That constraint exists because app-level care alone wasn't enough: a
 * single "Fill new form" click reproducibly created two draft rows
 * (Next.js dev double-invoking the page's render, which performs this
 * create as a side effect — see app/application/page.tsx). Rather than
 * try to make the render itself perfectly single-shot, this accepts
 * that the create can race and be rejected (Postgres error code P2002),
 * and in that case simply returns whichever draft the OTHER invocation
 * already created — both callers converge on the same application
 * instead of one of them throwing a 500.
 */
export async function createDraftApplicationSafely(params: {
  userId: string;
  country: string;
  visaType: string;
}): Promise<Application> {
  try {
    return await prisma.application.create({
      data: {
        userId: params.userId,
        country: params.country,
        visaType: params.visaType,
      },
    });
  } catch (err) {
    const isUniqueConstraintViolation =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
    if (!isUniqueConstraintViolation) throw err;

    const existing = await prisma.application.findFirst({
      where: { userId: params.userId, status: { not: "PAID" } },
      orderBy: { createdAt: "desc" },
    });
    if (!existing) throw err; // Shouldn't happen — the constraint only rejects if one already exists.
    return existing;
  }
}
