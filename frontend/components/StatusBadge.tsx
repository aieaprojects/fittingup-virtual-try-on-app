import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const configs = {
    pending: {
      variant: 'secondary' as const,
      icon: Clock,
      label: 'Pending',
    },
    processing: {
      variant: 'default' as const,
      icon: Loader2,
      label: 'Processing',
    },
    completed: {
      variant: 'default' as const,
      icon: CheckCircle,
      label: 'Completed',
    },
    failed: {
      variant: 'destructive' as const,
      icon: XCircle,
      label: 'Failed',
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${className}`}>
      <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
}
