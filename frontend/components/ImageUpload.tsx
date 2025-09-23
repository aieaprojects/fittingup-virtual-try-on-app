import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORTED_FORMATS, MAX_FILE_SIZE } from '../config';
import { designTokens } from '../styles/design-tokens';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  preview?: string;
  onClearPreview?: () => void;
  showCameraOption?: boolean;
}

export default function ImageUpload({
  onFileSelect,
  accept,
  maxSize = MAX_FILE_SIZE,
  className = '',
  preview,
  onClearPreview,
  showCameraOption = true,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCameraCapture = useCallback(() => {
    setCameraError('');
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  const handleFileUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleCameraChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
        setShowOptions(false);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
        setShowOptions(false);
      }
    },
    [onFileSelect]
  );

  // Check if camera access is available
  const checkCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      setCameraError('Camera access blocked. Please allow it in settings or upload from your device.');
      return false;
    }
  };

  if (preview) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-72 object-cover transition-all duration-300"
            style={{ 
              borderRadius: designTokens.radius.xl,
              border: `2px solid ${designTokens.colors.stone}`,
              boxShadow: designTokens.shadows.md
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

  // Show upload button that opens action sheet
  if (showCameraOption && !showOptions && !preview) {
    return (
      <div className={className}>
        <Button
          onClick={() => setShowOptions(true)}
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
          Upload Image
        </Button>
      </div>
    );
  }

  // Show native-style action sheet
  if (showOptions && !preview) {
    return (
      <div className={className}>
        {/* Action Sheet Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowOptions(false)}
        >
          <div 
            className="w-full bg-white rounded-t-3xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: designTokens.colors.pure,
              borderRadius: `${designTokens.radius['2xl']} ${designTokens.radius['2xl']} 0 0`,
              boxShadow: `0 -10px 25px -5px ${designTokens.colors.charcoal}20`
            }}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            
            {/* Camera Option */}
            <Button
              onClick={async () => {
                const hasPermission = await checkCameraPermission();
                if (hasPermission) {
                  handleCameraCapture();
                }
              }}
              className="w-full flex items-center justify-center space-x-3 py-4 text-lg font-medium"
              variant="outline"
              style={{
                border: `2px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                backgroundColor: designTokens.colors.ivory,
                color: designTokens.colors.charcoal
              }}
            >
              <Camera className="w-6 h-6" />
              <span>Take Photo</span>
            </Button>
            
            {/* Upload Option */}
            <Button
              onClick={handleFileUpload}
              className="w-full flex items-center justify-center space-x-3 py-4 text-lg font-medium"
              variant="outline"
              style={{
                border: `2px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                backgroundColor: designTokens.colors.ivory,
                color: designTokens.colors.charcoal
              }}
            >
              <Upload className="w-6 h-6" />
              <span>Upload from Device</span>
            </Button>
            
            {/* Camera Error Message */}
            {cameraError && (
              <div className="p-4"
                   style={{ 
                     backgroundColor: `${designTokens.colors.error}15`,
                     border: `1px solid ${designTokens.colors.error}`,
                     borderRadius: designTokens.radius.lg
                   }}>
                <p className="text-sm text-center"
                   style={{ color: designTokens.colors.charcoal }}>
                  {cameraError}
                </p>
              </div>
            )}
            
            {/* Cancel Button */}
            <Button
              onClick={() => setShowOptions(false)}
              variant="ghost"
              className="w-full py-4 text-lg font-medium"
              style={{ 
                color: designTokens.colors.slate,
                backgroundColor: 'transparent'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        
        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraChange}
          style={{ display: 'none' }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || 'image/jpeg,image/png,image/webp'}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className="cursor-pointer transition-all duration-300 hover:scale-[1.01]"
        style={{
          border: `2px dashed ${isDragActive || dragActive ? designTokens.colors.sage : designTokens.colors.stone}`,
          borderRadius: designTokens.radius.xl,
          backgroundColor: isDragActive || dragActive 
            ? `${designTokens.colors.sage}10` 
            : designTokens.colors.ivory,
          padding: '3rem 2rem',
          boxShadow: isDragActive || dragActive ? designTokens.shadows.md : 'none'
        }}
      >
        <input {...getInputProps()} />
        
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
               style={{ 
                 background: `linear-gradient(135deg, ${designTokens.colors.sage}20 0%, ${designTokens.colors.blush}20 100%)` 
               }}>
            {isDragActive ? (
              <Upload className="w-8 h-8" style={{ color: designTokens.colors.charcoal }} />
            ) : (
              <Camera className="w-8 h-8" style={{ color: designTokens.colors.charcoal }} />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-semibold"
               style={{ 
                 fontFamily: designTokens.typography.heading,
                 color: designTokens.colors.charcoal 
               }}>
              {isDragActive ? 'Drop image here' : 'Upload an image'}
            </p>
            <p className="text-base leading-relaxed"
               style={{ color: designTokens.colors.slate }}>
              Drag & drop or click to select
            </p>
          </div>
          
          <div className="space-y-1"
               style={{ color: designTokens.colors.ash }}>
            <p className="text-sm">Supported formats: JPEG, PNG, WebP</p>
            <p className="text-sm">Maximum size: {formatFileSize(maxSize)}</p>
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-6 p-4"
             style={{ 
               backgroundColor: `${designTokens.colors.error}15`,
               border: `1px solid ${designTokens.colors.error}`,
               borderRadius: designTokens.radius.lg
             }}>
          <p className="text-sm font-semibold mb-2"
             style={{ color: designTokens.colors.charcoal }}>
            Upload Error:
          </p>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="mt-2">
              <p className="text-sm font-medium"
                 style={{ color: designTokens.colors.charcoal }}>
                {file.name}:
              </p>
              <ul className="mt-1 ml-4 space-y-1">
                {errors.map((error) => (
                  <li key={error.code} 
                      className="text-sm"
                      style={{ color: designTokens.colors.slate }}>
                    • {error.message}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}