-- Rename garments table to fits and update related references
ALTER TABLE garments RENAME TO fits;

-- Update tryon_jobs table to use fit_id instead of garment_id
ALTER TABLE tryon_jobs RENAME COLUMN garment_id TO fit_id;

-- Update the foreign key constraint
ALTER TABLE tryon_jobs DROP CONSTRAINT tryon_jobs_garment_id_fkey;
ALTER TABLE tryon_jobs ADD CONSTRAINT tryon_jobs_fit_id_fkey FOREIGN KEY (fit_id) REFERENCES fits(id) ON DELETE CASCADE;

-- Update indexes
DROP INDEX idx_garments_user_id;
CREATE INDEX idx_fits_user_id ON fits(user_id);

-- Update moderation_flags content_type values
UPDATE moderation_flags SET content_type = 'fit' WHERE content_type = 'garment';

-- Update rate_limits action_type values  
UPDATE rate_limits SET action_type = 'fit' WHERE action_type = 'garment';