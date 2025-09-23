export interface User {
  id: string;
  email: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  consent_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Avatar {
  id: number;
  user_id: string;
  original_url: string;
  processed_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  width?: number;
  height?: number;
  file_size?: number;
  created_at: Date;
}

export interface Fit {
  id: number;
  user_id: string;
  name: string;
  original_url: string;
  processed_url?: string;
  source_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  width?: number;
  height?: number;
  file_size?: number;
  created_at: Date;
}

export interface TryonJob {
  id: number;
  user_id: string;
  avatar_id: number;
  fit_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  nano_banana_job_id?: string;
  error_message?: string;
  options?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ModerationFlag {
  id: number;
  user_id: string;
  content_type: 'avatar' | 'fit';
  content_id: number;
  flag_type: 'explicit' | 'celebrity' | 'mirror' | 'partial' | 'quality';
  confidence?: number;
  reviewed: boolean;
  created_at: Date;
}

export interface RateLimit {
  id: number;
  user_id: string;
  action_type: 'tryon' | 'avatar' | 'fit';
  action_date: Date;
  count: number;
  created_at: Date;
}
