import { useAuth } from "@clerk/clerk-react";
import backend from "~backend/client";

// Returns the authenticated backend client
export function useBackend() {
  const { getToken, isSignedIn, userId } = useAuth();
  
  console.log("useBackend: isSignedIn =", isSignedIn, "userId =", userId);
  
  if (!isSignedIn) {
    console.log("useBackend: User not signed in, returning unauthenticated client");
    return backend;
  }
  
  return backend.with({
    auth: async () => {
      console.log("useBackend: Getting token for authenticated request...");
      try {
        const token = await getToken();
        console.log("useBackend: Token obtained:", token ? "✓" : "✗");
        if (token) {
          console.log("useBackend: Token starts with:", token.substring(0, 20) + "...");
        }
        return token ? { authorization: `Bearer ${token}` } : {};
      } catch (error) {
        console.error("useBackend: Error getting token:", error);
        return {};
      }
    }
  });
}
