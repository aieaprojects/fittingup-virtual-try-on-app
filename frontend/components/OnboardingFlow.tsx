import React, { useState } from 'react';
import OnboardingPage from './OnboardingPage';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      imageUrl: '/onboarding-1.png',
      headline: 'Try On Anything, Instantly',
      subtext: 'Transform the way you shop online. See how clothes look on you before you buy — anytime, anywhere.'
    },
    {
      imageUrl: '/onboarding-2.png',
      headline: 'No More Returns. No More Guesswork.',
      subtext: 'Save money and time by virtually trying outfits before checkout. Shop with confidence.'
    },
    {
      imageUrl: '/onboarding-3-new.png',
      headline: 'Try Fitvue for Free Now',
      subtext: 'Enjoy 5 free image generations to see how Fitvue transforms your online shopping experience.'
    }
  ];

  const handleContinue = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const currentPageData = pages[currentPage];

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Progress Indicators */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {pages.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === currentPage ? '#FFFFFF' : '#666666'
            }}
          />
        ))}
      </div>

      {/* Page Content */}
      <div className="w-full h-full overflow-y-auto">
        <OnboardingPage
          imageUrl={currentPageData.imageUrl}
          headline={currentPageData.headline}
          subtext={currentPageData.subtext}
          onContinue={handleContinue}
          isLastPage={currentPage === pages.length - 1}
        />
      </div>
    </div>
  );
}