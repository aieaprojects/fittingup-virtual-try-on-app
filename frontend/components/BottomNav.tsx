import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid3X3, User, Plus } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

interface BottomNavProps {
  hasNewLooks?: boolean;
}

export default function BottomNav({ hasNewLooks = false }: BottomNavProps) {
  const location = useLocation();
  
  console.log('BottomNav current location:', location.pathname);

  const handleLinkClick = (path: string) => {
    console.log('Attempting to navigate to:', path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
         style={{
           background: `${designTokens.colors.pure}95`, // 95% opacity
           backdropFilter: 'blur(20px)',
           borderTop: `1px solid ${designTokens.colors.stone}`,
           boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)'
         }}>
      <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
        {/* Left Tab - Collections */}
        <Link 
          to="/looks" 
          className="flex flex-col items-center space-y-2 min-w-0 flex-1 cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-105"
          onClick={() => handleLinkClick('/looks')}
          style={{
            backgroundColor: location.pathname === '/looks' 
              ? `${designTokens.colors.pearl}80` 
              : 'transparent'
          }}
        >
          <div className="relative">
            <Grid3X3 
              className="w-6 h-6 transition-colors duration-300" 
              style={{
                color: location.pathname === '/looks' 
                  ? designTokens.colors.charcoal
                  : designTokens.colors.ash
              }}
            />
            {hasNewLooks && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                   style={{ backgroundColor: designTokens.colors.error }} />
            )}
          </div>
          <span className="text-xs font-medium transition-colors duration-300"
                style={{
                  color: location.pathname === '/looks' 
                    ? designTokens.colors.charcoal
                    : designTokens.colors.ash,
                  fontFamily: designTokens.typography.body
                }}>
            Collections
          </span>
        </Link>

        {/* Center Action Button */}
        <Link 
          to="/try-new-look" 
          className="px-8 py-4 mx-4 flex items-center space-x-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl"
          onClick={() => handleLinkClick('/try-new-look')}
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
            color: designTokens.colors.pure,
            fontFamily: designTokens.typography.body
          }}
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Style Me</span>
        </Link>

        {/* Right Tab - Models */}
        <Link 
          to="/avatars" 
          className="flex flex-col items-center space-y-2 min-w-0 flex-1 cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-105"
          onClick={() => handleLinkClick('/avatars')}
          style={{
            backgroundColor: location.pathname === '/avatars' 
              ? `${designTokens.colors.pearl}80` 
              : 'transparent'
          }}
        >
          <User 
            className="w-6 h-6 transition-colors duration-300" 
            style={{
              color: location.pathname === '/avatars' 
                ? designTokens.colors.charcoal
                : designTokens.colors.ash
            }}
          />
          <span className="text-xs font-medium transition-colors duration-300"
                style={{
                  color: location.pathname === '/avatars' 
                    ? designTokens.colors.charcoal
                    : designTokens.colors.ash,
                  fontFamily: designTokens.typography.body
                }}>
            Models
          </span>
        </Link>
      </div>
    </nav>
  );
}