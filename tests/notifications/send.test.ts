import { describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
vi.mock("@/notifications/resend-client", () => ({
  getResendClient: () => ({ emails: { send: sendMock } }),
}));

describe("sendMagicLinkEmail", () => {
  it("throws when Resend returns an error object (Resend does not throw on API failures itself)", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { statusCode: 401, name: "validation_error", message: "API key is invalid" },
    });
    const { sendMagicLinkEmail } = await import("@/notifications/send");

    await expect(
      sendMagicLinkEmail({ to: "test@example.com", verifyUrl: "https://example.com/verify" }),
    ).rejects.toThrow(/API key is invalid/);
  });

  it("resolves without throwing when Resend succeeds", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "email_123" }, error: null });
    const { sendMagicLinkEmail } = await import("@/notifications/send");

    await expect(
      sendMagicLinkEmail({ to: "test@example.com", verifyUrl: "https://example.com/verify" }),
    ).resolves.toBeUndefined();
  });
});
