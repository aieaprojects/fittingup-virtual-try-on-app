// Storage limits based on subscription tiers
export const STORAGE_LIMITS = {
  free: 0,       // No saved images allowed
  starter: 20,   // Maximum of 20 saved images
  premium: 40,   // Maximum of 40 saved images
  exclusive: 80  // Maximum of 80 saved images
};

export function getStorageLimit(plan: string): number {
  return STORAGE_LIMITS[plan as keyof typeof STORAGE_LIMITS] || 0;
}

export function canSaveMore(plan: string, currentSaved: number): boolean {
  if (plan === 'free') return false;
  const limit = getStorageLimit(plan);
  return currentSaved < limit;
}

export function getStorageStatus(plan: string, currentSaved: number) {
  const limit = getStorageLimit(plan);
  return {
    current: currentSaved,
    limit: limit,
    canSave: canSaveMore(plan, currentSaved),
    isAtLimit: currentSaved >= limit,
    displayText: plan === 'free' ? 'Upgrade to save' : `${currentSaved}/${limit} saved`
  };
}