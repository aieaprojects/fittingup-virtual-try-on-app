import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, X } from 'lucide-react';
import { designTokens } from '../styles/design-tokens';

interface CreditLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditInfo?: {
    plan: string;
    credits_total: number;
    credits_used_this_period: number;
    credits_remaining: number;
  };
}

export default function CreditLimitModal({ isOpen, onClose, creditInfo }: CreditLimitModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <Card className="relative w-full max-w-md overflow-hidden"
            style={{ 
              background: designTokens.colors.pure,
              border: `1px solid ${designTokens.colors.stone}`,
              borderRadius: designTokens.radius.xl,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200"
          style={{
            color: designTokens.colors.slate,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${designTokens.colors.stone}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X className="w-5 h-5" style={{ strokeWidth: 1.5 }} />
        </button>

        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{ 
                 background: `linear-gradient(135deg, ${designTokens.colors.champagne}25 0%, ${designTokens.colors.blush}15 100%)`,
                 border: `1px solid ${designTokens.colors.champagne}30`
               }}>
            <Crown className="w-8 h-8" 
                   style={{ 
                     color: '#D4AF37', 
                     strokeWidth: 1.5 
                   }} />
          </div>
          
          <CardTitle className="text-xl font-semibold leading-tight"
                     style={{ 
                       fontFamily: designTokens.typography.heading,
                       color: designTokens.colors.charcoal,
                       letterSpacing: '-0.02em'
                     }}>
            Credits Used Up
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          <div className="text-center space-y-3">
            <p className="text-base leading-relaxed"
               style={{ 
                 color: designTokens.colors.charcoal,
                 fontFamily: designTokens.typography.body
               }}>
              You've used all your credits for this plan.
            </p>
            
            {creditInfo && (
              <div className="p-4 rounded-lg"
                   style={{ 
                     background: `${designTokens.colors.champagne}08`,
                     border: `1px solid ${designTokens.colors.champagne}15`
                   }}>
                <p className="text-sm"
                   style={{ 
                     color: designTokens.colors.slate,
                     fontFamily: designTokens.typography.body
                   }}>
                  <span style={{ fontWeight: '500' }}>
                    {creditInfo.plan.charAt(0).toUpperCase() + creditInfo.plan.slice(1)} Plan
                  </span>
                  <br />
                  {creditInfo.credits_used_this_period} / {creditInfo.credits_total} credits used
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              className="w-full py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)`,
                color: designTokens.colors.pure,
                borderRadius: designTokens.radius.lg,
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                fontFamily: designTokens.typography.body,
                letterSpacing: '0.025em'
              }}
            >
              <Crown className="w-4 h-4 mr-3" style={{ strokeWidth: 2 }} />
              Upgrade Plan
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.lg,
                color: designTokens.colors.charcoal,
                backgroundColor: 'transparent',
                fontFamily: designTokens.typography.body
              }}
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}