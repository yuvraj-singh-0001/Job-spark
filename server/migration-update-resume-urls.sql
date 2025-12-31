-- Migration: Update resume URLs to full URLs
-- Date: 2025-12-30
-- Description: Convert relative resume paths to full URLs for proper frontend access

USE job_spark_db;

-- Update candidate_profiles resume paths that start with /uploads/
UPDATE candidate_profiles
SET resume_path = CONCAT('http://localhost:5000', resume_path)
WHERE resume_path LIKE '/uploads/%';

-- Update job_applications resume paths that start with /uploads/
UPDATE job_applications
SET resume_path = CONCAT('http://localhost:5000', resume_path)
WHERE resume_path LIKE '/uploads/%';

-- Verify the changes
SELECT 'candidate_profiles updated:' as info, COUNT(*) as count
FROM candidate_profiles
WHERE resume_path LIKE 'http://localhost:5000/%'

UNION ALL

SELECT 'job_applications updated:' as info, COUNT(*) as count
FROM job_applications
WHERE resume_path LIKE 'http://localhost:5000/%';
