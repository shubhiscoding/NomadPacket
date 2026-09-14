import { Resend } from "resend";
import { getEnv } from "@/lib/env";

let cachedClient: Resend | undefined;

export function getResendClient(): Resend {
  if (!cachedClient) {
    cachedClient = new Resend(getEnv().RESEND_API_KEY);
  }
  return cachedClient;
}
