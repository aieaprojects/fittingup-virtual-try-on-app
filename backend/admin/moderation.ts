import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { db } from "../shared/db";
import type { ModerationFlag } from "../shared/types";

interface ListFlagsRequest {
  reviewed?: Query<boolean>;
  flag_type?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListFlagsResponse {
  flags: ModerationFlag[];
  total: number;
  has_more: boolean;
}

// Lists moderation flags for admin review.
export const listFlags = api<ListFlagsRequest, ListFlagsResponse>(
  { expose: true, method: "GET", path: "/admin/moderation" },
  async (req) => {
    const limit = Math.min(req.limit || 50, 200);
    const offset = req.offset || 0;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (req.reviewed !== undefined) {
      whereConditions.push(`reviewed = $${paramIndex++}`);
      params.push(req.reviewed);
    }

    if (req.flag_type) {
      whereConditions.push(`flag_type = $${paramIndex++}`);
      params.push(req.flag_type);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const totalResult = await db.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM moderation_flags ${whereClause}`,
      ...params
    );
    const total = totalResult?.count || 0;

    // Get flags
    const flags = await db.rawQueryAll<ModerationFlag>(
      `SELECT id, user_id, content_type, content_id, flag_type, confidence, reviewed, created_at
       FROM moderation_flags ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      ...params,
      limit,
      offset
    );

    return {
      flags,
      total,
      has_more: offset + limit < total,
    };
  }
);

interface ReviewFlagRequest {
  reviewed: boolean;
}

// Marks a moderation flag as reviewed.
export const reviewFlag = api<ReviewFlagRequest & { id: number }, { success: boolean }>(
  { expose: true, method: "PUT", path: "/admin/moderation/:id/review" },
  async (req) => {
    await db.exec`
      UPDATE moderation_flags 
      SET reviewed = ${req.reviewed}
      WHERE id = ${req.id}
    `;

    return { success: true };
  }
);
