import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import type { TryonJob } from "../shared/types";

interface JobStatusResponse extends Omit<TryonJob, 'result_url'> {
  result_url?: string;
}

// Gets the status and result of a try-on job.
export const status = api<{ job_id: number }, JobStatusResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/tryon/:job_id" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    const job = await db.queryRow<TryonJob>`
      SELECT id, user_id, avatar_id, fit_id, status, result_url, nano_banana_job_id, error_message, options, created_at, updated_at
      FROM tryon_jobs 
      WHERE id = ${req.job_id} AND user_id = ${userID}
    `;

    if (!job) {
      throw APIError.notFound("Try-on job not found");
    }

    const response: JobStatusResponse = {
      id: job.id,
      user_id: job.user_id,
      avatar_id: job.avatar_id,
      fit_id: job.fit_id,
      status: job.status,
      nano_banana_job_id: job.nano_banana_job_id,
      error_message: job.error_message,
      options: job.options,
      created_at: job.created_at,
      updated_at: job.updated_at,
    };

    // Handle result URL - either signed URL or direct URL
    if (job.result_url) {
      try {
        // If it's already a full HTTP URL, use it directly
        if (job.result_url.startsWith('http')) {
          response.result_url = job.result_url;
        } else {
          // If it's a storage path, generate signed URL
          const signedUrl = await storage.signedDownloadUrl(job.result_url, { ttl: 3600 });
          response.result_url = signedUrl.url;
        }
      } catch (err) {
        console.error("Failed to process result URL:", err);
        // If signed URL generation fails, try using the original URL
        response.result_url = job.result_url;
      }
    }

    return response;
  }
);
