-- Add consent tracking to users table
ALTER TABLE users ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN privacy_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN consent_date TIMESTAMPTZ;