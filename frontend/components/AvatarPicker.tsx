import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Check } from 'lucide-react';
import { useAvatarSelection } from '../contexts/AvatarSelectionContext';
import { designTokens } from '../styles/design-tokens';

interface Avatar {
  id: number;
  original_url?: string;
  processed_url?: string;
  created_at: Date;
  status: string;
}

interface AvatarPickerProps {
  avatars: Avatar[];
  onSelect: (avatarId: number) => void;
  selectedId?: number | null;
}

export default function AvatarPicker({ avatars, onSelect, selectedId }: AvatarPickerProps) {
  const completedAvatars = avatars.filter(avatar => avatar.status === 'completed');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center"
          style={{ 
            color: designTokens.colors.charcoal,
            fontFamily: designTokens.typography.heading 
          }}>
        Choose a model
      </h3>
      
      <div className="grid grid-cols-3 gap-4 max-h-72 overflow-y-auto">
        {completedAvatars.map((avatar, index) => {
          const isSelected = selectedId === avatar.id;
          
          return (
            <Card 
              key={avatar.id} 
              className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                background: designTokens.colors.pure,
                border: isSelected 
                  ? `2px solid ${designTokens.colors.sage}` 
                  : `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.lg,
                boxShadow: isSelected 
                  ? designTokens.shadows.md 
                  : designTokens.shadows.sm
              }}
              onClick={() => onSelect(avatar.id)}
            >
              <div className="aspect-[3/4] relative overflow-hidden"
                   style={{ borderRadius: `${designTokens.radius.lg} ${designTokens.radius.lg} 0 0` }}>
                {avatar.processed_url || avatar.original_url ? (
                  <img
                    src={avatar.processed_url || avatar.original_url}
                    alt={`Model ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                       style={{ backgroundColor: designTokens.colors.pearl }}>
                    <User className="w-6 h-6" style={{ color: designTokens.colors.ash }} />
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                         style={{ 
                           background: designTokens.colors.sage,
                           boxShadow: designTokens.shadows.sm 
                         }}>
                      <Check className="w-3 h-3" style={{ color: designTokens.colors.pure }} />
                    </div>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                       background: `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1) 100%)`,
                       borderRadius: `${designTokens.radius.lg} ${designTokens.radius.lg} 0 0`
                     }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}