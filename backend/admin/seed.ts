import { api } from "encore.dev/api";
import { db } from "../shared/db";
import { storage } from "../shared/storage";

// Creates demo content for testing purposes.
export const seed = api<void, { success: boolean; message: string }>(
  { expose: true, method: "POST", path: "/admin/seed" },
  async () => {
    try {
      // Create test user
      const testUserId = "user_test123";
      const testEmail = "test@clozet.com";

      await db.exec`
        INSERT INTO users (id, email) 
        VALUES (${testUserId}, ${testEmail}) 
        ON CONFLICT (id) DO NOTHING
      `;

      // Create demo avatar
      const avatarId = await db.queryRow<{ id: number }>`
        INSERT INTO avatars (user_id, original_url, processed_url, status, width, height)
        VALUES (${testUserId}, 'demo/avatar-original.jpg', 'demo/avatar-processed.jpg', 'completed', 1024, 1536)
        ON CONFLICT DO NOTHING
        RETURNING id
      `;

      // Create demo fits
      const fitIds: number[] = [];
      const fits = [
        { name: "Blue Denim Jacket", url: "demo/fit-jacket.jpg" },
        { name: "Red Summer Dress", url: "demo/fit-dress.jpg" },
        { name: "White Cotton T-Shirt", url: "demo/fit-tshirt.jpg" },
      ];

      for (const fit of fits) {
        const fitId = await db.queryRow<{ id: number }>`
          INSERT INTO fits (user_id, name, original_url, processed_url, status, width, height)
          VALUES (${testUserId}, ${fit.name}, ${fit.url}, ${fit.url}, 'completed', 512, 768)
          ON CONFLICT DO NOTHING
          RETURNING id
        `;
        if (fitId) {
          fitIds.push(fitId.id);
        }
      }

      // Create demo try-on results
      if (avatarId && fitIds.length > 0) {
        for (const fitId of fitIds) {
          await db.exec`
            INSERT INTO tryon_jobs (user_id, avatar_id, fit_id, status, result_url)
            VALUES (${testUserId}, ${avatarId.id}, ${fitId}, 'completed', 'demo/result-${fitId}.jpg')
            ON CONFLICT DO NOTHING
          `;
        }
      }

      return {
        success: true,
        message: `Demo content created for user ${testEmail}. Avatar ID: ${avatarId?.id}, Fit IDs: ${fitIds.join(', ')}`
      };
    } catch (err) {
      return {
        success: false,
        message: `Failed to create demo content: ${err}`
      };
    }
  }
);
