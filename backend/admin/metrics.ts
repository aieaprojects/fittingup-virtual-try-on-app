import { api } from "encore.dev/api";
import { db } from "../shared/db";

interface MetricsResponse {
  users: {
    total: number;
    active_today: number;
    new_this_week: number;
  };
  content: {
    avatars: number;
    fits: number;
    completed_tryons: number;
  };
  jobs: {
    pending: number;
    processing: number;
    completed_today: number;
    failed_today: number;
  };
  moderation: {
    flagged_content: number;
    pending_review: number;
  };
}

// Gets usage statistics and metrics for admin dashboard.
export const getMetrics = api<void, MetricsResponse>(
  { expose: true, method: "GET", path: "/admin/metrics" },
  async () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // User metrics
    const totalUsers = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM users
    `;

    const activeToday = await db.queryRow<{ count: number }>`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM tryon_jobs 
      WHERE DATE(created_at) = ${today}
    `;

    const newThisWeek = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= ${weekAgo}
    `;

    // Content metrics
    const totalAvatars = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM avatars WHERE status = 'completed'
    `;

    const totalFits = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM fits WHERE status = 'completed'
    `;

    const completedTryons = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM tryon_jobs WHERE status = 'completed'
    `;

    // Job metrics
    const pendingJobs = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM tryon_jobs WHERE status = 'pending'
    `;

    const processingJobs = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM tryon_jobs WHERE status = 'processing'
    `;

    const completedToday = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count 
      FROM tryon_jobs 
      WHERE status = 'completed' AND DATE(updated_at) = ${today}
    `;

    const failedToday = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count 
      FROM tryon_jobs 
      WHERE status = 'failed' AND DATE(updated_at) = ${today}
    `;

    // Moderation metrics
    const flaggedContent = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM moderation_flags
    `;

    const pendingReview = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM moderation_flags WHERE reviewed = false
    `;

    return {
      users: {
        total: totalUsers?.count || 0,
        active_today: activeToday?.count || 0,
        new_this_week: newThisWeek?.count || 0,
      },
      content: {
        avatars: totalAvatars?.count || 0,
        fits: totalFits?.count || 0,
        completed_tryons: completedTryons?.count || 0,
      },
      jobs: {
        pending: pendingJobs?.count || 0,
        processing: processingJobs?.count || 0,
        completed_today: completedToday?.count || 0,
        failed_today: failedToday?.count || 0,
      },
      moderation: {
        flagged_content: flaggedContent?.count || 0,
        pending_review: pendingReview?.count || 0,
      },
    };
  }
);
