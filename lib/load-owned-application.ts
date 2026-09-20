import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/auth/current-user";
import type { Application } from "@prisma/client";

type LoadResult = { application: Application } | { error: NextResponse };

/**
 * Shared ownership check, used by every /api/applications/[id]/* and
 * /api/documents/[id]/* route — was duplicated near-verbatim across 5
 * files before the Google-auth switch; factored out while touching all
 * of them anyway.
 */
export async function loadOwnedApplication(id: string): Promise<LoadResult> {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  return { application };
}
