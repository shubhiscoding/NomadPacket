import { prisma } from "@/lib/prisma";
import { auth } from "./auth";
import type { User } from "@prisma/client";

/**
 * The one sanctioned way to get the signed-in user — Route Handlers and
 * Server Components alike. Auth.js v5's `auth()` reads the session cookie
 * via `next/headers` internally either way, so unlike the old magic-link
 * system there's no separate "from request" vs "from headers" variant to
 * keep in sync.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}
