import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, User, Upload, Info } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import AvatarPicker from '../components/AvatarPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import CreditLimitModal from '../components/CreditLimitModal';
import { useBackend } from '../utils/backend';
import { useToast } from '@/components/ui/use-toast';
import { useAvatarSelection } from '../contexts/AvatarSelectionContext';
import { designTokens, styleHelpers } from '../styles/design-tokens';

type FlowStep = 'loading' | 'no-avatars' | 'choose-avatar' | 'upload-fit';

export default function TryNewLook() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const { selectedAvatarId, setSelectedAvatarId } = useAvatarSelection();
  
  const [step, setStep] = useState<FlowStep>('loading');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [fitName, setFitName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tempSelectedAvatarId, setTempSelectedAvatarId] = useState<number | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditInfo, setCreditInfo] = useState<any>(null);

  // Get user's credit info
  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => backend.credits.getCredits(),
  });

  // Check if user has any completed avatars
  const { data: avatars, isLoading, error } = useQuery({
    queryKey: ['library-avatars'],
    queryFn: async () => {
      console.log('TryNewLook: Fetching library avatars...');
      try {
        const response = await backend.library.listAvatars({ limit: 20 });
        console.log('TryNewLook: Library avatars response:', response);
        return response;
      } catch (error) {
        console.error('TryNewLook: Error fetching avatars:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (!isLoading && avatars) {
      const completedAvatars = avatars.avatars?.filter(a => a.status === 'completed') || [];
      
      if (completedAvatars.length === 0) {
        // No avatars - send to create avatar
        setStep('no-avatars');
      } else if (selectedAvatarId && completedAvatars.some(a => a.id === selectedAvatarId)) {
        // Has selected avatar - go straight to upload fit
        setStep('upload-fit');
      } else {
        // Has avatars but none selected - choose avatar first
        setStep('choose-avatar');
      }
    }
  }, [isLoading, avatars, selectedAvatarId]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // Auto-generate fit name from filename
    const name = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setFitName(name);
  };

  const clearPreview = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview('');
    }
    setFitName('');
  };

  const handleChooseAvatar = (avatarId: number) => {
    setTempSelectedAvatarId(avatarId);
  };

  const handleConfirmAvatar = () => {
    if (tempSelectedAvatarId) {
      setSelectedAvatarId(tempSelectedAvatarId);
      setStep('upload-fit');
    }
  };

  const handleUploadFit = async () => {
    if (!selectedFile || !fitName.trim() || !selectedAvatarId) return;

    // Check credits before starting
    try {
      const creditCheck = await backend.credits.checkCredits();
      if (!creditCheck.has_credits) {
        setCreditInfo(creditCheck.credit_info);
        setShowCreditModal(true);
        return;
      }
    } catch (error) {
      console.error('Credit check error:', error);
      toast({
        title: "Error",
        description: "Failed to check credits. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload fit
      const response = await backend.fit.upload({
        name: fitName.trim(),
        filename: selectedFile.name,
        content_type: selectedFile.type,
        file_size: selectedFile.size,
      });

      // Upload file to signed URL
      if (response.upload_url) {
        const uploadResponse = await fetch(response.upload_url, {
          method: 'PUT',
          body: selectedFile,
          headers: {
            'Content-Type': selectedFile.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }
      }

      // Mark fit as completed after successful upload
      await backend.fit.complete({ fit_id: response.fit_id });

      // Start try-on generation
      const tryonResponse = await backend.tryon.start({
        avatar_id: selectedAvatarId,
        fit_id: response.fit_id,
      });

      // Navigate to result page with loading
      navigate(`/result/${tryonResponse.job_id}`);

    } catch (error) {
      console.error('Upload error:', error);
      
      // Check if it's a credit error by checking the error message
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Insufficient credits')) {
        // Get current credit info and show modal
        try {
          const creditCheck = await backend.credits.checkCredits();
          setCreditInfo(creditCheck.credit_info);
          setShowCreditModal(true);
        } catch {
          // Fallback to generic credit error
          setShowCreditModal(true);
        }
      } else {
        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen pb-24"
           style={{ background: styleHelpers.gradients.warm }}>
        <div className="max-w-lg mx-auto px-6">
          <div className="flex justify-center pt-20">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="text-center pt-2">
          <div className="space-y-2">
            <p className="text-base leading-relaxed"
               style={{ color: designTokens.colors.slate }}>
              Upload a garment and see how it transforms your style
            </p>
            {credits && (
              <p className="text-sm"
                 style={{ 
                   color: designTokens.colors.ash,
                   fontFamily: designTokens.typography.body
                 }}>
                Credits left: {credits.credits_remaining}
              </p>
            )}
          </div>
        </div>

        {/* Step: No Avatars */}
        {step === 'no-avatars' && (
          <Card className="overflow-hidden"
                style={{ 
                  background: designTokens.colors.pure,
                  border: `1px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius['2xl'],
                  boxShadow: designTokens.shadows.lg
                }}>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: designTokens.colors.pearl }}>
                <User className="w-8 h-8" style={{ color: designTokens.colors.ash }} />
              </div>
              <CardTitle className="text-2xl font-semibold mb-3"
                         style={{ 
                           fontFamily: designTokens.typography.heading,
                           color: designTokens.colors.charcoal 
                         }}>
                Create Your Avatar First
              </CardTitle>
              <CardDescription className="text-base leading-relaxed"
                              style={{ color: designTokens.colors.slate }}>
                You need a full-body photo to try on fits
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-0">
              <Alert style={{ 
                backgroundColor: `${designTokens.colors.champagne}20`,
                border: `1px solid ${designTokens.colors.champagne}`,
                borderRadius: designTokens.radius.lg
              }}>
                <Info className="h-5 w-5" style={{ color: designTokens.colors.charcoal }} />
                <AlertDescription className="text-sm leading-relaxed"
                                  style={{ color: designTokens.colors.charcoal }}>
                  <strong>Quick guide:</strong> Stand straight with your full body visible, 
                  good lighting, and a plain background for best results.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => navigate('/create-avatar')}
                className="w-full py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                  color: designTokens.colors.pure,
                  borderRadius: designTokens.radius.xl,
                  boxShadow: designTokens.shadows.lg
                }}
                size="lg"
              >
                Create Model
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Choose Avatar */}
        {step === 'choose-avatar' && avatars?.avatars && (
          <Card className="overflow-hidden"
                style={{ 
                  background: designTokens.colors.pure,
                  border: `1px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius['2xl'],
                  boxShadow: designTokens.shadows.lg
                }}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold mb-3"
                         style={{ 
                           fontFamily: designTokens.typography.heading,
                           color: designTokens.colors.charcoal 
                         }}>
                Choose a Model
              </CardTitle>
              <CardDescription className="text-base leading-relaxed"
                              style={{ color: designTokens.colors.slate }}>
                Select which model to use for this styling session
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-0">
              <AvatarPicker 
                avatars={avatars.avatars}
                onSelect={handleChooseAvatar}
                selectedId={tempSelectedAvatarId}
              />
              
              {tempSelectedAvatarId && (
                <Button 
                  onClick={handleConfirmAvatar}
                  className="w-full py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                    color: designTokens.colors.pure,
                    borderRadius: designTokens.radius.xl,
                    boxShadow: designTokens.shadows.lg
                  }}
                  size="lg"
                >
                  Continue with this Model
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step: Upload Fit */}
        {step === 'upload-fit' && (
          <Card className="overflow-hidden"
                style={{ 
                  background: designTokens.colors.pure,
                  border: `1px solid ${designTokens.colors.stone}`,
                  borderRadius: designTokens.radius['2xl'],
                  boxShadow: designTokens.shadows.lg
                }}>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                   style={{ 
                     background: `linear-gradient(135deg, ${designTokens.colors.sage}20 0%, ${designTokens.colors.blush}20 100%)` 
                   }}>
                <Upload className="w-8 h-8" style={{ color: designTokens.colors.charcoal }} />
              </div>
              <CardTitle className="text-2xl font-semibold mb-3"
                         style={{ 
                           fontFamily: designTokens.typography.heading,
                           color: designTokens.colors.charcoal 
                         }}>
                Upload Your Garment
              </CardTitle>
              <CardDescription className="text-base leading-relaxed"
                              style={{ color: designTokens.colors.slate }}>
                Take a photo or upload an image of the clothing item
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-0">
              <div>
                <Label htmlFor="fit-name" 
                       className="text-sm font-semibold tracking-wide mb-3 block"
                       style={{ color: designTokens.colors.charcoal }}>
                  Garment Name
                </Label>
                <Input
                  id="fit-name"
                  placeholder="e.g., Vintage Denim Jacket"
                  value={fitName}
                  onChange={(e) => setFitName(e.target.value)}
                  className="text-base py-3 px-4 transition-all duration-300 focus:scale-[1.02]"
                  style={{
                    border: `2px solid ${designTokens.colors.stone}`,
                    borderRadius: designTokens.radius.lg,
                    fontFamily: designTokens.typography.body,
                    backgroundColor: designTokens.colors.ivory
                  }}
                />
              </div>

              <ImageUpload
                onFileSelect={handleFileSelect}
                preview={preview}
                onClearPreview={clearPreview}
              />

              {selectedFile && (
                <Button
                  onClick={handleUploadFit}
                  disabled={!fitName.trim() || uploading}
                  className="w-full py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                  style={{
                    background: uploading 
                      ? designTokens.colors.ash
                      : `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                    color: designTokens.colors.pure,
                    borderRadius: designTokens.radius.xl,
                    boxShadow: uploading ? 'none' : designTokens.shadows.lg
                  }}
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-3" />
                      Creating Your Look...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      Try This Garment
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Credit Limit Modal */}
        <CreditLimitModal 
          isOpen={showCreditModal}
          onClose={() => setShowCreditModal(false)}
          creditInfo={creditInfo}
        />
      </div>
    </div>
  );
}