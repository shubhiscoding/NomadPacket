/**
 * Test script to send all 6 reminder email templates to your email.
 * Usage: npm run test:emails
 *
 * This sends test emails to kesharwanis084@gmail.com so you can verify
 * all templates in both flows.
 *
 * NOTE: This script is for testing only and should not be committed.
 */

import { sendFlowAReminder, sendFlowBReminder } from "@/notifications/send";

const TEST_EMAIL = "kesharwanis084@gmail.com";
const TEST_CHECKLIST_URL = "http://localhost:3000/application/test-app-id/checklist";
const TEST_NAME = "Shubh";

async function main() {
  console.log(`📧 Sending all 6 reminder email templates to ${TEST_EMAIL}...\n`);

  // Flow A: 4 emails
  const flowAEmails = [1, 2, 3, 4] as const;
  for (const emailNum of flowAEmails) {
    try {
      console.log(`  Flow A Email ${emailNum}/4...`);
      await sendFlowAReminder({
        to: TEST_EMAIL,
        name: TEST_NAME,
        checklistUrl: TEST_CHECKLIST_URL,
        emailNumber: emailNum,
      });
      console.log(`  ✅ Sent\n`);
    } catch (err) {
      console.error(`  ❌ Failed:`, err);
    }
  }

  // Flow B: 2 emails
  const flowBEmails = [1, 2] as const;
  for (const emailNum of flowBEmails) {
    try {
      console.log(`  Flow B Email ${emailNum}/2...`);
      await sendFlowBReminder({
        to: TEST_EMAIL,
        name: TEST_NAME,
        checklistUrl: TEST_CHECKLIST_URL,
        emailNumber: emailNum,
      });
      console.log(`  ✅ Sent\n`);
    } catch (err) {
      console.error(`  ❌ Failed:`, err);
    }
  }

  console.log("✨ All emails sent! Check your inbox.");
  console.log("\nFlow A (4 emails): Dream → Done hard part → Checklist → Last call");
  console.log("Flow B (2 emails): Dream + started → Still thinking? + reassurance");
}

main();
