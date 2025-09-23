import { APIError } from "encore.dev/api";
import { db } from "./db";

export async function ensureUser(userID: string, email: string): Promise<void> {
  await db.exec`
    INSERT INTO users (id, email, terms_accepted, privacy_accepted) 
    VALUES (${userID}, ${email}, false, false) 
    ON CONFLICT (id) DO UPDATE SET 
      email = EXCLUDED.email,
      updated_at = NOW()
  `;
}

export async function ensureUserWithConsent(
  userID: string, 
  email: string, 
  termsAccepted: boolean = false, 
  privacyAccepted: boolean = false
): Promise<void> {
  const consentDate = termsAccepted && privacyAccepted ? new Date() : null;
  
  await db.exec`
    INSERT INTO users (id, email, terms_accepted, privacy_accepted, consent_date) 
    VALUES (${userID}, ${email}, ${termsAccepted}, ${privacyAccepted}, ${consentDate}) 
    ON CONFLICT (id) DO UPDATE SET 
      email = EXCLUDED.email,
      terms_accepted = EXCLUDED.terms_accepted,
      privacy_accepted = EXCLUDED.privacy_accepted,
      consent_date = EXCLUDED.consent_date,
      updated_at = NOW()
  `;
}

export async function checkRateLimit(
  userID: string, 
  actionType: 'tryon' | 'avatar' | 'fit',
  maxPerDay: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  const result = await db.queryRow<{ count: number }>`
    SELECT count FROM rate_limits 
    WHERE user_id = ${userID} 
      AND action_type = ${actionType} 
      AND action_date = ${today}
  `;

  if (result && result.count >= maxPerDay) {
    throw APIError.resourceExhausted(`Daily limit of ${maxPerDay} ${actionType} actions exceeded`);
  }

  await db.exec`
    INSERT INTO rate_limits (user_id, action_type, action_date, count)
    VALUES (${userID}, ${actionType}, ${today}, 1)
    ON CONFLICT (user_id, action_type, action_date) 
    DO UPDATE SET count = rate_limits.count + 1
  `;
}

export function generateFileName(userID: string, type: string, extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${type}/${userID}/${timestamp}-${random}.${extension}`;
}

export function extractFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    throw APIError.invalidArgument("Invalid file format. Only JPG, PNG, and WebP are supported.");
  }
  return ext;
}

export function validateImageDimensions(width: number, height: number): void {
  if (width < 512 || height < 512) {
    throw APIError.invalidArgument("Image must be at least 512x512 pixels");
  }
  if (width > 4096 || height > 4096) {
    throw APIError.invalidArgument("Image must not exceed 4096x4096 pixels");
  }
}

export async function moderateContent(
  userID: string,
  contentType: 'avatar' | 'fit',
  contentId: number,
  imageUrl: string
): Promise<void> {
  // Basic content moderation checks
  // In a real implementation, this would call AI moderation services
  
  // For now, we'll just implement basic checks
  // This is a placeholder for actual moderation logic
  const flagTypes: string[] = [];
  
  // Check for explicit content (placeholder)
  if (await isExplicitContent(imageUrl)) {
    flagTypes.push('explicit');
  }
  
  // Check for celebrity faces (placeholder)
  if (await isCelebrity(imageUrl)) {
    flagTypes.push('celebrity');
  }
  
  // Check for mirror selfies or partial body shots (placeholder)
  if (contentType === 'avatar' && await isMirrorOrPartial(imageUrl)) {
    flagTypes.push('mirror');
  }
  
  // Store moderation flags
  for (const flagType of flagTypes) {
    await db.exec`
      INSERT INTO moderation_flags (user_id, content_type, content_id, flag_type, confidence)
      VALUES (${userID}, ${contentType}, ${contentId}, ${flagType}, 0.8)
    `;
  }
  
  if (flagTypes.length > 0) {
    throw APIError.invalidArgument(
      `Content rejected due to moderation concerns: ${flagTypes.join(', ')}`
    );
  }
}

// Placeholder moderation functions
async function isExplicitContent(imageUrl: string): Promise<boolean> {
  // TODO: Implement actual content moderation
  return false;
}

async function isCelebrity(imageUrl: string): Promise<boolean> {
  // TODO: Implement celebrity detection
  return false;
}

async function isMirrorOrPartial(imageUrl: string): Promise<boolean> {
  // TODO: Implement mirror/partial body detection
  return false;
}
