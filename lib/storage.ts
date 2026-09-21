import fs from "node:fs/promises";
import path from "node:path";
import { put, get, del } from "@vercel/blob";
import { getEnv } from "./env";

/**
 * Storage adapter for generated documents. `GeneratedDocument.fileUrl`
 * stores the `key` returned here (a pathname, never a public URL) — every
 * caller stays storage-backend-agnostic behind these three functions.
 *
 * Backend is chosen by whether `BLOB_READ_WRITE_TOKEN` is set (Vercel
 * injects it automatically once a Blob store is attached to the project):
 * - Set (prod/preview on Vercel): Vercel Blob, `access: "private"` — these
 *   are people's financial/immigration documents (AGENTS.md §4, "treat all
 *   user data as sensitive by default"), so nothing here is ever fetchable
 *   from a bare URL; only server code holding BLOB_READ_WRITE_TOKEN can
 *   read or delete a blob via `get`/`del`.
 * - Unset (local dev, CI, `npm test`): local filesystem under
 *   `.data/documents` — Vercel's deployed filesystem is read-only outside
 *   `/tmp` (and `/tmp` doesn't persist across invocations), so this path
 *   only ever runs where a real writable disk exists.
 *
 * Checked lazily inside each function (not at module scope) so importing
 * this module doesn't force full env validation — same reasoning as
 * getEnv() itself being lazy (lib/env.ts).
 */
function shouldUseBlobStorage(): boolean {
  return Boolean(getEnv().BLOB_READ_WRITE_TOKEN);
}
const STORAGE_ROOT = path.join(process.cwd(), ".data", "documents");

export async function saveDocument(key: string, buffer: Buffer): Promise<string> {
  if (shouldUseBlobStorage()) {
    await put(key, buffer, {
      access: "private",
      contentType: "application/pdf",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return key;
  }

  const filePath = path.join(STORAGE_ROOT, key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  return key;
}

export async function loadDocument(key: string): Promise<Buffer> {
  if (shouldUseBlobStorage()) {
    const result = await get(key, { access: "private" });
    if (!result) throw new Error(`Document not found in blob storage: ${key}`);
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }

  const filePath = path.join(STORAGE_ROOT, key);
  return fs.readFile(filePath);
}

/**
 * Best-effort deletion — callers (regeneration, the retention cron) should
 * not fail their own operation just because the underlying file was
 * already gone or a delete call errored transiently.
 */
export async function deleteDocument(key: string): Promise<void> {
  if (shouldUseBlobStorage()) {
    await del(key);
    return;
  }

  const filePath = path.join(STORAGE_ROOT, key);
  await fs.rm(filePath, { force: true });
}
