import { createClerkClient, verifyToken } from "@clerk/backend";
import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const clerkSecretKey = secret("ClerkSecretKey");
const clerkClient = createClerkClient({ 
  secretKey: clerkSecretKey()
});

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string;
}

const AUTHORIZED_PARTIES = [
  "https://app.fitvueapp.com",
  "https://accounts.fitvueapp.com", 
  "https://fittingup-virtual-try-on-app-d31guls82vjuu9qf5mag.lp.dev",
  "http://localhost:3000",
  "https://localhost:3000",
  "https://clerk.fitvueapp.com",
  "https://fitvueapp.com",
  "https://www.fitvueapp.com",
  "fitvueapp.com"
];

export const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    console.log("Auth handler: Starting authentication");
    
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      console.log("Auth handler: No token provided");
      throw APIError.unauthenticated("missing token");
    }

    console.log("Auth handler: Token received, length:", token.length);
    console.log("Auth handler: Token starts with:", token.substring(0, 20) + "...");

    try {
      console.log("Auth handler: Verifying token with Clerk...");
      const verifiedToken = await verifyToken(token, {
        authorizedParties: AUTHORIZED_PARTIES,
        secretKey: clerkSecretKey(),
      });

      console.log("Auth handler: Token verified, sub:", verifiedToken.sub?.substring(0, 8) + "...");

      console.log("Auth handler: Getting user from Clerk...");
      const user = await clerkClient.users.getUser(verifiedToken.sub);
      
      console.log("Auth handler: User retrieved successfully, ID:", user.id?.substring(0, 8) + "...");
      
      return {
        userID: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
      };
    } catch (err) {
      console.error("Auth handler: Token verification failed:", err);
      throw APIError.unauthenticated("invalid token", err as Error);
    }
  }
);

export const gw = new Gateway({ authHandler: auth });
