-- Migration: Add job expiration functionality
-- Adds expires_at column to jobs table and updates existing jobs

-- Add expires_at column to jobs table
ALTER TABLE jobs ADD COLUMN expires_at TIMESTAMP NULL AFTER posted_at;

-- Update existing jobs to expire 30 days from posted_at
UPDATE jobs SET expires_at = DATE_ADD(posted_at, INTERVAL 30 DAY) WHERE expires_at IS NULL;

-- Add index for performance on expiration queries
CREATE INDEX idx_jobs_expires_at ON jobs(expires_at);

-- Add index for status and expiration combined queries
CREATE INDEX idx_jobs_status_expires ON jobs(status, expires_at);
