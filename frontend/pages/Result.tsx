import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Share2, ArrowLeft, RotateCcw, Sparkles, Heart, Crown } from 'lucide-react';
import TryonLoading from '../components/TryonLoading';
import StorageLimitModal from '../components/StorageLimitModal';
import { useBackend } from '../utils/backend';
import { useToast } from '@/components/ui/use-toast';
import { designTokens, styleHelpers } from '../styles/design-tokens';
import { getStorageStatus } from '../utils/storageUtils';

export default function Result() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showStorageModal, setShowStorageModal] = useState(false);

  // Get user's credit info (includes plan)
  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => backend.credits.getCredits(),
  });

  // Get user's saved results count
  const { data: savedResults } = useQuery({
    queryKey: ['library-results'],
    queryFn: () => backend.library.listResults({ limit: 100 }),
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ['tryon-job', jobId],
    queryFn: async () => {
      const result = await backend.tryon.status({ job_id: parseInt(jobId!) });
      console.log('Try-on job status:', result);
      return result;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      // Refetch every 3 seconds if job is still processing
      const data = query.state.data;
      const isProcessing = data?.status === 'pending' || data?.status === 'processing';
      if (isProcessing) {
        console.log(`Job ${jobId} still processing (${data.status}), will refetch in 3 seconds`);
      }
      return isProcessing ? 3000 : false;
    },
  });

  const retryTryonMutation = useMutation({
    mutationFn: () => backend.tryon.retry({ job_id: parseInt(jobId!) }),
    onSuccess: () => {
      toast({
        title: "Retrying try-on",
        description: "Starting a new try-on generation...",
      });
      // Refetch the job status to start polling again
      queryClient.invalidateQueries({ queryKey: ['tryon-job', jobId] });
    },
    onError: (error: unknown) => {
      console.error('Retry error:', error);
      toast({
        title: "Retry failed",
        description: "Failed to retry try-on generation.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => backend.library.saveResult({ job_id: parseInt(jobId!) }),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Look saved!",
          description: data.message,
        });
        // Refresh the results list
        queryClient.invalidateQueries({ queryKey: ['library-results'] });
      } else {
        // Show storage limit modal
        setShowStorageModal(true);
      }
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      if (error.message && error.message.includes('Upgrade to save')) {
        // Free plan - show upgrade modal
        setShowStorageModal(true);
      } else {
        toast({
          title: "Save failed",
          description: error.message || "Failed to save result.",
          variant: "destructive",
        });
      }
    },
  });

  const handleDownload = async () => {
    if (!job?.result_url) return;

    try {
      const response = await fetch(job.result_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `clozet-look-${job.id}.png`;
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
        description: "Failed to download the result image.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!job?.result_url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clozet Virtual Try-On',
          text: 'Check out my virtual try-on result!',
          url: window.location.href,
        });
      } catch (error: unknown) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Result link copied to clipboard.",
        });
      } catch (error) {
        console.error('Clipboard error:', error);
        toast({
          title: "Share failed",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  if (!jobId) {
    return (
      <div className="min-h-screen pt-8 pb-24 px-6"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto">
          <Alert variant="destructive" 
                 style={{ 
                   backgroundColor: `${designTokens.colors.error}15`,
                   border: `1px solid ${designTokens.colors.error}`,
                   borderRadius: designTokens.radius.lg
                 }}>
            <AlertDescription style={{ color: designTokens.colors.charcoal }}>
              Invalid job ID provided.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show full-screen loading if job is processing or initial load
  if (isLoading || (job && (job.status === 'pending' || job.status === 'processing'))) {
    return <TryonLoading />;
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-8 pb-24 px-6"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto">
          <Alert variant="destructive" 
                 style={{ 
                   backgroundColor: `${designTokens.colors.error}15`,
                   border: `1px solid ${designTokens.colors.error}`,
                   borderRadius: designTokens.radius.lg
                 }}>
            <AlertDescription style={{ color: designTokens.colors.charcoal }}>
              Try-on job not found.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-6"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/looks')}
            className="transition-all duration-300 hover:scale-105"
            style={{
              border: `2px solid ${designTokens.colors.stone}`,
              borderRadius: designTokens.radius.lg,
              color: designTokens.colors.charcoal,
              backgroundColor: designTokens.colors.ivory,
              fontFamily: designTokens.typography.body
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Button>
        </div>

        {job.status === 'failed' && (
          <div className="space-y-8">
            {/* Error State */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                   style={{ 
                     background: `linear-gradient(135deg, ${designTokens.colors.error}20 0%, ${designTokens.colors.error}10 100%)` 
                   }}>
                <RotateCcw className="w-10 h-10" style={{ color: designTokens.colors.error }} />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight"
                    style={{ 
                      fontFamily: designTokens.typography.heading,
                      color: designTokens.colors.charcoal 
                    }}>
                  Generation Failed
                </h1>
                <p className="text-lg leading-relaxed"
                   style={{ color: designTokens.colors.slate }}>
                  Couldn't generate the look — Try again.
                </p>
              </div>
            </div>

            <Alert style={{ 
              backgroundColor: `${designTokens.colors.error}15`,
              border: `1px solid ${designTokens.colors.error}`,
              borderRadius: designTokens.radius.lg
            }}>
              <AlertDescription className="text-base leading-relaxed"
                                style={{ color: designTokens.colors.charcoal }}>
                {job.error_message || 'Sorry, your try-on failed to process. Please try again.'}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-5 justify-center">
              <Button 
                onClick={() => retryTryonMutation.mutate()} 
                disabled={retryTryonMutation.isPending}
                className="py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                style={{
                  background: retryTryonMutation.isPending 
                    ? designTokens.colors.ash
                    : `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                  color: designTokens.colors.pure,
                  borderRadius: designTokens.radius.xl,
                  boxShadow: retryTryonMutation.isPending ? 'none' : designTokens.shadows.lg
                }}
                size="lg"
              >
                {retryTryonMutation.isPending ? 'Starting Retry...' : 'Try Again'}
              </Button>
              
              <Button 
                onClick={() => navigate('/try-new-look')} 
                variant="outline"
                size="lg"
                className="py-6 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: `2px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius.xl,
                  color: designTokens.colors.charcoal,
                  backgroundColor: designTokens.colors.ivory
                }}
              >
                Style Me Again
              </Button>
            </div>
          </div>
        )}

        {job.status === 'completed' && job.result_url && (
          <div className="space-y-8">
            {/* Success State */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                   style={{ 
                     background: `linear-gradient(135deg, ${designTokens.colors.sage}20 0%, ${designTokens.colors.blush}20 100%)` 
                   }}>
                <Sparkles className="w-10 h-10" style={{ color: designTokens.colors.charcoal }} />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight"
                    style={{ 
                      fontFamily: designTokens.typography.heading,
                      color: designTokens.colors.charcoal 
                    }}>
                  Your New Look
                </h1>
                <p className="text-lg leading-relaxed"
                   style={{ color: designTokens.colors.slate }}>
                  Looking fabulous! This look suits you perfectly.
                </p>
              </div>
            </div>

            {/* Result Image */}
            <Card className="overflow-hidden"
                  style={{ 
                    background: designTokens.colors.pure,
                    border: `1px solid ${designTokens.colors.stone}`,
                    borderRadius: designTokens.radius['2xl'],
                    boxShadow: designTokens.shadows.xl
                  }}>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={job.result_url}
                    alt="Virtual try-on result"
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                    style={{ borderRadius: designTokens.radius['2xl'] }}
                    onError={(e) => {
                      console.error('Failed to load result image:', job.result_url);
                      console.error('Image error event:', e);
                    }}
                    onLoad={() => {
                      console.log('Result image loaded successfully:', job.result_url);
                    }}
                  />
                  
                  {/* Elegant overlay gradient */}
                  <div className="absolute inset-0 pointer-events-none"
                       style={{
                         background: `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.05) 100%)`,
                         borderRadius: designTokens.radius['2xl']
                       }} />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Save Button */}
              <Button 
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="flex-1 sm:flex-none py-4 px-6 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: credits?.plan === 'free' 
                    ? `linear-gradient(135deg, ${designTokens.colors.error} 0%, #d32f2f 100%)`
                    : `linear-gradient(135deg, ${designTokens.colors.sage} 0%, #4caf50 100%)`,
                  color: designTokens.colors.pure,
                  borderRadius: designTokens.radius.lg,
                  boxShadow: designTokens.shadows.md
                }}
              >
                {credits?.plan === 'free' ? (
                  <>
                    <Crown className="w-5 h-5 mr-3" />
                    Upgrade to Save
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-3" />
                    {saveMutation.isPending ? 'Saving...' : 'Save Look'}
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="flex-1 sm:flex-none py-4 px-6 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: `2px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius.lg,
                  color: designTokens.colors.charcoal,
                  backgroundColor: designTokens.colors.ivory
                }}
              >
                <Download className="w-5 h-5 mr-3" />
                Download
              </Button>
              
              <Button 
                onClick={handleShare} 
                variant="outline" 
                className="flex-1 sm:flex-none py-4 px-6 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: `2px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius.lg,
                  color: designTokens.colors.charcoal,
                  backgroundColor: designTokens.colors.ivory
                }}
              >
                <Share2 className="w-5 h-5 mr-3" />
                Share
              </Button>
            </div>

            {/* Try Another Look */}
            <div className="text-center pt-4">
              <Button 
                onClick={() => navigate('/try-new-look')} 
                variant="outline"
                size="lg"
                className="py-6 px-8 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: `2px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius.xl,
                  color: designTokens.colors.charcoal,
                  backgroundColor: designTokens.colors.ivory
                }}
              >
                Style Me Again
              </Button>
            </div>

            {/* Auto-saved Notice */}
            <div className="text-center pt-2">
              <p className="text-sm leading-relaxed"
                 style={{ color: designTokens.colors.ash }}>
                ✨ Automatically saved to your collection
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Storage Limit Modal */}
      <StorageLimitModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        currentPlan={credits?.plan || 'free'}
        savedCount={savedResults?.results?.length || 0}
        maxSaves={getStorageStatus(credits?.plan || 'free', savedResults?.results?.length || 0).limit}
      />
    </div>
  );
}