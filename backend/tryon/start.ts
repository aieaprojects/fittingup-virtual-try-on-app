import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import { submitNanoBananaJob, checkNanoBananaJobStatus, downloadAndStoreResult } from "./nanobana";
import type { TryonJob } from "../shared/types";
import * as credits from "../credits/credits";

interface StartTryonRequest {
  avatar_id: number;
  fit_id: number;
  options?: {
    style?: string;
    fit?: string;
    lighting?: string;
  };
}

interface StartTryonResponse {
  job_id: number;
  status: string;
}

// Starts a virtual try-on job using Nano Banana API.
export const start = api<StartTryonRequest, StartTryonResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/tryon" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;
    const email = auth.email;

    console.log('Starting try-on job for user:', userID);

    try {
      // Ensure user exists
      await db.exec`
        INSERT INTO users (id, email) 
        VALUES (${userID}, ${email}) 
        ON CONFLICT (id) DO UPDATE SET 
          email = EXCLUDED.email,
          updated_at = NOW()
      `;

      // Check if user has credits available
      const creditCheck = await credits.checkCredits();
      if (!creditCheck.has_credits) {
        throw APIError.failedPrecondition("Insufficient credits");
      }

      // Verify avatar belongs to user and is ready
      const avatar = await db.queryRow<{ id: number; status: string; original_url: string }>`
        SELECT id, status, original_url
        FROM avatars 
        WHERE id = ${req.avatar_id} AND user_id = ${userID}
      `;

      if (!avatar) {
        throw APIError.notFound("Avatar not found");
      }

      if (avatar.status !== 'completed' || !avatar.original_url) {
        throw APIError.failedPrecondition("Avatar is not ready for try-on");
      }

      // Verify fit belongs to user and is ready
      const fit = await db.queryRow<{ id: number; status: string; original_url: string }>`
        SELECT id, status, original_url
        FROM fits 
        WHERE id = ${req.fit_id} AND user_id = ${userID}
      `;

      if (!fit) {
        throw APIError.notFound("Fit not found");
      }

      if (fit.status !== 'completed' || !fit.original_url) {
        throw APIError.failedPrecondition("Fit is not ready for try-on");
      }

      try {
        // Create try-on job record
        const job = await db.queryRow<TryonJob>`
          INSERT INTO tryon_jobs (user_id, avatar_id, fit_id, status, options)
          VALUES (${userID}, ${req.avatar_id}, ${req.fit_id}, 'pending', ${JSON.stringify(req.options || {})})
          RETURNING id, user_id, avatar_id, fit_id, status, result_url, nano_banana_job_id, error_message, options, created_at, updated_at
        `;

        if (!job) {
          throw APIError.internal("Failed to create try-on job");
        }

        // Start the try-on process immediately
        processJobAsync(job.id, avatar.original_url, fit.original_url, req.options, userID);

        return {
          job_id: job.id,
          status: job.status,
        };
      } catch (err) {
        throw APIError.internal("Failed to start try-on job", err as Error);
      }
    } catch (err) {
      throw APIError.internal("Failed to start try-on job", err as Error);
    }
  }
);

// Process try-on job using Gemini API
export async function processJobAsync(
  jobId: number, 
  avatarUrl: string, 
  fitUrl: string, 
  options?: any,
  userId?: string
): Promise<void> {
  console.log('Processing job:', jobId, 'with avatar:', avatarUrl, 'and fit:', fitUrl);
  
  try {
    // Update job status to processing
    await db.exec`
      UPDATE tryon_jobs 
      SET status = 'processing', updated_at = NOW()
      WHERE id = ${jobId}
    `;

    // Get signed URLs for the images so Gemini can access them
    let avatarSignedUrl: string;
    let fitSignedUrl: string;

    try {
      const avatarSigned = await storage.signedDownloadUrl(avatarUrl, { ttl: 3600 });
      const fitSigned = await storage.signedDownloadUrl(fitUrl, { ttl: 3600 });
      avatarSignedUrl = avatarSigned.url;
      fitSignedUrl = fitSigned.url;
    } catch (urlError) {
      console.error('Error generating signed URLs:', urlError);
      throw new Error(`Failed to generate signed URLs for images: ${urlError}`);
    }

    console.log('Generated signed URLs for Gemini');

    // Submit job to Gemini - this returns immediately with the result
    const geminiJobId = await submitNanoBananaJob(
      userId || 'unknown',
      avatarSignedUrl,
      fitSignedUrl,
      options
    );

    console.log('Submitted to Gemini with job ID:', geminiJobId);

    // Update our job with Gemini job ID
    await db.exec`
      UPDATE tryon_jobs 
      SET nano_banana_job_id = ${geminiJobId}, updated_at = NOW()
      WHERE id = ${jobId}
    `;

    // Check the job status (Gemini jobs complete immediately or are demo jobs)
    const status = await checkNanoBananaJobStatus(geminiJobId);
    console.log(`Job ${jobId} - Gemini status:`, status);

    if (status.status === 'completed' && status.result_url) {
      // Use the result URL directly
      const finalResultUrl = await downloadAndStoreResult(userId || 'unknown', status.result_url);
      console.log('Final result URL for job', jobId, ':', finalResultUrl);

      // Update job with success
      await db.exec`
        UPDATE tryon_jobs 
        SET status = 'completed', 
            result_url = ${finalResultUrl}, 
            options = COALESCE(options, '{}')::jsonb || '{"saved_to_gallery": true}'::jsonb,
            updated_at = NOW()
        WHERE id = ${jobId}
      `;
      
      // Deduct credit for successful generation
      try {
        await credits.deductCredit({ job_id: jobId });
        console.log('Credit deducted for job:', jobId);
      } catch (creditError) {
        console.error('Failed to deduct credit for job', jobId, ':', creditError);
        // Don't fail the job if credit deduction fails
      }
      
      console.log('Job completed successfully and auto-saved to My Looks:', jobId);
      return;
    } else if (status.status === 'failed' || status.error) {
      throw new Error(status.error || 'Gemini job failed');
    } else if (status.status === 'processing') {
      // For demo mode, poll a few times
      let attempts = 0;
      const maxAttempts = 10; // 50 seconds max (5 second intervals)
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        attempts++;

        try {
          const updatedStatus = await checkNanoBananaJobStatus(geminiJobId);
          console.log(`Job ${jobId} - Attempt ${attempts}/${maxAttempts} - Status:`, updatedStatus);

          if (updatedStatus.status === 'completed' && updatedStatus.result_url) {
            const finalResultUrl = await downloadAndStoreResult(userId || 'unknown', updatedStatus.result_url);
            console.log('Final result URL for job', jobId, ':', finalResultUrl);

            await db.exec`
              UPDATE tryon_jobs 
              SET status = 'completed', 
                  result_url = ${finalResultUrl}, 
                  options = COALESCE(options, '{}')::jsonb || '{"saved_to_gallery": true}'::jsonb,
                  updated_at = NOW()
              WHERE id = ${jobId}
            `;
            
            // Deduct credit for successful generation
            try {
              await credits.deductCredit({ job_id: jobId });
              console.log('Credit deducted for job:', jobId);
            } catch (creditError) {
              console.error('Failed to deduct credit for job', jobId, ':', creditError);
              // Don't fail the job if credit deduction fails
            }
            
            console.log('Job completed successfully and auto-saved to My Looks:', jobId);
            return;
          } else if (updatedStatus.status === 'failed' || updatedStatus.error) {
            throw new Error(updatedStatus.error || 'Job failed');
          }
        } catch (pollError) {
          console.error(`Job ${jobId} - Error polling status (attempt ${attempts}):`, pollError);
          if (attempts >= maxAttempts) {
            throw pollError;
          }
        }
      }

      throw new Error(`Job timed out after ${maxAttempts} attempts`);
    }

  } catch (err) {
    console.error('Try-on job failed for job ID', jobId, ':', err);
    
    // Update job with error
    const errorMessage = err instanceof Error ? err.message : String(err);
    await db.exec`
      UPDATE tryon_jobs 
      SET status = 'failed', error_message = ${errorMessage}, updated_at = NOW()
      WHERE id = ${jobId}
    `;
  }
}
