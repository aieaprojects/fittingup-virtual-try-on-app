import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";

interface RetryTryonRequest {
  job_id: number;
}

interface RetryTryonResponse {
  success: boolean;
  status: string;
}

// Retries a failed try-on job.
export const retry = api<RetryTryonRequest, RetryTryonResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/tryon/retry" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    console.log('Retrying try-on job:', req.job_id, 'for user:', userID);

    // Get the job details
    const job = await db.queryRow<{
      id: number;
      user_id: string;
      avatar_id: number;
      fit_id: number;
      status: string;
    }>`
      SELECT id, user_id, avatar_id, fit_id, status
      FROM tryon_jobs 
      WHERE id = ${req.job_id} AND user_id = ${userID}
    `;

    if (!job) {
      throw APIError.notFound("Try-on job not found");
    }

    if (job.status !== 'failed') {
      throw APIError.invalidArgument("Can only retry failed jobs");
    }

    try {
      // Reset job status to pending
      await db.exec`
        UPDATE tryon_jobs 
        SET status = 'pending', error_message = NULL, updated_at = NOW()
        WHERE id = ${req.job_id}
      `;

      // Get avatar and fit details to restart processing
      const avatar = await db.queryRow<{ original_url: string }>`
        SELECT original_url FROM avatars WHERE id = ${job.avatar_id}
      `;

      const fit = await db.queryRow<{ original_url: string }>`
        SELECT original_url FROM fits WHERE id = ${job.fit_id}
      `;

      if (!avatar || !fit) {
        throw APIError.notFound("Avatar or fit not found");
      }

      // Import the processing function from start.ts
      const { processJobAsync } = await import('./start');
      
      // Restart processing
      processJobAsync(job.id, avatar.original_url, fit.original_url, {}, userID);

      return {
        success: true,
        status: 'pending',
      };
    } catch (err) {
      console.error('Retry failed:', err);
      throw APIError.internal("Failed to retry try-on job");
    }
  }
);