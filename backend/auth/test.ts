import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../shared/db";
import { ensureUser } from "../shared/utils";

export interface TestResponse {
  message: string;
  userID: string;
  email: string;
  userExists: boolean;
  databaseConnected: boolean;
}

// Test endpoint to verify auth and database connection
export const test = api<void, TestResponse>(
  { auth: true, expose: true, method: "GET", path: "/api/auth/test" },
  async () => {
    const auth = getAuthData()!;
    
    // Test database connection
    let databaseConnected = false;
    try {
      await db.queryRow`SELECT 1 as test`;
      databaseConnected = true;
    } catch (err) {
      console.error("Database connection test failed:", err);
    }

    // Ensure user exists
    await ensureUser(auth.userID, auth.email || "");

    // Check if user exists in database
    let userExists = false;
    try {
      const user = await db.queryRow`
        SELECT id FROM users WHERE id = ${auth.userID}
      `;
      userExists = !!user;
    } catch (err) {
      console.error("User lookup failed:", err);
    }

    return {
      message: "Authentication test successful",
      userID: auth.userID,
      email: auth.email || "",
      userExists,
      databaseConnected,
    };
  }
);