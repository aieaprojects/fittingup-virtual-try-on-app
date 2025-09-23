// Storage limits based on subscription tiers
export const STORAGE_LIMITS = {
  free: 0,       // No saved images allowed
  starter: 10,   // Maximum of 10 saved images
  premium: 50,   // Maximum of 50 saved images
  exclusive: 100 // Maximum of 100 saved images
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