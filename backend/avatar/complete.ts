import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";

interface CompleteAvatarRequest {
  avatar_id: number;
}

interface CompleteAvatarResponse {
  success: boolean;
}

// Marks avatar as completed after successful file upload.
export const complete = api<CompleteAvatarRequest, CompleteAvatarResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/avatar/complete" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    console.log('Completing avatar:', req.avatar_id, 'for user:', userID);

    try {
      // Update avatar status to completed
      const result = await db.exec`
        UPDATE avatars 
        SET status = 'completed'
        WHERE id = ${req.avatar_id} AND user_id = ${userID} AND status = 'pending'
      `;

      console.log('Avatar completion result:', result);

      return {
        success: true,
      };
    } catch (err) {
      console.error('Avatar completion error:', err);
      throw APIError.internal("Failed to complete avatar");
    }
  }
);