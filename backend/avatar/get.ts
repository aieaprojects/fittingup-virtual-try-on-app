import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import { ensureUser } from "../shared/utils";
import type { Avatar } from "../shared/types";

interface GetAvatarResponse extends Omit<Avatar, 'original_url' | 'processed_url'> {
  original_url?: string;
  processed_url?: string;
}

// Retrieves avatar details and signed URLs.
export const get = api<{ id: number }, GetAvatarResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/avatar/:id" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    // Ensure user exists in database
    await ensureUser(userID, auth.email || "");

    const avatar = await db.queryRow<Avatar>`
      SELECT id, user_id, original_url, processed_url, status, width, height, file_size, created_at
      FROM avatars 
      WHERE id = ${req.id} AND user_id = ${userID}
    `;

    if (!avatar) {
      throw APIError.notFound("Avatar not found");
    }

    // Generate signed URLs for existing files
    const response: GetAvatarResponse = {
      id: avatar.id,
      user_id: avatar.user_id,
      status: avatar.status,
      width: avatar.width,
      height: avatar.height,
      file_size: avatar.file_size,
      created_at: avatar.created_at,
    };

    try {
      if (avatar.original_url) {
        const originalUrl = await storage.signedDownloadUrl(avatar.original_url, { ttl: 3600 });
        response.original_url = originalUrl.url;
      }

      if (avatar.processed_url) {
        const processedUrl = await storage.signedDownloadUrl(avatar.processed_url, { ttl: 3600 });
        response.processed_url = processedUrl.url;
      }
    } catch (err) {
      console.error("Failed to generate signed URLs:", err);
      // Continue without URLs rather than failing completely
    }

    return response;
  }
);
