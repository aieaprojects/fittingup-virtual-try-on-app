import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";

// Deletes all user data for GDPR compliance.
export const deleteData = api<void, { success: boolean }>(
  { auth: true, expose: true, method: "DELETE", path: "/auth/data" },
  async () => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    try {
      // Start transaction
      await using tx = await db.begin();

      // Get all user's files for deletion
      const avatars = await tx.queryAll<{ original_url: string; processed_url: string }>`
        SELECT original_url, processed_url FROM avatars WHERE user_id = ${userID}
      `;

      const fits = await tx.queryAll<{ original_url: string; processed_url: string }>`
        SELECT original_url, processed_url FROM fits WHERE user_id = ${userID}
      `;

      const results = await tx.queryAll<{ result_url: string }>`
        SELECT result_url FROM tryon_jobs WHERE user_id = ${userID} AND result_url IS NOT NULL
      `;

      // Delete database records
      await tx.exec`DELETE FROM tryon_jobs WHERE user_id = ${userID}`;
      await tx.exec`DELETE FROM fits WHERE user_id = ${userID}`;
      await tx.exec`DELETE FROM avatars WHERE user_id = ${userID}`;
      await tx.exec`DELETE FROM moderation_flags WHERE user_id = ${userID}`;
      await tx.exec`DELETE FROM rate_limits WHERE user_id = ${userID}`;

      // Commit transaction
      await tx.commit();

      // Delete files from storage (async, don't wait)
      const filesToDelete = [
        ...avatars.flatMap(a => [a.original_url, a.processed_url].filter(Boolean)),
        ...fits.flatMap(f => [f.original_url, f.processed_url].filter(Boolean)),
        ...results.map(r => r.result_url).filter(Boolean),
      ];

      // Delete files in background
      Promise.all(
        filesToDelete.map(async (url) => {
          try {
            const fileName = new URL(url).pathname.substring(1);
            await storage.remove(fileName);
          } catch (err) {
            console.error("Failed to delete file:", url, err);
          }
        })
      ).catch(err => console.error("Bulk file deletion failed:", err));

      return { success: true };
    } catch (err) {
      throw APIError.internal("failed to delete user data", err as Error);
    }
  }
);
