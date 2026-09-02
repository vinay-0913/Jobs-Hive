-- ============================================================
-- Migration: Add source column for dataset pipeline
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Add source column to track where each job came from
--    'dataset' = from the public dataset pipeline
--    'scraper' = from direct company scraping (sync_engine.py)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'scraper';

-- 2. Index for source-based queries and cleanup
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs (source);

-- 3. Update FK constraint: ON DELETE SET NULL instead of CASCADE
--    so bulk-imported jobs (with NULL company_id) aren't affected
--    when companies are removed
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;
ALTER TABLE jobs ADD CONSTRAINT jobs_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
