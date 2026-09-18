import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { loadDocument } from "@/lib/storage";

/**
 * Builds the full document packet as a ZIP buffer for an application.
 * Shared between the download route and the packet-ready email route so
 * both produce byte-identical packets from one implementation.
 */
export async function buildPacketZip(applicationId: string): Promise<Buffer> {
  const documents = await prisma.generatedDocument.findMany({
    where: { applicationId },
  });
  if (documents.length === 0) {
    throw new Error(`No generated documents for application ${applicationId}`);
  }

  const zip = new JSZip();
  for (const doc of documents) {
    const buffer = await loadDocument(doc.fileUrl);
    zip.file(`${doc.type}.pdf`, buffer);
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
