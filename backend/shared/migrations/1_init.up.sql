-- Users table (basic info, auth handled by Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Avatars table
CREATE TABLE avatars (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garments table
CREATE TABLE garments (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Try-on jobs table
CREATE TABLE tryon_jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  avatar_id BIGINT NOT NULL REFERENCES avatars(id) ON DELETE CASCADE,
  garment_id BIGINT NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  result_url TEXT,
  nano_banana_job_id TEXT,
  error_message TEXT,
  options JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation flags table
CREATE TABLE moderation_flags (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'avatar', 'garment'
  content_id BIGINT NOT NULL,
  flag_type TEXT NOT NULL, -- 'explicit', 'celebrity', 'mirror', 'partial', 'quality'
  confidence DOUBLE PRECISION,
  reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'tryon', 'avatar', 'garment'
  action_date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, action_type, action_date)
);

-- Indexes
CREATE INDEX idx_avatars_user_id ON avatars(user_id);
CREATE INDEX idx_garments_user_id ON garments(user_id);
CREATE INDEX idx_tryon_jobs_user_id ON tryon_jobs(user_id);
CREATE INDEX idx_tryon_jobs_status ON tryon_jobs(status);
CREATE INDEX idx_moderation_flags_reviewed ON moderation_flags(reviewed);
CREATE INDEX idx_rate_limits_user_action_date ON rate_limits(user_id, action_type, action_date);
