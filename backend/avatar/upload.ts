import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";

interface UploadAvatarRequest {
  filename: string;
  content_type: string;
  file_size: number;
}

interface UploadAvatarResponse {
  avatar_id: number;
  upload_url: string;
}

// Uploads and processes a full-body photo to create an avatar.
export const upload = api<UploadAvatarRequest, UploadAvatarResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/avatar" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;
    const email = auth.email;

    console.log('Avatar upload request:', req);
    console.log('User:', userID, email);

    try {
      // Ensure user exists first
      try {
        await db.exec`
          INSERT INTO users (id, email) 
          VALUES (${userID}, ${email}) 
          ON CONFLICT (id) DO UPDATE SET 
            email = EXCLUDED.email,
            updated_at = NOW()
        `;
        console.log('User ensured');
      } catch (userErr) {
        console.error('User creation error:', userErr);
        throw APIError.internal("Failed to create user record");
      }

      // Validate file
      const extension = req.filename.split('.').pop()?.toLowerCase() || 'jpg';
      console.log('File extension:', extension);
      
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
        throw APIError.invalidArgument("Invalid file format. Only JPG, PNG, and WebP are supported.");
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(req.content_type)) {
        throw APIError.invalidArgument("Invalid content type. Only JPEG, PNG, and WebP are supported.");
      }

      if (req.file_size > 10 * 1024 * 1024) { // 10MB limit
        throw APIError.invalidArgument("File size must not exceed 10MB");
      }

      // Generate file path
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2);
      const fileName = `avatars/originals/${userID}/${timestamp}-${random}.${extension}`;

      console.log('Generated filename:', fileName);

      // Create database record
      try {
        const avatar = await db.queryRow<{
          id: number;
          user_id: string;
          original_url: string;
          status: string;
          file_size: number;
          created_at: Date;
        }>`
          INSERT INTO avatars (user_id, original_url, status, file_size)
          VALUES (${userID}, ${fileName}, 'pending', ${req.file_size})
          RETURNING id, user_id, original_url, status, file_size, created_at
        `;

        console.log('Avatar created:', avatar);

        if (!avatar) {
          throw new Error("No avatar returned from database");
        }

        // Generate signed upload URL
        const uploadUrl = await storage.signedUploadUrl(fileName, {
          ttl: 3600, // 1 hour
        });

        console.log('Upload URL generated successfully');

        return {
          avatar_id: avatar.id,
          upload_url: uploadUrl.url,
        };
      } catch (dbErr) {
        console.error('Database error:', dbErr);
        throw APIError.internal("Failed to create avatar record in database");
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      if (err instanceof APIError) {
        throw err;
      }
      throw APIError.internal("Failed to create avatar: " + (err as Error).message);
    }
  }
);