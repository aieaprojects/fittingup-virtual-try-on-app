import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";

interface SaveResultRequest {
  job_id: number;
}

interface SaveResultResponse {
  success: boolean;
  message: string;
  current_saves?: number;
  limit?: number;
}

// Storage limits based on subscription tiers
const STORAGE_LIMITS = {
  free: 0,       // No saved images allowed
  starter: 10,   // Maximum of 10 saved images
  premium: 50,   // Maximum of 50 saved images
  exclusive: 100 // Maximum of 100 saved images
};

// Saves a completed try-on result to user's gallery.
export const saveResult = api<SaveResultRequest, SaveResultResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/library/save-result" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    // Get user's plan and current saved results count
    const user = await db.queryRow<{
      plan: string;
    }>`
      SELECT plan FROM users WHERE id = ${userID}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    const plan = user.plan || 'free';
    const storageLimit = STORAGE_LIMITS[plan as keyof typeof STORAGE_LIMITS] || 0;

    // Free plan users cannot save
    if (plan === 'free') {
      throw APIError.permissionDenied("Upgrade to save your looks. Free plan users cannot save results.");
    }

    // Count current saved results for this user
    const currentSavedCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM tryon_jobs 
      WHERE user_id = ${userID} 
      AND status = 'completed'
      AND options->>'saved_to_gallery' = 'true'
    `;

    const currentSaves = currentSavedCount?.count || 0;

    // Check if user has reached their storage limit
    if (currentSaves >= storageLimit) {
      return {
        success: false,
        message: `You've reached your limit for saved looks (${currentSaves}/${storageLimit}). Upgrade your plan to store more.`,
        current_saves: currentSaves,
        limit: storageLimit
      };
    }

    // Verify the job belongs to the user and is completed
    const job = await db.queryRow<{ 
      id: number; 
      status: string; 
      result_url: string;
      user_id: string;
      options: any;
    }>`
      SELECT id, status, result_url, user_id, options
      FROM tryon_jobs 
      WHERE id = ${req.job_id}
    `;

    if (!job) {
      throw APIError.notFound("Try-on job not found");
    }

    if (job.user_id !== userID) {
      throw APIError.permissionDenied("Access denied");
    }

    if (job.status !== 'completed' || !job.result_url) {
      throw APIError.failedPrecondition("Try-on job is not completed or has no result");
    }

    // Check if already saved
    if (job.options?.saved_to_gallery) {
      return {
        success: true,
        message: "Result is already saved to gallery",
        current_saves: currentSaves,
        limit: storageLimit
      };
    }

    // Save the result
    try {
      await db.exec`
        UPDATE tryon_jobs 
        SET options = COALESCE(options, '{}')::jsonb || '{"saved_to_gallery": true}'::jsonb,
            updated_at = NOW()
        WHERE id = ${req.job_id}
      `;

      return {
        success: true,
        message: "Result saved to gallery successfully",
        current_saves: currentSaves + 1,
        limit: storageLimit
      };
    } catch (err) {
      throw APIError.internal("Failed to save result to gallery", err as Error);
    }
  }
);