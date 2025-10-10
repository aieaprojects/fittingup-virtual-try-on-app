import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { designTokens } from '../styles/design-tokens';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteAccountModal({ 
  open, 
  onOpenChange, 
  onConfirm,
  isDeleting 
}: DeleteAccountModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent 
        className="max-w-md"
        style={{
          background: designTokens.colors.pure,
          border: `2px solid ${designTokens.colors.error}40`,
          borderRadius: designTokens.radius['2xl'],
          boxShadow: designTokens.shadows.xl
        }}
      >
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: `${designTokens.colors.error}15`,
              }}
            >
              <AlertTriangle 
                className="w-8 h-8" 
                style={{ color: designTokens.colors.error }}
              />
            </div>
          </div>
          <AlertDialogTitle 
            className="text-center text-xl font-bold"
            style={{
              fontFamily: designTokens.typography.heading,
              color: designTokens.colors.charcoal
            }}
          >
            Delete Account?
          </AlertDialogTitle>
          <AlertDialogDescription 
            className="text-center text-base leading-relaxed pt-2"
            style={{
              color: designTokens.colors.slate,
              fontFamily: designTokens.typography.body
            }}
          >
            This permanently deletes your Fitvue account and associated data. This action can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col gap-3 mt-6">
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-3 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: designTokens.colors.error,
              color: designTokens.colors.pure,
              borderRadius: designTokens.radius.lg,
              boxShadow: designTokens.shadows.md
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete My Account'}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            variant="outline"
            className="w-full py-3 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: `2px solid ${designTokens.colors.stone}`,
              borderRadius: designTokens.radius.lg,
              color: designTokens.colors.charcoal,
              backgroundColor: designTokens.colors.pure
            }}
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
