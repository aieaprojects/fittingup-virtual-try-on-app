import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { storage } from "../shared/storage";

interface UploadFitRequest {
  name: string;
  filename: string;
  content_type: string;
  file_size: number;
}

interface UploadFitResponse {
  fit_id: number;
  upload_url: string;
}

// Uploads a fit image.
export const upload = api<UploadFitRequest, UploadFitResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/fits" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;
    const email = auth.email;

    console.log('Fit upload request:', req);
    console.log('User:', userID, email);

    try {
      // Ensure user exists
      await db.exec`
        INSERT INTO users (id, email) 
        VALUES (${userID}, ${email}) 
        ON CONFLICT (id) DO UPDATE SET 
          email = EXCLUDED.email,
          updated_at = NOW()
      `;

      // Validate file
      const extension = req.filename.split('.').pop()?.toLowerCase() || 'jpg';
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
      const fileName = `fits/originals/${userID}/${timestamp}-${random}.${extension}`;

      console.log('Generated filename:', fileName);

      // Create database record
      const fit = await db.queryRow<{
        id: number;
        user_id: string;
        name: string;
        original_url: string;
        status: string;
        file_size: number;
        created_at: Date;
      }>`
        INSERT INTO fits (user_id, name, original_url, status, file_size)
        VALUES (${userID}, ${req.name}, ${fileName}, 'pending', ${req.file_size})
        RETURNING id, user_id, name, original_url, status, file_size, created_at
      `;

      console.log('Fit created:', fit);

      if (!fit) {
        throw new Error("No fit returned from database");
      }

      // Generate signed upload URL
      const uploadUrl = await storage.signedUploadUrl(fileName, {
        ttl: 3600, // 1 hour
      });

      console.log('Upload URL generated successfully');

      return {
        fit_id: fit.id,
        upload_url: uploadUrl.url,
      };
    } catch (err) {
      console.error('Fit upload error:', err);
      if (err instanceof APIError) {
        throw err;
      }
      throw APIError.internal("Failed to create fit: " + (err as Error).message);
    }
  }
);