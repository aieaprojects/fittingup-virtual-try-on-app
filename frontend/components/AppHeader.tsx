import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { designTokens } from '../styles/design-tokens';

interface AppHeaderProps {
  className?: string;
  title?: string;
}

export default function AppHeader({ className = '', title }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className={`relative flex items-center justify-between pt-6 pb-4 px-6 ${className}`}>
      {/* Section Title */}
      {title && (
        <h1 className="text-2xl font-semibold" style={{ color: designTokens.colors.charcoal }}>
          {title}
        </h1>
      )}
      
      {/* Spacer when no title */}
      {!title && <div />}
      
      {/* Profile Button */}
      <Button
        onClick={() => navigate('/profile')}
        size="sm"
        className="transition-all duration-300 hover:scale-110"
        style={{
          background: `${designTokens.colors.pure}95`,
          color: designTokens.colors.charcoal,
          borderRadius: designTokens.radius.full,
          border: `1px solid ${designTokens.colors.stone}`,
          boxShadow: designTokens.shadows.sm,
          backdropFilter: 'blur(10px)',
          width: '40px',
          height: '40px',
          padding: '0'
        }}
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            style={{ borderRadius: designTokens.radius.full }}
          />
        ) : (
          <User className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}