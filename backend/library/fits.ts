import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import { ensureUser } from "../shared/utils";
import type { Fit } from "../shared/types";

interface ListFitsRequest {
  limit?: Query<number>;
  offset?: Query<number>;
}

interface FitItem extends Omit<Fit, 'original_url' | 'processed_url'> {
  original_url?: string;
  processed_url?: string;
}

interface ListFitsResponse {
  fits: FitItem[];
  total: number;
  has_more: boolean;
}

// Lists user's fits with pagination.
export const listFits = api<ListFitsRequest, ListFitsResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/library/fits" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    // Ensure user exists in database
    await ensureUser(userID, auth.email || "");

    const limit = Math.min(req.limit || 20, 100); // Max 100 per page
    const offset = req.offset || 0;

    // Get total count
    const totalResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM fits WHERE user_id = ${userID}
    `;
    const total = totalResult?.count || 0;

    // Get fits
    const fits = await db.queryAll<Fit>`
      SELECT id, user_id, name, original_url, processed_url, source_url, status, width, height, file_size, created_at
      FROM fits 
      WHERE user_id = ${userID}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Generate signed URLs
    const fitItems: FitItem[] = await Promise.all(
      fits.map(async (fit) => {
        const item: FitItem = {
          id: fit.id,
          user_id: fit.user_id,
          name: fit.name,
          source_url: fit.source_url,
          status: fit.status,
          width: fit.width,
          height: fit.height,
          file_size: fit.file_size,
          created_at: fit.created_at,
        };

        try {
          if (fit.original_url) {
            const originalUrl = await storage.signedDownloadUrl(fit.original_url, { ttl: 3600 });
            item.original_url = originalUrl.url;
          }

          if (fit.processed_url) {
            const processedUrl = await storage.signedDownloadUrl(fit.processed_url, { ttl: 3600 });
            item.processed_url = processedUrl.url;
          }
        } catch (err) {
          console.error("Failed to generate signed URLs for fit:", fit.id, err);
        }

        return item;
      })
    );

    return {
      fits: fitItems,
      total,
      has_more: offset + limit < total,
    };
  }
);