import { api, APIError } from "encore.dev/api";
import { submitNanoBananaJob, checkNanoBananaJobStatus } from "../tryon/nanobana";

interface TestGeminiRequest {
  avatar_url: string;
  fit_url: string;
}

interface TestGeminiResponse {
  job_id: string;
  status: string;
  demo_mode: boolean;
  result_url?: string;
  error?: string;
}

// Test endpoint for Gemini API integration
export const testGemini = api<TestGeminiRequest, TestGeminiResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/admin/test-gemini" },
  async (req) => {
    try {
      console.log('Testing Gemini with:', req);

      // Submit job
      const jobId = await submitNanoBananaJob('test-user', req.avatar_url, req.fit_url);
      console.log('Gemini job submitted:', jobId);

      const isDemoMode = jobId.startsWith('demo-job-');
      const isGeminiJob = jobId.startsWith('gemini-job-');

      // For demo mode, wait a bit and check status
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        const status = await checkNanoBananaJobStatus(jobId);
        
        return {
          job_id: jobId,
          status: status.status,
          demo_mode: true,
          result_url: status.result_url,
        };
      }

      // For Gemini jobs, check status immediately
      if (isGeminiJob) {
        const status = await checkNanoBananaJobStatus(jobId);
        
        return {
          job_id: jobId,
          status: status.status,
          demo_mode: false,
          result_url: status.result_url,
        };
      }

      // Fallback
      return {
        job_id: jobId,
        status: 'submitted',
        demo_mode: false,
      };

    } catch (err) {
      console.error('Gemini test error:', err);
      return {
        job_id: '',
        status: 'error',
        demo_mode: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
);

interface CheckJobRequest {
  job_id: string;
}

// Check job status endpoint for testing
export const checkJob = api<CheckJobRequest, TestGeminiResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/admin/check-job/:job_id" },
  async (req) => {
    try {
      const status = await checkNanoBananaJobStatus(req.job_id);
      
      return {
        job_id: req.job_id,
        status: status.status,
        demo_mode: req.job_id.startsWith('demo-job-'),
        result_url: status.result_url,
        error: status.error,
      };
    } catch (err) {
      console.error('Job status check error:', err);
      return {
        job_id: req.job_id,
        status: 'error',
        demo_mode: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
);