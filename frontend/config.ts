// Clerk configuration (Production)
export const clerkPublishableKey = "pk_live_Y2xlcmsuZml0dnVlYXBwLmNvbSQ";

// Clerk Frontend API URL
export const clerkFrontendApi = "https://clerk.fitvueapp.com";

// API configuration - Encore handles this automatically, no need for manual URLs
// The ~backend/client import automatically uses the correct backend URL

// Upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

// Rate limits (displayed to users)
export const RATE_LIMITS = {
  tryons: 10,
  avatars: 5,
  fits: 20,
};
