-- Migration: Add HR Name and HR Mobile fields to recruiter_profiles table
-- Date: 2025-12-23
-- Description: Adding hr_name and hr_mobile columns to support HR contact information

USE job_spark_db;

-- Add hr_name column (VARCHAR, nullable)
ALTER TABLE recruiter_profiles
ADD COLUMN hr_name VARCHAR(255) NULL AFTER company_type;

-- Add hr_mobile column (VARCHAR for phone numbers, nullable)
ALTER TABLE recruiter_profiles
ADD COLUMN hr_mobile VARCHAR(15) NULL AFTER hr_name;

-- Verify the changes
DESCRIBE recruiter_profiles;
