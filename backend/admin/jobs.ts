import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { db } from "../shared/db";

interface ListJobsRequest {
  status?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface JobInfo {
  id: number;
  user_id: string;
  avatar_id: number;
  fit_id: number;
  status: string;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

interface ListJobsResponse {
  jobs: JobInfo[];
  total: number;
  has_more: boolean;
}

// Lists try-on jobs for admin monitoring.
export const listJobs = api<ListJobsRequest, ListJobsResponse>(
  { expose: true, method: "GET", path: "/admin/jobs" },
  async (req) => {
    const limit = Math.min(req.limit || 50, 200);
    const offset = req.offset || 0;
    const status = req.status;

    let whereClause = "";
    let params: any[] = [];

    if (status) {
      whereClause = "WHERE status = $1";
      params = [status];
    }

    // Get total count
    const totalResult = await db.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM tryon_jobs ${whereClause}`,
      ...params
    );
    const total = totalResult?.count || 0;

    // Get jobs
    const jobs = await db.rawQueryAll<JobInfo>(
      `SELECT id, user_id, avatar_id, fit_id, status, error_message, created_at, updated_at
       FROM tryon_jobs ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      ...params,
      limit,
      offset
    );

    return {
      jobs,
      total,
      has_more: offset + limit < total,
    };
  }
);
