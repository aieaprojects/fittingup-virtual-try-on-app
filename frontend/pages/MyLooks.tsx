import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Eye, Download, AlertCircle, Plus, Crown } from 'lucide-react';
import { useBackend } from '../utils/backend';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import StorageLimitModal from '../components/StorageLimitModal';
import { designTokens, styleHelpers } from '../styles/design-tokens';
import { getStorageStatus } from '../utils/storageUtils';

export default function MyLooks() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const [showStorageModal, setShowStorageModal] = useState(false);

  console.log('MyLooks component rendered');

  // Get user's credit info (includes plan)
  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => backend.credits.getCredits(),
  });

  const { data: results, isLoading, error, refetch } = useQuery({
    queryKey: ['library-results'],
    queryFn: async () => {
      console.log('MyLooks: Fetching library results...');
      try {
        const response = await backend.library.listResults({ limit: 50 });
        console.log('MyLooks: Library results response:', response);
        return response;
      } catch (error) {
        console.error('MyLooks: Error fetching results:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleViewResult = (resultId: number) => {
    navigate(`/result/${resultId}`);
  };

  const handleDownloadResult = async (resultUrl: string, resultId: number) => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `clozet-look-${resultId}.png`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your look is being downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the image.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto px-6">
          <div className="pt-2 mb-6">
            <p className="text-base leading-relaxed text-center"
               style={{ color: designTokens.colors.slate }}>
              Your personal style collection
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
    console.error('Error loading looks:', error);
    return (
      <div className="min-h-screen pb-24"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto px-6">
          <div className="pt-2 mb-6">
            <p className="text-base leading-relaxed text-center"
               style={{ color: designTokens.colors.slate }}>
              Your personal style collection
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
              Failed to load your looks. Please try again.
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

  const looks = results?.results || [];
  const currentPlan = credits?.plan || 'free';
  const storageStatus = getStorageStatus(currentPlan, looks.length);

  return (
    <div className="min-h-screen pb-24"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="pt-2 mb-6">
          <div className="text-center space-y-2">
            <p className="text-base leading-relaxed"
               style={{ color: designTokens.colors.slate }}>
              Your personal style collection
            </p>
            {/* Storage Counter */}
            <div className="flex items-center justify-center space-x-2">
              <div className="px-3 py-1 rounded-full text-sm font-medium"
                   style={{ 
                     backgroundColor: currentPlan === 'free' 
                       ? `${designTokens.colors.error}20`
                       : storageStatus.isAtLimit 
                         ? `${designTokens.colors.error}20`
                         : `${designTokens.colors.sage}20`,
                     color: currentPlan === 'free' 
                       ? designTokens.colors.error
                       : storageStatus.isAtLimit 
                         ? designTokens.colors.error
                         : designTokens.colors.sage
                   }}>
                {storageStatus.displayText}
              </div>
              {currentPlan === 'free' && (
                <Button
                  onClick={() => navigate('/upgrade')}
                  size="sm"
                  className="px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                    color: designTokens.colors.pure,
                    borderRadius: designTokens.radius.lg
                  }}
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {looks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 space-y-8">
            <Card className="overflow-hidden"
                  style={{ 
                    background: designTokens.colors.pure,
                    border: `1px solid ${designTokens.colors.stone}`,
                    borderRadius: designTokens.radius['2xl'],
                    boxShadow: designTokens.shadows.lg
                  }}>
              <CardContent className="p-12">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                       style={{ backgroundColor: designTokens.colors.pearl }}>
                    <Sparkles className="w-8 h-8" style={{ color: designTokens.colors.ash }} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold"
                        style={{ 
                          fontFamily: designTokens.typography.heading,
                          color: designTokens.colors.charcoal 
                        }}>
                      No looks yet
                    </h3>
                    <p className="text-base leading-relaxed max-w-sm mx-auto"
                       style={{ color: designTokens.colors.slate }}>
                      Your virtual try-on results will appear here once you start creating looks
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate('/try-new-look')}
                    className="px-8 py-4 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                      color: designTokens.colors.pure,
                      borderRadius: designTokens.radius.xl,
                      boxShadow: designTokens.shadows.lg
                    }}
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Style Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Grid */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-medium"
                   style={{ color: designTokens.colors.charcoal }}>
                  {looks.length} look{looks.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm"
                   style={{ color: designTokens.colors.ash }}>
                  Your style journey
                </p>
              </div>
              <Button 
                onClick={() => navigate('/try-new-look')}
                className="px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                  color: designTokens.colors.pure,
                  borderRadius: designTokens.radius.lg,
                  boxShadow: designTokens.shadows.md
                }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Style Me
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              {looks.map((result, index) => (
                <Card key={result.id} 
                      className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                      style={{ 
                        background: designTokens.colors.pure,
                        border: `1px solid ${designTokens.colors.stone}`,
                        borderRadius: designTokens.radius.xl,
                        boxShadow: designTokens.shadows.md
                      }}
                      onClick={() => handleViewResult(result.id)}>
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden"
                           style={{ borderRadius: `${designTokens.radius.xl} ${designTokens.radius.xl} 0 0` }}>
                        {result.result_url ? (
                          <img
                            src={result.result_url}
                            alt={`Look ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              console.error('Failed to load result image:', result.result_url);
                              console.error('Image error event:', e);
                            }}
                            onLoad={() => {
                              console.log('Result image loaded successfully:', result.result_url);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                               style={{ backgroundColor: designTokens.colors.pearl }}>
                            <AlertCircle className="w-8 h-8" style={{ color: designTokens.colors.ash }} />
                          </div>
                        )}
                        
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              className="transition-all duration-300 hover:scale-110"
                              style={{
                                background: `${designTokens.colors.pure}95`,
                                color: designTokens.colors.charcoal,
                                borderRadius: designTokens.radius.lg,
                                boxShadow: designTokens.shadows.lg,
                                backdropFilter: 'blur(10px)'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewResult(result.id);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {result.result_url && (
                              <Button
                                size="sm"
                                className="transition-all duration-300 hover:scale-110"
                                style={{
                                  background: `${designTokens.colors.pure}95`,
                                  color: designTokens.colors.charcoal,
                                  borderRadius: designTokens.radius.lg,
                                  boxShadow: designTokens.shadows.lg,
                                  backdropFilter: 'blur(10px)'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadResult(result.result_url!, result.id);
                                }}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 pointer-events-none"
                             style={{
                               background: `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1) 100%)`,
                               borderRadius: `${designTokens.radius.xl} ${designTokens.radius.xl} 0 0`
                             }} />
                      </div>
                      
                      {/* Result info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm"
                               style={{ color: designTokens.colors.charcoal }}>
                              Look {index + 1}
                            </p>
                            <p className="text-xs mt-1"
                               style={{ color: designTokens.colors.ash }}>
                              {new Date(result.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150"
                               style={{ backgroundColor: designTokens.colors.sage }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Storage Limit Modal */}
      <StorageLimitModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        currentPlan={currentPlan}
        savedCount={looks.length}
        maxSaves={storageStatus.limit}
      />
    </div>
  );
}