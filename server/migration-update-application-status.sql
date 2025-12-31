-- Migration: Update job_applications status ENUM
-- Date: 2025-12-25
-- Description: Change status column to only allow 'applied', 'shortlisted', 'rejected'

USE job_spark_db;

-- Update the status column ENUM
ALTER TABLE job_applications
MODIFY COLUMN status ENUM('applied','shortlisted','rejected')
NOT NULL DEFAULT 'applied';

-- Verify the changes
DESCRIBE job_applications;
