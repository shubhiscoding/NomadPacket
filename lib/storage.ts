import fs from "node:fs/promises";
import path from "node:path";

/**
 * Minimal local-filesystem storage adapter for generated documents.
 * `GeneratedDocument.fileUrl` stores the `key` returned here, not a public
 * URL — deployment (Vercel Blob / S3-compatible storage, per the Neon/
 * Supabase + Vercel deploy target) isn't being wired yet per this build's
 * scope, so this keeps every caller storage-agnostic behind two functions.
 * Swapping to real object storage later means only rewriting this file.
 */
const STORAGE_ROOT = path.join(process.cwd(), ".data", "documents");

export async function saveDocument(key: string, buffer: Buffer): Promise<string> {
  const filePath = path.join(STORAGE_ROOT, key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  return key;
}

export async function loadDocument(key: string): Promise<Buffer> {
  const filePath = path.join(STORAGE_ROOT, key);
  return fs.readFile(filePath);
}
