import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import { ensureUser } from "../shared/utils";

interface ListResultsRequest {
  limit?: Query<number>;
  offset?: Query<number>;
}

interface TryonResult {
  id: number;
  avatar_id: number;
  fit_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  created_at: Date;
  updated_at: Date;
  avatar_thumbnail?: string;
  fit_thumbnail?: string;
}

interface ListResultsResponse {
  results: TryonResult[];
  total: number;
  has_more: boolean;
}

// Lists user's try-on results with pagination.
export const listResults = api<ListResultsRequest, ListResultsResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/library/results" },
  async (req) => {
    console.log("listResults: Starting request for user");
    
    try {
      const auth = getAuthData()!;
      const userID = auth.userID;
      console.log("listResults: User ID:", userID?.substring(0, 8) + "...");

      // Ensure user exists in database
      console.log("listResults: Ensuring user exists...");
      await ensureUser(userID, auth.email || "");
      console.log("listResults: User ensured successfully");

      const limit = Math.min(req.limit || 20, 100); // Max 100 per page
      const offset = req.offset || 0;
      console.log("listResults: Query params - limit:", limit, "offset:", offset);

      // Get total count
      console.log("listResults: Getting total count...");
      const totalResult = await db.queryRow<{ count: number }>`
        SELECT COUNT(*) as count FROM tryon_jobs WHERE user_id = ${userID} AND status = 'completed'
      `;
      const total = totalResult?.count || 0;
      console.log("listResults: Total results:", total);

      // For new users with no data, return empty state
      if (total === 0) {
        console.log("listResults: No results found, returning empty state");
        return {
          results: [],
          total: 0,
          has_more: false,
        };
      }

    // Get results with avatar and fit info
    console.log("listResults: Getting results...");
    const results = await db.queryAll<{
      id: number;
      avatar_id: number;
      fit_id: number;
      status: string;
      result_url: string;
      created_at: Date;
      updated_at: Date;
      avatar_processed_url: string;
      fit_processed_url: string;
    }>`
      SELECT 
        tj.id, tj.avatar_id, tj.fit_id, tj.status, tj.result_url, tj.created_at, tj.updated_at,
        a.processed_url as avatar_processed_url,
        f.processed_url as fit_processed_url
      FROM tryon_jobs tj
      JOIN avatars a ON tj.avatar_id = a.id
      JOIN fits f ON tj.fit_id = f.id
      WHERE tj.user_id = ${userID} AND tj.status = 'completed'
      ORDER BY tj.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    console.log("listResults: Found", results.length, "results");

    // Generate signed URLs
    console.log("listResults: Generating signed URLs...");
    const resultItems: TryonResult[] = await Promise.all(
      results.map(async (result) => {
        const item: TryonResult = {
          id: result.id,
          avatar_id: result.avatar_id,
          fit_id: result.fit_id,
          status: result.status as 'pending' | 'processing' | 'completed' | 'failed',
          created_at: result.created_at,
          updated_at: result.updated_at,
        };

        try {
          if (result.result_url) {
            const resultUrl = await storage.signedDownloadUrl(result.result_url, { ttl: 3600 });
            item.result_url = resultUrl.url;
          }

          if (result.avatar_processed_url) {
            const avatarUrl = await storage.signedDownloadUrl(result.avatar_processed_url, { ttl: 3600 });
            item.avatar_thumbnail = avatarUrl.url;
          }

          if (result.fit_processed_url) {
            const fitUrl = await storage.signedDownloadUrl(result.fit_processed_url, { ttl: 3600 });
            item.fit_thumbnail = fitUrl.url;
          }
        } catch (err) {
          console.error("Failed to generate signed URLs for result:", result.id, err);
        }

        return item;
      })
    );

    console.log("listResults: Returning response with", resultItems.length, "items");
    return {
      results: resultItems,
      total,
      has_more: offset + limit < total,
    };
    } catch (error) {
      console.error("listResults: Error occurred:", error);
      throw error;
    }
  }
);
