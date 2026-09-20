import { prisma } from "@/lib/prisma";
import { createGateContextCookieValue, GATE_CONTEXT_COOKIE_NAME } from "@/lib/gate-context";
import type { User } from "@prisma/client";

/**
 * Creates/upserts a real User row for tests. Does NOT create a session —
 * auth is Google-only via Auth.js v5 now, and Auth.js's `auth()` reads
 * cookies through `next/headers`, which only works inside Next's real
 * request lifecycle (not when a test calls a route handler function
 * directly — the same constraint hit earlier with the old magic-link
 * system). The correct way to simulate "signed in" in these tests is
 * mocking the module boundary, not constructing a real session:
 *
 *   vi.mock("@/auth/current-user", () => ({ getCurrentUser: vi.fn() }));
 *   // ...
 *   import { getCurrentUser } from "@/auth/current-user";
 *   vi.mocked(getCurrentUser).mockResolvedValue(testUser);
 *
 * vi.mock calls are hoisted by Vitest and must be written at each test
 * file's own top level — they can't be wrapped in a shared helper
 * function, so this file only provides the User-creation half.
 */
export async function createTestUser(email: string): Promise<User> {
  return prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });
}

export function gateContextCookieHeader(country: string, visaType: string): string {
  return `${GATE_CONTEXT_COOKIE_NAME}=${createGateContextCookieValue({ country, visaType })}`;
}
