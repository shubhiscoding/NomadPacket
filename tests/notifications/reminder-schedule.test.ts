import { describe, it, expect } from "vitest";
import {
  getNextEmailNumber,
  FLOW_A_DELAYS_MS,
  FLOW_B_DELAYS_MS,
  REMINDER_CUTOFF_MS,
} from "@/notifications/reminder-schedule";

describe("getNextEmailNumber", () => {
  const baseTime = new Date("2026-10-03T12:00:00Z");

  describe("Flow A (4 emails)", () => {
    describe("email 1 (3 hours)", () => {
      it("returns null if inactive < 3 hours", () => {
        const updatedAt = new Date(baseTime.getTime() - (FLOW_A_DELAYS_MS[0] - 1000));
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: null,
          lastEmailSentAt: null,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(null);
      });

      it("returns 1 if inactive == exactly 3 hours", () => {
        const updatedAt = new Date(baseTime.getTime() - FLOW_A_DELAYS_MS[0]);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: null,
          lastEmailSentAt: null,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(1);
      });

      it("returns 1 if inactive > 3 hours", () => {
        const updatedAt = new Date(baseTime.getTime() - (FLOW_A_DELAYS_MS[0] + 3600000));
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: null,
          lastEmailSentAt: null,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(1);
      });
    });

    describe("email 2 (24 hours from email 1)", () => {
      it("returns null if < 24h since email 1", () => {
        const lastEmailSentAt = new Date(baseTime.getTime() - (FLOW_A_DELAYS_MS[1] - 1000));
        const updatedAt = new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: 1,
          lastEmailSentAt,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(null);
      });

      it("returns 2 if >= 24h since email 1", () => {
        const lastEmailSentAt = new Date(baseTime.getTime() - FLOW_A_DELAYS_MS[1]);
        const updatedAt = new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: 1,
          lastEmailSentAt,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(2);
      });
    });

    describe("email 3 (60 hours from email 2)", () => {
      it("returns 3 if >= 60h since email 2", () => {
        const lastEmailSentAt = new Date(baseTime.getTime() - FLOW_A_DELAYS_MS[2]);
        const updatedAt = new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: 2,
          lastEmailSentAt,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(3);
      });
    });

    describe("email 4 (7 days, hard cap)", () => {
      it("returns 4 if inactive == exactly 7 days", () => {
        const lastEmailSentAt = new Date(baseTime.getTime() - REMINDER_CUTOFF_MS);
        const updatedAt = new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: 3,
          lastEmailSentAt,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(4);
      });

      it("returns null if inactive > 7 days (hard cap)", () => {
        const updatedAt = new Date(baseTime.getTime() - (REMINDER_CUTOFF_MS + 1000));
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: null,
          lastEmailSentAt: null,
          now: baseTime,
          delays: FLOW_A_DELAYS_MS,
        });
        expect(result).toBe(null);
      });
    });
  });

  describe("Flow B (2 emails)", () => {
    describe("email 1 (3 hours)", () => {
      it("returns 1 if inactive >= 3 hours", () => {
        const updatedAt = new Date(baseTime.getTime() - FLOW_B_DELAYS_MS[0]);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: null,
          lastEmailSentAt: null,
          now: baseTime,
          delays: FLOW_B_DELAYS_MS,
        });
        expect(result).toBe(1);
      });
    });

    describe("email 2 (48 hours from email 1)", () => {
      it("returns 2 if >= 48h since email 1", () => {
        const lastEmailSentAt = new Date(baseTime.getTime() - FLOW_B_DELAYS_MS[1]);
        const updatedAt = new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: 1,
          lastEmailSentAt,
          now: baseTime,
          delays: FLOW_B_DELAYS_MS,
        });
        expect(result).toBe(2);
      });

      it("returns null if all emails sent (no more in sequence)", () => {
        const lastEmailSentAt = new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000);
        const updatedAt = new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000);
        const result = getNextEmailNumber({
          updatedAt,
          lastEmailNumber: 2,
          lastEmailSentAt,
          now: baseTime,
          delays: FLOW_B_DELAYS_MS,
        });
        expect(result).toBe(null);
      });
    });
  });

  describe("7-day hard cutoff applies to all flows", () => {
    it("blocks Flow A email even at email 1", () => {
      const updatedAt = new Date(baseTime.getTime() - (REMINDER_CUTOFF_MS + 1000));
      const result = getNextEmailNumber({
        updatedAt,
        lastEmailNumber: null,
        lastEmailSentAt: null,
        now: baseTime,
        delays: FLOW_A_DELAYS_MS,
      });
      expect(result).toBe(null);
    });

    it("blocks Flow B email if inactive > 7 days", () => {
      const updatedAt = new Date(baseTime.getTime() - (REMINDER_CUTOFF_MS + 1000));
      const result = getNextEmailNumber({
        updatedAt,
        lastEmailNumber: null,
        lastEmailSentAt: null,
        now: baseTime,
        delays: FLOW_B_DELAYS_MS,
      });
      expect(result).toBe(null);
    });
  });
});
