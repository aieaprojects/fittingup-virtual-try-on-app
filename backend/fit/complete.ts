import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";

interface CompleteFitRequest {
  fit_id: number;
}

interface CompleteFitResponse {
  success: boolean;
}

// Marks fit as completed after successful file upload.
export const complete = api<CompleteFitRequest, CompleteFitResponse>(
  { auth: true, expose: true, method: "POST", path: "/api/fits/complete" },
  async (req) => {
    const auth = getAuthData()!;
    const userID = auth.userID;

    console.log('Completing fit:', req.fit_id, 'for user:', userID);

    try {
      // Update fit status to completed
      const result = await db.exec`
        UPDATE fits 
        SET status = 'completed'
        WHERE id = ${req.fit_id} AND user_id = ${userID} AND status = 'pending'
      `;

      console.log('Fit completion result:', result);

      return {
        success: true,
      };
    } catch (err) {
      console.error('Fit completion error:', err);
      throw APIError.internal("Failed to complete fit");
    }
  }
);