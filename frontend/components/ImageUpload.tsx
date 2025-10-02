import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Camera, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '../config';
import { designTokens } from '../styles/design-tokens';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  preview?: string;
  onClearPreview?: () => void;
}

export default function ImageUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = MAX_FILE_SIZE,
  className = '',
  preview,
  onClearPreview,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${formatFileSize(maxSize)}`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type
    const supportedTypes = SUPPORTED_FORMATS;
    if (!supportedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        
        if (validateFile(file)) {
          onFileSelect(file);
        }
        
        // Reset input value to allow selecting the same file again
        event.target.value = '';
      }
    },
    [onFileSelect, maxSize, toast]
  );

  const handleButtonClick = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleTakePhoto = useCallback(() => {
    setShowUploadModal(false);
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  const handleChooseFromLibrary = useCallback(() => {
    setShowUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Show preview if image is selected
  if (preview) {
    return (
      <div className={`relative ${className}`} aria-live="polite">
        <div className="relative group">
          <img
            src={preview}
            alt="Garment preview"
            className="w-full h-72 object-contain transition-all duration-300"
            style={{ 
              borderRadius: designTokens.radius.xl,
              border: `2px solid ${designTokens.colors.stone}`,
              boxShadow: designTokens.shadows.md,
              backgroundColor: designTokens.colors.pearl
            }}
          />
          
          {/* Elegant overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl" />
          
          {onClearPreview && (
            <Button
              size="sm"
              className="absolute top-3 right-3 transition-all duration-300 hover:scale-110"
              onClick={onClearPreview}
              style={{
                background: `${designTokens.colors.pure}95`,
                color: designTokens.colors.charcoal,
                borderRadius: designTokens.radius.lg,
                boxShadow: designTokens.shadows.lg,
                backdropFilter: 'blur(10px)'
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show upload button
  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Single upload button */}
        <Button
          onClick={handleButtonClick}
          className="w-full py-6 text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.charcoal} 0%, #1a1a1a 100%)`,
            color: designTokens.colors.pure,
            borderRadius: designTokens.radius.xl,
            boxShadow: designTokens.shadows.lg
          }}
          size="lg"
        >
          <Upload className="w-5 h-5 mr-3" />
          Upload Photo
        </Button>

        {/* Hint text */}
        <p className="text-center text-sm"
           style={{ color: designTokens.colors.ash }}>
          JPEG/PNG/WebP • Max {formatFileSize(maxSize)}
        </p>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={accept}
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload Option Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-sm mx-auto"
                      style={{
                        background: designTokens.colors.pure,
                        border: `1px solid ${designTokens.colors.stone}`,
                        borderRadius: designTokens.radius['2xl'],
                        boxShadow: designTokens.shadows.xl
                      }}>
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-semibold"
                        style={{
                          fontFamily: designTokens.typography.heading,
                          color: designTokens.colors.charcoal
                        }}>
              Upload Photo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <Button
              onClick={handleTakePhoto}
              className="w-full py-6 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              variant="outline"
              style={{
                border: `2px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                color: designTokens.colors.charcoal,
                backgroundColor: designTokens.colors.pure
              }}
            >
              <Camera className="w-5 h-5 mr-3" />
              Take a Photo
            </Button>
            
            <Button
              onClick={handleChooseFromLibrary}
              className="w-full py-6 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              variant="outline"
              style={{
                border: `2px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                color: designTokens.colors.charcoal,
                backgroundColor: designTokens.colors.pure
              }}
            >
              <ImageIcon className="w-5 h-5 mr-3" />
              Choose from Library
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}