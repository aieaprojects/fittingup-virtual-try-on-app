-- Add credit tracking columns to users table
ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE users ADD COLUMN credits_total INTEGER NOT NULL DEFAULT 5;
ALTER TABLE users ADD COLUMN credits_used_this_period INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN period_start TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE users ADD COLUMN period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month';

-- Add credit_charged flag to tryon_jobs to prevent double-charging
ALTER TABLE tryon_jobs ADD COLUMN credit_charged BOOLEAN DEFAULT FALSE;

-- Index for efficient credit queries
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_users_period ON users(period_start, period_end);
CREATE INDEX idx_tryon_jobs_credit_charged ON tryon_jobs(credit_charged);