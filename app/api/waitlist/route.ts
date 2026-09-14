import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().email(),
  country: z.string().min(1),
  visaType: z.string().min(1),
});

/**
 * Writes a Waitlist row for an unsupported {country, visaType}. Deliberately
 * does NOT create a User, Session, or Application — nothing beyond this row
 * exists for someone who lands here (AGENTS.md build-order step 1).
 */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, country, visaType } = parsed.data;

  await prisma.waitlist.create({
    data: { email, country, visaType },
  });

  return NextResponse.json({ ok: true });
}
