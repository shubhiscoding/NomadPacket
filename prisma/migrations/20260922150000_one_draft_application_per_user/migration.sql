-- A user can have at most one non-PAID ("draft") application at a time.
-- Enforced as a real DB constraint rather than relying solely on
-- application-code care — a single "Fill new form" click reproducibly
-- created two draft rows because Next.js's dev server double-invokes a
-- page's render (which performs the delete+create as a render-time side
-- effect), and app code alone can't be trusted to prevent that class of
-- race under any invocation pattern (double-click, retry, prefetch, etc).
--
-- Prisma's schema DSL can't express a partial (WHERE-clause) unique
-- index, so this is a hand-written migration rather than one generated
-- from a schema.prisma change — see the comment on model Application.
CREATE UNIQUE INDEX "applications_one_draft_per_user"
  ON "applications" ("user_id")
  WHERE "status" != 'PAID';
