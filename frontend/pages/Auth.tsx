import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { SignIn } from '@clerk/clerk-react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import backend from '~backend/client';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function Auth() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [logoError, setLogoError] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isProcessingConsent, setIsProcessingConsent] = useState(false);

  // Check if user needs to give consent after signing in
  useEffect(() => {
    if (isSignedIn && user) {
      // Show consent modal for new users
      setShowConsentModal(true);
    }
  }, [isSignedIn, user]);

  const handleConsentSubmit = async () => {
    if (!consentGiven) return;
    
    setIsProcessingConsent(true);
    try {
      await backend.credits.ensureUserWithConsentAPI({
        terms_accepted: true,
        privacy_accepted: true
      });
      setShowConsentModal(false);
    } catch (error) {
      console.error('Failed to save consent:', error);
    } finally {
      setIsProcessingConsent(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: styleHelpers.gradients.warm }}>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-40 h-40 rounded-full opacity-8 animate-pulse"
             style={{ 
               background: `radial-gradient(circle, ${designTokens.colors.sage} 0%, transparent 70%)`,
               animationDelay: '0s',
               animationDuration: '4s'
             }} />
        <div className="absolute bottom-1/4 right-1/6 w-32 h-32 rounded-full opacity-8 animate-pulse"
             style={{ 
               background: `radial-gradient(circle, ${designTokens.colors.blush} 0%, transparent 70%)`,
               animationDelay: '2s',
               animationDuration: '4s'
             }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full opacity-8 animate-pulse"
             style={{ 
               background: `radial-gradient(circle, ${designTokens.colors.lavender} 0%, transparent 70%)`,
               animationDelay: '1s',
               animationDuration: '4s'
             }} />
      </div>

      <div className="relative max-w-md w-full space-y-6">
        {/* Logo */}
        {!logoError && (
          <div className="text-center mb-3">
            <img
              src="/fitvue-logo-new.png"
              alt="Fitvue"
              className="mx-auto w-[120px] h-auto max-w-full transition-all duration-300 hover:scale-105"
              style={{ marginBottom: '12px' }}
              onError={() => setLogoError(true)}
              onLoad={() => setLogoError(false)}
            />
          </div>
        )}

        {/* Sign In Component */}
        <div className="flex justify-center">
          <div className="w-full"
               style={{
                 borderRadius: designTokens.radius['2xl'],
                 boxShadow: designTokens.shadows.xl,
                 overflow: 'hidden'
               }}>
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: `shadow-none border-0 ${designTokens.radius['2xl']}`,
                  headerTitle: `font-semibold text-xl`,
                  headerSubtitle: `text-base`,
                  socialButtonsBlockButton: `border-2 hover:scale-[1.02] transition-transform duration-200`,
                  formFieldInput: `border-2 rounded-lg transition-all duration-200 focus:scale-[1.01]`,
                  footerActionLink: `font-medium hover:scale-105 transition-transform duration-200`,
                  formButtonPrimary: `font-semibold tracking-wide hover:scale-[1.02] transition-transform duration-200`,
                },
                variables: {
                  colorBackground: designTokens.colors.pure,
                  colorInputBackground: designTokens.colors.ivory,
                  colorInputText: designTokens.colors.charcoal,
                  colorPrimary: designTokens.colors.charcoal,
                  colorText: designTokens.colors.charcoal,
                  colorTextSecondary: designTokens.colors.slate,
                  colorTextOnPrimaryBackground: designTokens.colors.pure,
                  borderRadius: designTokens.radius.lg,
                  fontFamily: designTokens.typography.body,
                  fontSize: designTokens.typography.base,
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs leading-relaxed"
             style={{ color: designTokens.colors.ash }}>
            By signing up, you agree to our{' '}
            <a
              href="https://fitvueapp.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline transition-colors duration-200"
              style={{ color: designTokens.colors.slate }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = designTokens.colors.charcoal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = designTokens.colors.slate;
              }}
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://fitvueapp.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline transition-colors duration-200"
              style={{ color: designTokens.colors.slate }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = designTokens.colors.charcoal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = designTokens.colors.slate;
              }}
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
               style={{
                 backgroundColor: designTokens.colors.pure,
                 borderRadius: designTokens.radius['2xl'],
                 boxShadow: designTokens.shadows.xl
               }}>
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold"
                  style={{ 
                    color: designTokens.colors.charcoal,
                    fontFamily: designTokens.typography.heading 
                  }}>
                Welcome to Fitvue!
              </h2>
              
              <p className="text-sm leading-relaxed"
                 style={{ color: designTokens.colors.slate }}>
                To continue, please confirm that you agree to our terms and privacy policy.
              </p>
              
              <div className="flex items-start space-x-3 text-left">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer"
                       style={{ color: designTokens.colors.charcoal }}>
                  I agree to the{' '}
                  <a
                    href="https://fitvueapp.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: designTokens.colors.slate }}
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://fitvueapp.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: designTokens.colors.slate }}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <Button
                onClick={handleConsentSubmit}
                disabled={!consentGiven || isProcessingConsent}
                className="w-full mt-6"
                style={{
                  backgroundColor: consentGiven ? designTokens.colors.charcoal : designTokens.colors.stone,
                  color: designTokens.colors.pure,
                  borderRadius: designTokens.radius.lg
                }}
              >
                {isProcessingConsent ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}