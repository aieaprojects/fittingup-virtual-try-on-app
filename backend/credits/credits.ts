import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { ensureUser, ensureUserWithConsent } from "../shared/utils";

export interface CreditInfo {
  plan: string;
  credits_total: number;
  credits_used_this_period: number;
  credits_remaining: number;
  period_start: Date;
  period_end: Date;
}

export interface CheckCreditsResponse {
  has_credits: boolean;
  credit_info: CreditInfo;
}

const PLAN_CREDITS = {
  free: 3,
  starter: 30,
  premium: 60,
  exclusive: 120
};

// Get user's current credit status
export const getCredits = api(
  { method: "GET", path: "/credits", auth: true, expose: true },
  async (): Promise<CreditInfo> => {
    console.log("getCredits: Starting request");
    
    try {
      const auth = getAuthData()!;
      const userId = auth.userID;
      console.log("getCredits: User ID:", userId?.substring(0, 8) + "...");

      // Ensure user exists in database
      console.log("getCredits: Ensuring user exists...");
      await ensureUser(userId, auth.email || "");
      console.log("getCredits: User ensured successfully");

      const user = await db.queryRow`
        SELECT plan, credits_total, credits_used_this_period, period_start, period_end
        FROM users
        WHERE id = ${userId}
      `;

      if (!user) {
        console.error("getCredits: User not found after ensureUser");
        throw new Error("User not found");
      }

      const credits_remaining = user.credits_total - user.credits_used_this_period;
      console.log("getCredits: Credits remaining:", credits_remaining);

      return {
        plan: user.plan,
        credits_total: user.credits_total,
        credits_used_this_period: user.credits_used_this_period,
        credits_remaining: Math.max(0, credits_remaining),
        period_start: user.period_start,
        period_end: user.period_end
      };
    } catch (error) {
      console.error("getCredits: Error occurred:", error);
      throw error;
    }
  }
);

// Check if user has credits available for a new generation
export const checkCredits = api(
  { method: "GET", path: "/credits/check", auth: true, expose: true },
  async (): Promise<CheckCreditsResponse> => {
    const auth = getAuthData()!;
    const userId = auth.userID;
    
    const creditInfo = await getCredits();
    
    // Reset period if needed for paid plans
    const now = new Date();
    if (creditInfo.plan !== 'free' && now >= creditInfo.period_end) {
      await resetCreditsForUser(userId, creditInfo.plan);
      // Refetch after reset
      const updatedCreditInfo = await getCredits();
      return {
        has_credits: updatedCreditInfo.credits_remaining > 0,
        credit_info: updatedCreditInfo
      };
    }

    return {
      has_credits: creditInfo.credits_remaining > 0,
      credit_info: creditInfo
    };
  }
);

// Deduct a credit when generation completes successfully
export const deductCredit = api(
  { method: "POST", path: "/credits/deduct", auth: true, expose: true },
  async ({ job_id }: { job_id: number }): Promise<{ success: boolean }> => {
    const auth = getAuthData()!;
    const userId = auth.userID;

    // Check if credit already charged for this job
    const job = await db.queryRow`
      SELECT credit_charged
      FROM tryon_jobs
      WHERE id = ${job_id} AND user_id = ${userId}
    `;

    if (!job) {
      throw new Error("Job not found");
    }

    if (job.credit_charged) {
      // Already charged, don't double-charge
      return { success: true };
    }

    // Deduct credit and mark job as charged
    await db.exec`
      UPDATE users 
      SET credits_used_this_period = credits_used_this_period + 1,
          updated_at = NOW()
      WHERE id = ${userId}
    `;

    await db.exec`
      UPDATE tryon_jobs
      SET credit_charged = TRUE
      WHERE id = ${job_id}
    `;

    return { success: true };
  }
);

// Update user's plan and recalculate credits
export const updatePlan = api(
  { method: "POST", path: "/credits/update-plan", auth: true, expose: true },
  async ({ plan }: { plan: string }): Promise<CreditInfo> => {
    const auth = getAuthData()!;
    const userId = auth.userID;

    if (!PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS]) {
      throw new Error("Invalid plan");
    }

    const credits_total = PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS];
    const now = new Date();
    const period_end = new Date(now);
    period_end.setMonth(period_end.getMonth() + 1);

    // For free plan, keep existing usage. For paid plans, reset usage
    const credits_used_this_period = plan === 'free' ? undefined : 0;

    if (plan === 'free') {
      await db.exec`
        UPDATE users
        SET plan = ${plan},
            credits_total = ${credits_total},
            updated_at = NOW()
        WHERE id = ${userId}
      `;
    } else {
      await db.exec`
        UPDATE users
        SET plan = ${plan},
            credits_total = ${credits_total},
            credits_used_this_period = 0,
            period_start = ${now},
            period_end = ${period_end},
            updated_at = NOW()
        WHERE id = ${userId}
      `;
    }

    return await getCredits();
  }
);

// Save user consent
export interface SaveConsentRequest {
  terms_accepted: boolean;
  privacy_accepted: boolean;
}

export const saveConsent = api(
  { method: "POST", path: "/credits/consent", auth: true, expose: true },
  async (req: SaveConsentRequest): Promise<{ success: boolean }> => {
    const auth = getAuthData()!;
    const userID = auth.userID;
    
    // Update user consent in the database
    await db.exec`
      UPDATE users 
      SET 
        terms_accepted = ${req.terms_accepted},
        privacy_accepted = ${req.privacy_accepted},
        consent_date = ${new Date()},
        updated_at = NOW()
      WHERE id = ${userID}
    `;

    return { success: true };
  }
);

// Ensure user exists with consent
export interface EnsureUserRequest {
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
}

export const ensureUserWithConsentAPI = api(
  { method: "POST", path: "/credits/ensure-user", auth: true, expose: true },
  async (req: EnsureUserRequest): Promise<{ success: boolean }> => {
    const auth = getAuthData()!;
    const { userID, email } = auth;
    
    // Create/update user with consent info
    await ensureUserWithConsent(
      userID, 
      email || '', 
      req.terms_accepted || false, 
      req.privacy_accepted || false
    );

    return { success: true };
  }
);

// Reset credits for a user (called automatically for paid plans)
async function resetCreditsForUser(userId: string, plan: string): Promise<void> {
  if (plan === 'free') {
    // Free plan credits don't reset
    return;
  }

  const now = new Date();
  const period_end = new Date(now);
  period_end.setMonth(period_end.getMonth() + 1);

  await db.exec`
    UPDATE users
    SET credits_used_this_period = 0,
        period_start = ${now},
        period_end = ${period_end},
        updated_at = NOW()
    WHERE id = ${userId}
  `;
}