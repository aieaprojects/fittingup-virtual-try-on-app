import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";

// Test endpoint to simulate different credit scenarios
export const testScenario = api(
  { method: "POST", path: "/credits/test", auth: true, expose: true },
  async ({ scenario }: { scenario: string }): Promise<{ success: boolean; message: string }> => {
    const auth = getAuthData()!;
    const userId = auth.userID;

    switch (scenario) {
      case "reset_to_free":
        await db.exec`
          UPDATE users
          SET plan = 'free',
              credits_total = 3,
              credits_used_this_period = 0,
              period_start = NOW(),
              period_end = NOW() + INTERVAL '1 month'
          WHERE id = ${userId}
        `;
        return { success: true, message: "Reset to free plan with 3 credits" };

      case "use_all_credits":
        await db.exec`
          UPDATE users
          SET credits_used_this_period = credits_total
          WHERE id = ${userId}
        `;
        return { success: true, message: "Used all credits" };

      case "reset_to_starter":
        await db.exec`
          UPDATE users
          SET plan = 'starter',
              credits_total = 30,
              credits_used_this_period = 0,
              period_start = NOW(),
              period_end = NOW() + INTERVAL '1 month'
          WHERE id = ${userId}
        `;
        return { success: true, message: "Reset to starter plan with 30 credits" };

      case "expire_period":
        await db.exec`
          UPDATE users
          SET period_end = NOW() - INTERVAL '1 day'
          WHERE id = ${userId}
        `;
        return { success: true, message: "Expired current period" };

      default:
        return { success: false, message: "Unknown scenario" };
    }
  }
);