import React from 'react';
import { Loader2 } from 'lucide-react';
import { designTokens } from '../styles/design-tokens';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  color = designTokens.colors.charcoal
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      style={{ color }}
    />
  );
}