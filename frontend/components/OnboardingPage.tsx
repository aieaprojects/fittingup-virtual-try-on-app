import React from 'react';
import { Button } from '@/components/ui/button';
import { designTokens } from '../styles/design-tokens';

interface OnboardingPageProps {
  imageUrl: string;
  headline: string;
  subtext: string;
  onContinue: () => void;
  isLastPage?: boolean;
}

export default function OnboardingPage({
  imageUrl,
  headline,
  subtext,
  onContinue,
  isLastPage = false
}: OnboardingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-y-auto">
      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center px-6 pt-16 pb-8">
        <div className="max-w-xs w-full">
          <img
            src={imageUrl}
            alt={headline}
            className="w-full h-auto rounded-2xl shadow-2xl object-cover"
            style={{
              aspectRatio: '2/3',
              maxHeight: '50vh'
            }}
            onError={(e) => {
              console.error('Failed to load onboarding image:', imageUrl);
            }}
            onLoad={() => {
              console.log('Onboarding image loaded successfully:', imageUrl);
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 pb-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Headline */}
          <h1 
            className="text-3xl font-bold leading-tight tracking-tight"
            style={{ 
              fontFamily: designTokens.typography.heading,
              color: '#FFFFFF',
              lineHeight: '1.2'
            }}
          >
            {headline}
          </h1>

          {/* Subtext */}
          <p 
            className="text-lg leading-relaxed"
            style={{ 
              color: '#E5E5E5',
              fontFamily: designTokens.typography.body,
              lineHeight: '1.5'
            }}
          >
            {subtext}
          </p>

          {/* Continue Button */}
          <div className="pt-8">
            <Button
              onClick={onContinue}
              className="w-full py-4 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                borderRadius: designTokens.radius.xl,
                boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
                minHeight: '56px'
              }}
            >
              {isLastPage ? 'Get Started' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}