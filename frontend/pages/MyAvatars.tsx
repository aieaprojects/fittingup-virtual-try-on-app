import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBackend } from '../utils/backend';
import { useToast } from '@/components/ui/use-toast';
import { useAvatarSelection } from '../contexts/AvatarSelectionContext';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function MyAvatars() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const { selectedAvatarId, setSelectedAvatarId } = useAvatarSelection();

  console.log('MyAvatars component rendered');

  const { data: avatars, isLoading, error, refetch } = useQuery({
    queryKey: ['library-avatars'],
    queryFn: async () => {
      console.log('MyAvatars: Fetching library avatars...');
      try {
        const response = await backend.library.listAvatars({ limit: 20 });
        console.log('MyAvatars: Library avatars response:', response);
        return response;
      } catch (error) {
        console.error('MyAvatars: Error fetching avatars:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleSelectAvatar = (avatarId: number) => {
    setSelectedAvatarId(avatarId);
    toast({
      title: "Model selected",
      description: "This model will be used for your next styling session.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 px-6"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <p className="text-lg leading-relaxed text-center"
               style={{ color: designTokens.colors.slate }}>
              Your personal fit models
            </p>
          </div>
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-24"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto px-6">
          <div className="pt-2 mb-6">
            <p className="text-base leading-relaxed text-center"
               style={{ color: designTokens.colors.slate }}>
              Your personal fit models
            </p>
          </div>
          <Alert style={{ 
            backgroundColor: `${designTokens.colors.error}15`,
            border: `1px solid ${designTokens.colors.error}`,
            borderRadius: designTokens.radius.lg
          }}>
            <AlertCircle className="h-5 w-5" style={{ color: designTokens.colors.error }} />
            <AlertDescription className="text-base"
                              style={{ color: designTokens.colors.charcoal }}>
              Failed to load your models. Please try again.
              <div className="mt-2">
                <Button
                  onClick={() => refetch()}
                  size="sm"
                  className="px-3 py-1 text-xs"
                  style={{
                    background: designTokens.colors.error,
                    color: designTokens.colors.pure,
                    borderRadius: designTokens.radius.sm
                  }}
                >
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const avatarList = avatars?.avatars || [];
  // Only show completed avatars
  const completedAvatars = avatarList.filter(avatar => avatar.status === 'completed');

  return (
    <div className="min-h-screen pb-24"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="text-center pt-2 mb-6">
          <p className="text-base leading-relaxed"
             style={{ color: designTokens.colors.slate }}>
            Your personal fit models
          </p>
        </div>

        {/* Create Model Button */}
        <Button 
          onClick={() => navigate('/create-avatar')}
          className="w-full mb-8 py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
            color: designTokens.colors.pure,
            borderRadius: designTokens.radius.xl,
            boxShadow: designTokens.shadows.lg
          }}
        >
          <Plus className="w-5 h-5" />
          <span>Create Model</span>
        </Button>

        {/* Tips Card */}
        <Card className="mb-8 overflow-hidden"
              style={{ 
                background: `${designTokens.colors.sage}10`,
                border: `1px solid ${designTokens.colors.sage}30`,
                borderRadius: designTokens.radius.xl,
                boxShadow: designTokens.shadows.sm
              }}>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4"
                style={{ 
                  color: designTokens.colors.charcoal,
                  fontFamily: designTokens.typography.heading 
                }}>
              Better Quality Tips
            </h3>
            <ul className="space-y-3 text-base"
                style={{ color: designTokens.colors.slate }}>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                     style={{ backgroundColor: designTokens.colors.sage }} />
                <span>Good lighting on face and body</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                     style={{ backgroundColor: designTokens.colors.sage }} />
                <span>Stand straight, full body visible</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                     style={{ backgroundColor: designTokens.colors.sage }} />
                <span>Plain background, no heavy occlusions</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Empty State */}
        {completedAvatars.length === 0 && (
          <Card className="overflow-hidden"
                style={{ 
                  background: designTokens.colors.pure,
                  border: `1px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius['2xl'],
                  boxShadow: designTokens.shadows.lg
                }}>
            <div className="text-center py-16 px-8 space-y-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                   style={{ backgroundColor: designTokens.colors.pearl }}>
                <User className="w-8 h-8" style={{ color: designTokens.colors.ash }} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold"
                    style={{ 
                      fontFamily: designTokens.typography.heading,
                      color: designTokens.colors.charcoal 
                    }}>
                  No models yet
                </h3>
                <p className="text-base leading-relaxed max-w-sm mx-auto"
                   style={{ color: designTokens.colors.slate }}>
                  Create your first model to start your styling journey
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Models Grid */}
        {completedAvatars.length > 0 && (
          <div className="grid grid-cols-2 gap-5">
            {completedAvatars.map((avatar, index) => {
              const isSelected = selectedAvatarId === avatar.id;
              
              return (
                <Card 
                  key={avatar.id} 
                  className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  style={{ 
                    background: designTokens.colors.pure,
                    border: isSelected 
                      ? `2px solid ${designTokens.colors.sage}` 
                      : `1px solid ${designTokens.colors.stone}`,
                    borderRadius: designTokens.radius.xl,
                    boxShadow: isSelected 
                      ? designTokens.shadows.lg 
                      : designTokens.shadows.md
                  }}
                  onClick={() => handleSelectAvatar(avatar.id)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden"
                       style={{ borderRadius: `${designTokens.radius.xl} ${designTokens.radius.xl} 0 0` }}>
                    {avatar.processed_url || avatar.original_url ? (
                      <img
                        src={avatar.processed_url || avatar.original_url}
                        alt={`Model ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                           style={{ backgroundColor: designTokens.colors.pearl }}>
                        <User className="w-8 h-8" style={{ color: designTokens.colors.ash }} />
                      </div>
                    )}

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                             style={{ 
                               background: designTokens.colors.sage,
                               boxShadow: designTokens.shadows.md 
                             }}>
                          <Check className="w-4 h-4" style={{ color: designTokens.colors.pure }} />
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                         style={{
                           background: `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1) 100%)`,
                           borderRadius: `${designTokens.radius.xl} ${designTokens.radius.xl} 0 0`
                         }} />
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm"
                           style={{ color: designTokens.colors.charcoal }}>
                          Model {index + 1}
                        </p>
                        <p className="text-xs mt-1"
                           style={{ color: designTokens.colors.ash }}>
                          {new Date(avatar.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150"
                           style={{ 
                             backgroundColor: isSelected 
                               ? designTokens.colors.sage 
                               : designTokens.colors.stone 
                           }} />
                    </div>
                    
                    <Button
                      size="sm"
                      className="w-full text-xs py-3 font-medium transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${designTokens.colors.sage} 0%, ${designTokens.colors.sage}dd 100%)`
                          : designTokens.colors.ivory,
                        color: isSelected 
                          ? designTokens.colors.pure 
                          : designTokens.colors.charcoal,
                        border: isSelected 
                          ? 'none' 
                          : `1px solid ${designTokens.colors.stone}`,
                        borderRadius: designTokens.radius.lg,
                        boxShadow: isSelected ? designTokens.shadows.sm : 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAvatar(avatar.id);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Use this model'
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}