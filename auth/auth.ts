import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * The ACTIVE auth system: Google OAuth only, via Auth.js v5. Magic-link
 * auth (auth/legacy-session.ts, auth/token.ts) is dormant, kept per
 * explicit instruction, not routed to from anywhere.
 *
 * `session: { strategy: "database" }` is set explicitly — Auth.js
 * defaults to JWT sessions even with an adapter configured, but a DB-
 * backed session (a real Session row, looked up by cookie) matches how
 * every other part of this app already models sessions, and keeps
 * `auth()` calls consistent with the rest of the codebase (an actual row
 * that can be inspected/revoked in the database, not an opaque signed
 * blob).
 *
 * Every route/page that needs the current user calls `auth()` from this
 * file — never re-implement a cookie/session lookup elsewhere, same
 * "one sanctioned path" principle as lib/config-resolver.ts or
 * entitlement/guard.ts.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [Google],
  pages: {
    // Custom sign-in entry point (see app/signin/page.tsx) rather than
    // Auth.js's built-in default page — keeps the design language
    // consistent with the rest of the app.
    signIn: "/signin",
  },
});
