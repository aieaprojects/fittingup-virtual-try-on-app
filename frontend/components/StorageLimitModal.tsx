import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';
import { designTokens } from '../styles/design-tokens';

interface StorageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  savedCount: number;
  maxSaves: number;
}

const PLAN_DISPLAY_NAMES = {
  free: 'Free',
  starter: 'Starter',
  premium: 'Premium',
  exclusive: 'Exclusive'
};

export default function StorageLimitModal({ 
  isOpen, 
  onClose, 
  currentPlan, 
  savedCount, 
  maxSaves 
}: StorageLimitModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade');
  };

  const isFreePlan = currentPlan === 'free';
  const planDisplayName = PLAN_DISPLAY_NAMES[currentPlan as keyof typeof PLAN_DISPLAY_NAMES] || currentPlan;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
               style={{ 
                 background: `linear-gradient(135deg, ${designTokens.colors.error}20 0%, ${designTokens.colors.blush}20 100%)` 
               }}>
            {isFreePlan ? (
              <Lock className="w-8 h-8" style={{ color: designTokens.colors.error }} />
            ) : (
              <Crown className="w-8 h-8" style={{ color: designTokens.colors.error }} />
            )}
          </div>
          
          <DialogTitle className="text-2xl font-semibold"
                       style={{ 
                         fontFamily: designTokens.typography.heading,
                         color: designTokens.colors.charcoal 
                       }}>
            {isFreePlan ? 'Upgrade to Save Looks' : 'Storage Limit Reached'}
          </DialogTitle>
          
          <DialogDescription className="text-base leading-relaxed space-y-3">
            {isFreePlan ? (
              <div className="space-y-2">
                <p style={{ color: designTokens.colors.slate }}>
                  Free plan users cannot save looks to their collection.
                </p>
                <p style={{ color: designTokens.colors.slate }}>
                  <strong>Upgrade to save your looks</strong> and access your personal style collection anytime.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p style={{ color: designTokens.colors.slate }}>
                  You've reached your limit for saved looks ({savedCount}/{maxSaves}).
                </p>
                <p style={{ color: designTokens.colors.slate }}>
                  <strong>Upgrade your plan to store more</strong> and build a larger style collection.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Current Plan Info */}
          <div className="text-center p-4 rounded-xl"
               style={{ 
                 backgroundColor: `${designTokens.colors.stone}20`,
                 border: `1px solid ${designTokens.colors.stone}`
               }}>
            <p className="text-sm font-medium" style={{ color: designTokens.colors.ash }}>
              Current Plan
            </p>
            <p className="text-lg font-semibold" style={{ color: designTokens.colors.charcoal }}>
              {planDisplayName}
            </p>
            <p className="text-sm" style={{ color: designTokens.colors.slate }}>
              {isFreePlan ? 'No saved looks' : `${savedCount}/${maxSaves} saved looks`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 py-3"
              style={{
                borderColor: designTokens.colors.stone,
                color: designTokens.colors.charcoal
              }}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleUpgrade}
              className="flex-1 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                color: designTokens.colors.pure,
                borderRadius: designTokens.radius.lg,
                boxShadow: designTokens.shadows.md
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}