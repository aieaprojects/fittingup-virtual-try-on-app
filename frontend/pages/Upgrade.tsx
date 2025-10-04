import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Check, Star, Zap } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';
import { useToast } from '@/components/ui/use-toast';
import { useBackend } from '../utils/backend';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  images: number;
  icon: React.ReactNode;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
}

export default function Upgrade() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$7.99',
      period: '/month',
      images: 30,
      description: 'Perfect for regular styling',
      icon: <Star className="w-5 h-5" style={{ strokeWidth: 1.5 }} />,
      features: [
        { text: '30 images per month', included: true },
        { text: 'HD resolution outputs', included: true },
        { text: 'Faster processing speed', included: true },
        { text: 'Save up to 10 looks in Collections', included: true }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$13.99',
      period: '/month',
      images: 60,
      description: 'Enhanced styling experience',
      icon: <Crown className="w-5 h-5" style={{ strokeWidth: 1.5 }} />,
      popular: true,
      features: [
        { text: '60 images per month', included: true },
        { text: 'High-resolution outputs', included: true },
        { text: 'Priority processing speed', included: true },
        { text: 'Save up to 50 looks in Collections', included: true },
        { text: 'Early access to new style filters', included: true }
      ]
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      price: '$24.99',
      period: '/month',
      images: 120,
      description: 'Ultimate luxury styling',
      icon: <Crown className="w-5 h-5" style={{ strokeWidth: 1.5, color: '#D4AF37' }} />,
      features: [
        { text: '120 images per month', included: true },
        { text: 'Ultra HD resolution', included: true },
        { text: 'Fastest priority processing', included: true },
        { text: 'Save up to 100 looks in Collections', included: true },
        { text: 'Access to exclusive garment library', included: true },
        { text: 'Premium support & advanced styling features', included: true }
      ]
    }
  ];

  const handlePurchase = async (planId: string) => {
    setPurchasingPlan(planId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await backend.credits.updatePlan({ plan: planId });
      
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      
      toast({
        title: "Purchase successful!",
        description: "Your subscription has been activated. Welcome to premium styling!",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "There was an issue processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPurchasingPlan(null);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-6"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/profile')}
            className="transition-all duration-300 hover:scale-105"
            style={{
              border: `2px solid ${designTokens.colors.stone}`,
              borderRadius: designTokens.radius.lg,
              color: designTokens.colors.charcoal,
              backgroundColor: designTokens.colors.ivory,
              fontFamily: designTokens.typography.body
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center pt-4 pb-6">
            <img
              src="/official-logo.png"
              alt="Official Logo"
              className="h-16 sm:h-20 md:h-24 transition-opacity duration-300 hover:opacity-80 object-contain"
              style={{
                filter: 'none',
                maxWidth: '300px',
                width: 'auto'
              }}
            />
          </div>
          
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
               style={{ 
                 background: `linear-gradient(135deg, ${designTokens.colors.champagne}25 0%, ${designTokens.colors.blush}15 100%)`,
                 border: `1px solid ${designTokens.colors.champagne}30`,
                 boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)'
               }}>
            <Crown className="w-7 h-7" 
                   style={{ 
                     color: '#D4AF37', 
                     strokeWidth: 1.5 
                   }} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight leading-tight"
                style={{ 
                  fontFamily: designTokens.typography.heading,
                  color: designTokens.colors.charcoal,
                  letterSpacing: '-0.02em'
                }}>
              Choose Your Plan
            </h1>
            <p className="text-base leading-relaxed"
               style={{ 
                 color: designTokens.colors.slate,
                 fontFamily: designTokens.typography.body,
                 fontWeight: '400'
               }}>
              Select the perfect plan for your styling needs
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className="relative overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl"
              style={{ 
                background: plan.popular
                  ? `linear-gradient(135deg, ${designTokens.colors.sage}08 0%, ${designTokens.colors.blush}06 100%)`
                  : designTokens.colors.pure,
                border: plan.popular 
                  ? `2px solid ${designTokens.colors.sage}` 
                  : `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                boxShadow: plan.popular 
                  ? '0 12px 40px rgba(106, 124, 114, 0.2)' 
                  : designTokens.shadows.lg
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-end mb-2 min-h-[32px]">
                  {plan.popular && (
                    <Badge 
                      className="px-3 py-1 text-xs font-medium tracking-wide"
                      style={{
                        background: `linear-gradient(135deg, ${designTokens.colors.sage} 0%, ${designTokens.colors.sage}dd 100%)`,
                        color: designTokens.colors.pure,
                        borderRadius: designTokens.radius.full,
                        fontFamily: designTokens.typography.body
                      }}
                    >
                      Most Popular
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                         style={{ 
                           background: plan.id === 'exclusive' 
                             ? `linear-gradient(135deg, #D4AF37 0%, #F4E4BC 100%)`
                             : `linear-gradient(135deg, ${designTokens.colors.sage}15 0%, ${designTokens.colors.blush}15 100%)`,
                           border: plan.id === 'exclusive' 
                             ? '1px solid #D4AF37' 
                             : `1px solid ${designTokens.colors.stone}`
                         }}>
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold leading-tight"
                                 style={{ 
                                   fontFamily: designTokens.typography.heading,
                                   color: designTokens.colors.charcoal,
                                   letterSpacing: '-0.02em'
                                 }}>
                        {plan.name}
                      </CardTitle>
                      <p className="text-xs mt-0.5 leading-relaxed"
                         style={{ 
                           color: designTokens.colors.slate,
                           fontFamily: designTokens.typography.body 
                         }}>
                        {plan.images} images per month
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold leading-none"
                            style={{ 
                              fontFamily: designTokens.typography.heading,
                              color: designTokens.colors.charcoal,
                              letterSpacing: '-0.02em'
                            }}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm leading-none"
                              style={{ 
                                color: designTokens.colors.slate,
                                fontFamily: designTokens.typography.body
                              }}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" 
                             style={{ 
                               color: plan.id === 'exclusive' ? '#D4AF37' : designTokens.colors.sage,
                               strokeWidth: 2
                             }} />
                      <span className="text-sm leading-relaxed"
                            style={{ 
                              color: designTokens.colors.charcoal,
                              fontFamily: designTokens.typography.body,
                              fontWeight: '400'
                            }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={purchasingPlan === plan.id}
                  className="w-full py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                  style={{
                    background: purchasingPlan === plan.id 
                      ? designTokens.colors.ash
                      : plan.id === 'exclusive'
                        ? `linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)`
                        : `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                    color: designTokens.colors.pure,
                    borderRadius: designTokens.radius.lg,
                    boxShadow: purchasingPlan === plan.id 
                      ? 'none' 
                      : plan.id === 'exclusive'
                        ? '0 8px 24px rgba(212, 175, 55, 0.4)'
                        : designTokens.shadows.lg,
                    fontFamily: designTokens.typography.body,
                    letterSpacing: '0.025em'
                  }}
                >
                  {purchasingPlan === plan.id ? (
                    <>
                      <Zap className="w-4 h-4 mr-3 animate-pulse" style={{ strokeWidth: 2 }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.id === 'exclusive' ? (
                        <Crown className="w-4 h-4 mr-3" style={{ strokeWidth: 2 }} />
                      ) : (
                        <Star className="w-4 h-4 mr-3" style={{ strokeWidth: 2 }} />
                      )}
                      Subscribe to {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-6 px-8 rounded-2xl space-y-4"
             style={{ 
               background: `linear-gradient(135deg, ${designTokens.colors.champagne}06 0%, ${designTokens.colors.blush}04 100%)`,
               border: `1px solid ${designTokens.colors.champagne}15`,
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
             }}>
          <h3 className="text-base font-semibold"
              style={{ 
                color: designTokens.colors.charcoal,
                fontFamily: designTokens.typography.heading
              }}>
            Subscription Information
          </h3>
          
          <p className="text-sm leading-relaxed"
             style={{ 
               color: designTokens.colors.slate,
               fontFamily: designTokens.typography.body,
               fontWeight: '400',
               letterSpacing: '0.01em'
             }}>
            Fitvue offers auto-renewable subscription plans:
          </p>
          
          <ul className="text-sm leading-relaxed space-y-2"
              style={{ 
                color: designTokens.colors.slate,
                fontFamily: designTokens.typography.body,
                textAlign: 'left'
              }}>
            <li>• <strong>Starter Plan:</strong> $7.99 per month – includes 30 images per month</li>
            <li>• <strong>Premium Plan:</strong> $13.99 per month – includes 60 images per month</li>
            <li>• <strong>Exclusive Plan:</strong> $24.99 per month – includes 120 images per month</li>
          </ul>
          
          <p className="text-xs leading-relaxed pt-2"
             style={{ 
               color: designTokens.colors.ash,
               fontFamily: designTokens.typography.body,
               fontWeight: '400',
               letterSpacing: '0.01em'
             }}>
            Subscriptions renew automatically unless canceled at least 24 hours before the end of the current billing period. Payment is charged to the Apple ID account at confirmation of purchase. Manage or cancel subscriptions in your App Store account settings.
          </p>
          
          <div className="flex justify-center items-center gap-4 pt-3">
            <a
              href="https://app.fitvueapp.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline transition-colors duration-200"
              style={{
                color: designTokens.colors.ash,
                fontFamily: designTokens.typography.body
              }}
            >
              Privacy Policy
            </a>
            <span className="text-xs" style={{ color: designTokens.colors.stone }}>•</span>
            <a
              href="https://app.fitvueapp.com/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline transition-colors duration-200"
              style={{
                color: designTokens.colors.ash,
                fontFamily: designTokens.typography.body
              }}
            >
              Terms of Use (EULA)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
