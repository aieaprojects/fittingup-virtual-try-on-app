import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, User, Camera, ArrowRight, Info, RotateCcw } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBackend } from '../utils/backend';
import { useToast } from '@/components/ui/use-toast';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function CreateAvatar() {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();

  const guidelines = [
    'Stand in front of a plain, neutral background',
    'Ensure soft, even lighting on your face and body', 
    'Wear well-fitted clothing (avoid loose or baggy items)',
    'Face the camera directly with arms slightly away from body',
    'Make sure your full body is visible from head to feet',
    'Avoid mirrors, other people, or distracting objects',
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setError(null); // Clear any previous errors
  };

  const clearPreview = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview('');
    }
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      console.log('Starting avatar upload...', {
        filename: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });

      // Get signed upload URL from backend
      const response = await backend.avatar.upload({
        filename: selectedFile.name,
        content_type: selectedFile.type,
        file_size: selectedFile.size,
      });

      console.log('Avatar upload response:', response);

      // Upload file to signed URL
      const uploadResponse = await fetch(response.upload_url, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      console.log('File upload response:', uploadResponse.status, uploadResponse.statusText);

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file to storage: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      // Mark avatar as completed after successful upload
      await backend.avatar.complete({ avatar_id: response.avatar_id });

      // Show success message
      toast({
        title: "Model saved",
        description: "Your model has been saved successfully.",
      });

      // Navigate to Models to show the uploaded model
      navigate('/avatars');

    } catch (error) {
      console.error('Upload error:', error);
      
      // More detailed error message
      let errorMessage = "Couldn't save model—Try again.";
      if (error instanceof Error) {
        errorMessage = `Upload failed: ${error.message}`;
        console.error('Detailed error:', error);
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleUpload();
  };

  return (
    <div className="min-h-screen pb-24"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-lg mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="text-center pt-2">
          <div className="space-y-2">
            <p className="text-base leading-relaxed"
               style={{ color: designTokens.colors.slate }}>
              Upload a full-body photo to start your virtual try-on journey
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-6">
          <div className={`flex items-center space-x-3 transition-all duration-300`}
               style={{ 
                 color: step >= 1 ? designTokens.colors.charcoal : designTokens.colors.ash 
               }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                 style={{
                   background: step >= 1 
                     ? `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`
                     : designTokens.colors.stone,
                   color: step >= 1 ? designTokens.colors.pure : designTokens.colors.ash
                 }}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : <span className="font-semibold">1</span>}
            </div>
            <span className="font-medium text-sm tracking-wide">Guidelines</span>
          </div>
          
          <div className="w-16 h-0.5 transition-all duration-300"
               style={{ backgroundColor: step >= 2 ? designTokens.colors.charcoal : designTokens.colors.stone }}></div>
          
          <div className={`flex items-center space-x-3 transition-all duration-300`}
               style={{ 
                 color: step >= 2 ? designTokens.colors.charcoal : designTokens.colors.ash 
               }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                 style={{
                   background: step >= 2 
                     ? `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`
                     : designTokens.colors.stone,
                   color: step >= 2 ? designTokens.colors.pure : designTokens.colors.ash
                 }}>
              {step > 2 ? <CheckCircle className="w-5 h-5" /> : <span className="font-semibold">2</span>}
            </div>
            <span className="font-medium text-sm tracking-wide">Upload</span>
          </div>
        </div>

        {/* Step 1: Guidelines */}
        {step === 1 && (
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
                     background: `linear-gradient(135deg, ${designTokens.colors.lavender}20 0%, ${designTokens.colors.champagne}20 100%)` 
                   }}>
                <Camera className="w-8 h-8" style={{ color: designTokens.colors.charcoal }} />
              </div>
              <CardTitle className="text-2xl font-semibold mb-3"
                         style={{ 
                           fontFamily: designTokens.typography.heading,
                           color: designTokens.colors.charcoal 
                         }}>
                Photo Guidelines
              </CardTitle>
              <CardDescription className="text-base leading-relaxed"
                              style={{ color: designTokens.colors.slate }}>
                Follow these guidelines to get the best virtual try-on results
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-0">
              <div className="grid gap-5">
                {guidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-all duration-300"
                         style={{ 
                           backgroundColor: `${designTokens.colors.sage}20`,
                           border: `2px solid ${designTokens.colors.sage}`
                         }}>
                      <CheckCircle className="w-4 h-4" style={{ color: designTokens.colors.sage }} />
                    </div>
                    <span className="text-base leading-relaxed group-hover:scale-[1.01] transition-transform duration-200"
                          style={{ color: designTokens.colors.charcoal }}>
                      {guideline}
                    </span>
                  </div>
                ))}
              </div>

              {/* Image Guidelines Visual */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center"
                    style={{ 
                      fontFamily: designTokens.typography.heading,
                      color: designTokens.colors.charcoal 
                    }}>
                  Photo Examples
                </h4>
                <div className="flex justify-center">
                  <img
                    src="/avatar-guidelines.png"
                    alt="Avatar Photo Guidelines"
                    className="w-full max-w-md rounded-xl shadow-lg"
                    style={{
                      imageRendering: '-webkit-optimize-contrast'
                    }}
                  />
                </div>
              </div>

              <Alert style={{ 
                backgroundColor: `${designTokens.colors.blush}15`,
                border: `1px solid ${designTokens.colors.blush}`,
                borderRadius: designTokens.radius.lg
              }}>
                <Info className="h-5 w-5" style={{ color: designTokens.colors.charcoal }} />
                <AlertDescription className="text-sm leading-relaxed"
                                  style={{ color: designTokens.colors.charcoal }}>
                  <strong>Privacy:</strong> Your photos are securely stored and only used for virtual try-on. 
                  They are never shared with third parties.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                  color: designTokens.colors.pure,
                  borderRadius: designTokens.radius.xl,
                  boxShadow: designTokens.shadows.lg
                }}
                size="lg"
              >
                I Understand
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
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
                     background: `linear-gradient(135deg, ${designTokens.colors.lavender}20 0%, ${designTokens.colors.champagne}20 100%)` 
                   }}>
                <User className="w-8 h-8" style={{ color: designTokens.colors.charcoal }} />
              </div>
              <CardTitle className="text-2xl font-semibold mb-3"
                         style={{ 
                           fontFamily: designTokens.typography.heading,
                           color: designTokens.colors.charcoal 
                         }}>
                Upload Your Photo
              </CardTitle>
              <CardDescription className="text-base leading-relaxed"
                              style={{ color: designTokens.colors.slate }}>
                Upload a full-body photo following the guidelines
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-0">
              <ImageUpload
                onFileSelect={handleFileSelect}
                preview={preview}
                onClearPreview={clearPreview}
              />

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" 
                       style={{ 
                         backgroundColor: `${designTokens.colors.error}15`,
                         border: `1px solid ${designTokens.colors.error}`,
                         borderRadius: designTokens.radius.lg
                       }}>
                  <AlertDescription className="flex items-center justify-between text-sm"
                                    style={{ color: designTokens.colors.charcoal }}>
                    <span>{error}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      disabled={uploading}
                      className="ml-4 transition-all duration-300 hover:scale-105"
                      style={{
                        border: `1px solid ${designTokens.colors.stone}`,
                        borderRadius: designTokens.radius.md
                      }}
                    >
                      <RotateCcw className="w-3 h-3 mr-2" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {selectedFile && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                    disabled={uploading}
                    style={{
                      border: `2px solid ${designTokens.colors.stone}`,
                      borderRadius: designTokens.radius.lg,
                      color: designTokens.colors.charcoal,
                      backgroundColor: designTokens.colors.ivory
                    }}
                  >
                    Back to Guidelines
                  </Button>
                  
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 py-4 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                    style={{
                      background: uploading 
                        ? designTokens.colors.ash
                        : `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
                      color: designTokens.colors.pure,
                      borderRadius: designTokens.radius.lg,
                      boxShadow: uploading ? 'none' : designTokens.shadows.lg
                    }}
                  >
                    {uploading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-3" />
                        Saving Model...
                      </>
                    ) : (
                      'Save Model'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}