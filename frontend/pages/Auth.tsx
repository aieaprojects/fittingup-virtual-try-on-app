import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { Sparkles } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function Auth() {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);

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
            <button
              onClick={() => navigate('/terms-of-service')}
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
            </button>{' '}
            and{' '}
            <button
              onClick={() => navigate('/privacy-policy')}
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
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}