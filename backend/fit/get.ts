import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import type { Fit } from "../shared/types";

interface GetFitResponse extends Omit<Fit, 'original_url' | 'processed_url'> {
  original_url?: string;
  processed_url?: string;
}

// Retrieves fit details and signed URLs.
export const get = api<{ id: number }, GetFitResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/fits/:id" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    const fit = await db.queryRow<Fit>`
      SELECT id, user_id, name, original_url, processed_url, source_url, status, width, height, file_size, created_at
      FROM fits 
      WHERE id = ${req.id} AND user_id = ${userID}
    `;

    if (!fit) {
      throw APIError.notFound("Fit not found");
    }

    // Generate signed URLs for existing files
    const response: GetFitResponse = {
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
        response.original_url = originalUrl.url;
      }

      if (fit.processed_url) {
        const processedUrl = await storage.signedDownloadUrl(fit.processed_url, { ttl: 3600 });
        response.processed_url = processedUrl.url;
      }
    } catch (err) {
      console.error("Failed to generate signed URLs:", err);
      // Continue without URLs rather than failing completely
    }

    return response;
  }
);