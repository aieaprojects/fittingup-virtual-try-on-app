import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Sparkles } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function TryonLoading() {
  const [loadingText, setLoadingText] = useState('Analyzing your style...');

  useEffect(() => {
    const messages = [
      'Analyzing your style...',
      'Understanding the garment...',
      'Creating the perfect fit...',
      'Adding finishing touches...',
      'Almost ready...'
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingText(messages[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: styleHelpers.gradients.warm }}>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-10 animate-pulse"
             style={{ 
               background: `radial-gradient(circle, ${designTokens.colors.sage} 0%, transparent 70%)`,
               animationDelay: '0s'
             }} />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full opacity-10 animate-pulse"
             style={{ 
               background: `radial-gradient(circle, ${designTokens.colors.blush} 0%, transparent 70%)`,
               animationDelay: '1s'
             }} />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full opacity-10 animate-pulse"
             style={{ 
               background: `radial-gradient(circle, ${designTokens.colors.lavender} 0%, transparent 70%)`,
               animationDelay: '2s'
             }} />
      </div>

      <div className="relative text-center space-y-12 px-8 max-w-md mx-auto">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-700 hover:scale-110"
                 style={{ 
                   background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                   boxShadow: designTokens.shadows.xl
                 }}>
              <Sparkles className="w-10 h-10" 
                        style={{ color: designTokens.colors.pure }} />
            </div>
            
            {/* Rotating ring */}
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-dashed rounded-2xl animate-spin"
                 style={{ 
                   borderColor: `${designTokens.colors.sage}40`,
                   animationDuration: '8s'
                 }} />
          </div>
          
          <img
            src="/fitvue-loading-logo.png"
            alt="fitvue"
            className="h-16 mx-auto transition-opacity duration-300 hover:opacity-80"
            style={{
              filter: 'none',
              imageRendering: '-webkit-optimize-contrast',
              maxWidth: '300px',
              width: 'auto'
            }}
          />
        </div>
        
        {/* Loading Animation */}
        <div className="space-y-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" color={designTokens.colors.charcoal} />
          </div>
          
          <div className="space-y-4">
            <p className="text-xl font-semibold transition-all duration-500"
               style={{ 
                 fontFamily: designTokens.typography.heading,
                 color: designTokens.colors.charcoal 
               }}>
              Creating Your Look
            </p>
            
            <p className="text-base leading-relaxed transition-all duration-500"
               style={{ color: designTokens.colors.slate }}>
              {loadingText}
            </p>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: designTokens.colors.sage,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}