import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";
import { ensureUser } from "../shared/utils";
import type { Avatar } from "../shared/types";

interface ListAvatarsRequest {
  limit?: Query<number>;
  offset?: Query<number>;
}

interface AvatarItem extends Omit<Avatar, 'original_url' | 'processed_url'> {
  original_url?: string;
  processed_url?: string;
}

interface ListAvatarsResponse {
  avatars: AvatarItem[];
  total: number;
  has_more: boolean;
}

// Lists user's avatars with pagination.
export const listAvatars = api<ListAvatarsRequest, ListAvatarsResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/library/avatars" },
  async (req) => {
    console.log("listAvatars: Starting request for user");
    
    try {
      const auth = getAuthData()!;
      const userID = auth.userID;
      console.log("listAvatars: User ID:", userID?.substring(0, 8) + "...");

      // Ensure user exists in database
      console.log("listAvatars: Ensuring user exists...");
      await ensureUser(userID, auth.email || "");
      console.log("listAvatars: User ensured successfully");

      const limit = Math.min(req.limit || 20, 100); // Max 100 per page
      const offset = req.offset || 0;
      console.log("listAvatars: Query params - limit:", limit, "offset:", offset);

    // Get total count
    console.log("listAvatars: Getting total count...");
    const totalResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM avatars WHERE user_id = ${userID}
    `;
    const total = totalResult?.count || 0;
    console.log("listAvatars: Total avatars:", total);

    // For new users with no data, return empty state
    if (total === 0) {
      console.log("listAvatars: No avatars found, returning empty state");
      return {
        avatars: [],
        total: 0,
        has_more: false,
      };
    }

    // Get avatars
    console.log("listAvatars: Getting avatars...");
    const avatars = await db.queryAll<Avatar>`
      SELECT id, user_id, original_url, processed_url, status, width, height, file_size, created_at
      FROM avatars 
      WHERE user_id = ${userID}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    console.log("listAvatars: Found", avatars.length, "avatars");

    // Generate signed URLs
    console.log("listAvatars: Generating signed URLs...");
    const avatarItems: AvatarItem[] = await Promise.all(
      avatars.map(async (avatar) => {
        const item: AvatarItem = {
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
            item.original_url = originalUrl.url;
          }

          if (avatar.processed_url) {
            const processedUrl = await storage.signedDownloadUrl(avatar.processed_url, { ttl: 3600 });
            item.processed_url = processedUrl.url;
          }
        } catch (err) {
          console.error("Failed to generate signed URLs for avatar:", avatar.id, err);
        }

        return item;
      })
    );

    console.log("listAvatars: Returning response with", avatarItems.length, "items");
    return {
      avatars: avatarItems,
      total,
      has_more: offset + limit < total,
    };
    } catch (error) {
      console.error("listAvatars: Error occurred:", error);
      throw error;
    }
  }
);
