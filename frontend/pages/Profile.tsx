import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Calendar, Crown, ExternalLink, LogOut, CreditCard, FileText, Shield } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';
import { useToast } from '@/components/ui/use-toast';
import { useBackend } from '../utils/backend';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const backend = useBackend();

  // Get user's credit info
  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => backend.credits.getCredits(),
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-6"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
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
            Back
          </Button>
          
          {/* Legal Links */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/privacy-policy')}
              className="transition-all duration-300 hover:scale-105"
              style={{
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.md,
                color: designTokens.colors.slate,
                backgroundColor: 'transparent',
                fontFamily: designTokens.typography.body,
                fontSize: '12px',
                padding: '6px 12px'
              }}
            >
              <Shield className="w-3 h-3 mr-1" />
              Privacy
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/terms-of-service')}
              className="transition-all duration-300 hover:scale-105"
              style={{
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.md,
                color: designTokens.colors.slate,
                backgroundColor: 'transparent',
                fontFamily: designTokens.typography.body,
                fontSize: '12px',
                padding: '6px 12px'
              }}
            >
              <FileText className="w-3 h-3 mr-1" />
              Terms
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto"
               style={{ 
                 background: user?.imageUrl 
                   ? 'transparent' 
                   : `linear-gradient(135deg, ${designTokens.colors.sage}20 0%, ${designTokens.colors.blush}20 100%)`,
                 border: `2px solid ${designTokens.colors.stone}`,
                 boxShadow: designTokens.shadows.lg
               }}>
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                style={{ borderRadius: designTokens.radius.xl }}
              />
            ) : (
              <User className="w-12 h-12" style={{ color: designTokens.colors.charcoal }} />
            )}
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight"
                style={{ 
                  fontFamily: designTokens.typography.heading,
                  color: designTokens.colors.charcoal 
                }}>
              Account & Settings
            </h1>
            <p className="text-lg leading-relaxed"
               style={{ color: designTokens.colors.slate }}>
              Manage your profile and preferences
            </p>
          </div>
        </div>

        {/* Account Details */}
        <Card className="overflow-hidden"
              style={{ 
                background: designTokens.colors.pure,
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius['2xl'],
                boxShadow: designTokens.shadows.lg
              }}>
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold flex items-center gap-3"
                       style={{ 
                         fontFamily: designTokens.typography.heading,
                         color: designTokens.colors.charcoal 
                       }}>
              <User className="w-6 h-6" />
              Account Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: `${designTokens.colors.sage}20` }}>
                  <User className="w-5 h-5" style={{ color: designTokens.colors.charcoal }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium"
                     style={{ color: designTokens.colors.ash }}>
                    Full Name
                  </p>
                  <p className="text-base font-medium"
                     style={{ color: designTokens.colors.charcoal }}>
                    {user?.fullName || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: `${designTokens.colors.blush}20` }}>
                  <Mail className="w-5 h-5" style={{ color: designTokens.colors.charcoal }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium"
                     style={{ color: designTokens.colors.ash }}>
                    Email Address
                  </p>
                  <p className="text-base font-medium"
                     style={{ color: designTokens.colors.charcoal }}>
                    {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: `${designTokens.colors.lavender}20` }}>
                  <Calendar className="w-5 h-5" style={{ color: designTokens.colors.charcoal }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium"
                     style={{ color: designTokens.colors.ash }}>
                    Member Since
                  </p>
                  <p className="text-base font-medium"
                     style={{ color: designTokens.colors.charcoal }}>
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription & Billing */}
        <Card className="overflow-hidden"
              style={{ 
                background: designTokens.colors.pure,
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius['2xl'],
                boxShadow: designTokens.shadows.lg
              }}>
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold flex items-center gap-3"
                       style={{ 
                         fontFamily: designTokens.typography.heading,
                         color: designTokens.colors.charcoal 
                       }}>
              <Crown className="w-6 h-6" />
              Subscription & Credits
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium"
                     style={{ color: designTokens.colors.charcoal }}>
                    Current Plan
                  </p>
                  <p className="text-sm"
                     style={{ color: designTokens.colors.slate }}>
                    {credits ? 
                      credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1) + ' Plan' : 
                      'Loading...'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/upgrade')}
                  className="px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                    color: designTokens.colors.pure,
                    borderRadius: designTokens.radius.lg,
                    boxShadow: designTokens.shadows.md
                  }}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </div>
              
              {/* Credit Information */}
              {credits && (
                <div className="p-4 rounded-lg"
                     style={{ 
                       background: `${designTokens.colors.champagne}08`,
                       border: `1px solid ${designTokens.colors.champagne}15`
                     }}>
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5" style={{ color: designTokens.colors.charcoal }} />
                    <p className="text-base font-medium"
                       style={{ color: designTokens.colors.charcoal }}>
                      Credits
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: designTokens.colors.slate }}>
                        {credits.plan === 'free' ? 'Total available' : 'This month'}
                      </span>
                      <span className="text-sm font-medium" style={{ color: designTokens.colors.charcoal }}>
                        {credits.credits_remaining} / {credits.credits_total}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full"
                         style={{ backgroundColor: `${designTokens.colors.stone}30` }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: credits.credits_remaining > 0 ? designTokens.colors.sage : designTokens.colors.error,
                          width: `${(credits.credits_remaining / credits.credits_total) * 100}%`
                        }}
                      />
                    </div>
                    {credits.plan !== 'free' && (
                      <p className="text-xs" style={{ color: designTokens.colors.ash }}>
                        Resets {new Date(credits.period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full py-4 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: `2px solid ${designTokens.colors.error}30`,
              borderRadius: designTokens.radius.xl,
              color: designTokens.colors.error,
              backgroundColor: `${designTokens.colors.error}05`
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}