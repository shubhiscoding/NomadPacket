/**
 * Document retention window (AGENTS.md §4 data-retention rule). Shared
 * between the deletion cron (app/api/cron/delete-expired-documents/route.ts)
 * and the document-history page (app/application/history/page.tsx) so the
 * displayed "available until" date and the actual deletion cutoff can
 * never drift apart.
 */
export const RETENTION_DAYS = 30;
