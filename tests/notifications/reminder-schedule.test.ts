import { describe, it, expect } from "vitest";
import {
  shouldSendReminder,
  FIRST_REMINDER_DELAY_MS,
  REMINDER_CADENCE_MS,
  REMINDER_CUTOFF_MS,
} from "@/notifications/reminder-schedule";

describe("shouldSendReminder", () => {
  const baseTime = new Date("2026-10-03T12:00:00Z");

  describe("first reminder (no prior reminder)", () => {
    it("returns false if inactive < 1 hour", () => {
      const updatedAt = new Date(baseTime.getTime() - (FIRST_REMINDER_DELAY_MS - 1000));
      const result = shouldSendReminder({ updatedAt, lastReminderAt: null, now: baseTime });
      expect(result).toBe(false);
    });

    it("returns true if inactive == exactly 1 hour", () => {
      const updatedAt = new Date(baseTime.getTime() - FIRST_REMINDER_DELAY_MS);
      const result = shouldSendReminder({ updatedAt, lastReminderAt: null, now: baseTime });
      expect(result).toBe(true);
    });

    it("returns true if inactive > 1 hour", () => {
      const updatedAt = new Date(baseTime.getTime() - (FIRST_REMINDER_DELAY_MS + 3600000));
      const result = shouldSendReminder({ updatedAt, lastReminderAt: null, now: baseTime });
      expect(result).toBe(true);
    });

    it("returns true if inactive == exactly 7 days (cap is 'more than 7 days')", () => {
      const updatedAt = new Date(baseTime.getTime() - REMINDER_CUTOFF_MS);
      const result = shouldSendReminder({ updatedAt, lastReminderAt: null, now: baseTime });
      expect(result).toBe(true);
    });

    it("returns false if inactive > 7 days", () => {
      const updatedAt = new Date(baseTime.getTime() - (REMINDER_CUTOFF_MS + 1000));
      const result = shouldSendReminder({ updatedAt, lastReminderAt: null, now: baseTime });
      expect(result).toBe(false);
    });
  });

  describe("subsequent reminders (with prior reminder)", () => {
    it("returns false if < 24h since last reminder", () => {
      const lastReminderAt = new Date(baseTime.getTime() - (REMINDER_CADENCE_MS - 1000));
      const updatedAt = new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000);
      const result = shouldSendReminder({ updatedAt, lastReminderAt, now: baseTime });
      expect(result).toBe(false);
    });

    it("returns true if >= 24h since last reminder", () => {
      const lastReminderAt = new Date(baseTime.getTime() - REMINDER_CADENCE_MS);
      const updatedAt = new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000);
      const result = shouldSendReminder({ updatedAt, lastReminderAt, now: baseTime });
      expect(result).toBe(true);
    });

    it("returns true if 25h since last reminder", () => {
      const lastReminderAt = new Date(baseTime.getTime() - (REMINDER_CADENCE_MS + 3600000));
      const updatedAt = new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000);
      const result = shouldSendReminder({ updatedAt, lastReminderAt, now: baseTime });
      expect(result).toBe(true);
    });
  });

  describe("cutoff cap wins over cadence", () => {
    it("returns false if inactive > 7 days, even with a recent reminder", () => {
      const lastReminderAt = new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000);
      const updatedAt = new Date(baseTime.getTime() - (REMINDER_CUTOFF_MS + 1000));
      const result = shouldSendReminder({ updatedAt, lastReminderAt, now: baseTime });
      expect(result).toBe(false);
    });
  });
});
