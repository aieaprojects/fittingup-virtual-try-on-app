import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  console.log('SplashScreen component rendered');

  useEffect(() => {
    console.log('SplashScreen useEffect triggered');
    const timer = setTimeout(() => {
      console.log('SplashScreen timer completed, hiding splash');
      setIsVisible(false);
      setTimeout(() => {
        console.log('SplashScreen calling onComplete');
        onComplete();
      }, 500); // Wait for fade out animation
    }, 2500); // Show splash for 2.5 seconds

    return () => {
      console.log('SplashScreen cleanup');
      clearTimeout(timer);
    };
  }, [onComplete]);

  console.log('SplashScreen isVisible:', isVisible);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500"
      style={{
        opacity: isVisible ? 1 : 0
      }}
    >
      <div className="text-center">
        <img
          src="/fitvue-logo.png"
          alt="fitvue"
          className="mx-auto"
          style={{
            maxWidth: '85vw',
            maxHeight: '40vh',
            width: 'auto',
            height: 'auto',
            imageRendering: '-webkit-optimize-contrast',
            animation: 'fadeIn 1s ease-in-out'
          }}
          onLoad={() => console.log('Splash logo loaded successfully')}
          onError={(e) => console.error('Splash logo failed to load:', e)}
        />
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}