import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import { clerkPublishableKey } from './config';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { AvatarSelectionProvider } from './contexts/AvatarSelectionContext';
import BottomNav from './components/BottomNav';
import AppHeader from './components/AppHeader';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import ErrorBoundary from './components/ErrorBoundary';
import MyLooks from './pages/MyLooks';
import TryNewLook from './pages/TryNewLook';
import MyAvatars from './pages/MyAvatars';
import CreateAvatar from './pages/CreateAvatar';
import Result from './pages/Result';
import Profile from './pages/Profile';
import Upgrade from './pages/Upgrade';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Auth from './pages/Auth';
import TryonLoading from './components/TryonLoading';
import { designTokens } from './styles/design-tokens';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  console.log('App component loading...');
  console.log('Clerk publishable key:', clerkPublishableKey ? 'Present' : 'Missing');
  
  if (!clerkPublishableKey) {
    console.error('Clerk publishable key is missing!');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-stone-200 max-w-md mx-4">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Configuration Required
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Please set your Clerk publishable key in frontend/config.ts
          </p>
          <p className="text-sm mt-4 text-red-600">
            Key status: {clerkPublishableKey ? 'Present' : 'Missing'}
          </p>
        </div>
      </div>
    );
  }

  console.log('Initializing ClerkProvider...');
  
  try {
    return (
      <ErrorBoundary>
        <ClerkProvider 
          publishableKey={clerkPublishableKey}
          appearance={{
            baseTheme: undefined,
            elements: {
              rootBox: "w-full",
              card: "shadow-lg border border-gray-200 rounded-xl"
            }
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Router>
              <div className="min-h-screen" 
                   style={{ 
                     background: `linear-gradient(135deg, ${designTokens.colors.cream} 0%, ${designTokens.colors.ivory} 100%)`,
                     fontFamily: designTokens.typography.body,
                     color: designTokens.colors.charcoal
                   }}>
                <SignedIn>
                  <NotificationProvider>
                    <AvatarSelectionProvider>
                      <AppInner />
                    </AvatarSelectionProvider>
                  </NotificationProvider>
                </SignedIn>
                <SignedOut>
                  <Routes>
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="*" element={<Auth />} />
                  </Routes>
                </SignedOut>
                <Toaster />
              </div>
            </Router>
          </QueryClientProvider>
        </ClerkProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error initializing app:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-red-200 max-w-md mx-4">
          <h1 className="text-2xl font-semibold mb-4 text-red-800">
            App Error
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            There was an error initializing the application. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

function AppInner() {
  console.log('AppInner component loading...');
  const { hasNewLooks } = useNotifications();
  
  // Always show splash screen on app load
  const [showSplash, setShowSplash] = React.useState(true);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  
  // Check if user has seen onboarding before
  const hasSeenOnboarding = React.useMemo(() => {
    try {
      return localStorage.getItem('clozet-onboarding-complete') === 'true';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  }, []);
  
  console.log('Show splash:', showSplash);
  console.log('Show onboarding:', showOnboarding);
  console.log('Has seen onboarding:', hasSeenOnboarding);
  
  const handleSplashComplete = () => {
    console.log('Splash completed, hiding splash screen');
    setShowSplash(false);
    // Only show onboarding if user hasn't seen it before
    if (!hasSeenOnboarding) {
      console.log('Showing onboarding...');
      setShowOnboarding(true);
    }
  };
  
  const handleOnboardingComplete = () => {
    console.log('Onboarding completed');
    setShowOnboarding(false);
    // Mark onboarding as completed in localStorage
    try {
      localStorage.setItem('clozet-onboarding-complete', 'true');
    } catch (error) {
      console.warn('Could not save onboarding completion to localStorage');
    }
  };
  
  // Always show splash screen first
  if (showSplash) {
    console.log('Rendering splash screen');
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  // Show onboarding only if user hasn't seen it before
  if (showOnboarding) {
    console.log('Rendering onboarding');
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }
  
  console.log('Rendering main app');
  // Main app content
  return (
    <>
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/looks" replace />} />
          <Route path="/looks" element={<><AppHeader title="Collections" /><MyLooks /></>} />
          <Route path="/try-new-look" element={<><AppHeader title="Style Me" /><TryNewLook /></>} />
          <Route path="/avatars" element={<><AppHeader title="Models" /><MyAvatars /></>} />
          <Route path="/create-avatar" element={<><AppHeader title="Create Model" /><CreateAvatar /></>} />
          <Route path="/result/:jobId" element={<><AppHeader title="Your Look" /><Result /></>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/generating" element={<TryonLoading />} />
          <Route path="*" element={<Navigate to="/looks" replace />} />
        </Routes>
      </main>
      <BottomNav hasNewLooks={hasNewLooks} />
    </>
  );
}
