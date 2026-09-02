-- ============================================================
-- Job Search Aggregator — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 1. COMPANIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL,
    ats         TEXT NOT NULL,
    careers_url TEXT,
    logo_url    TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Each ATS+slug combo is unique (e.g. greenhouse + stripe)
    UNIQUE (ats, slug)
);

-- ============================================================
-- 2. JOBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    global_id       TEXT NOT NULL UNIQUE,
    company_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    company_name    TEXT NOT NULL,
    ats_type        TEXT NOT NULL,
    url             TEXT NOT NULL,
    apply_url       TEXT,
    location        TEXT,
    country_iso     TEXT,
    is_remote       BOOLEAN,
    salary_min      NUMERIC,
    salary_max      NUMERIC,
    salary_currency TEXT,
    salary_period   TEXT,
    salary_summary  TEXT,
    department      TEXT,
    team            TEXT,
    employment_type TEXT,
    experience      INTEGER,
    description     TEXT,
    posted_at       TIMESTAMPTZ,
    fetched_at      TIMESTAMPTZ,
    first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Full-text search vector (auto-populated by trigger)
    fts             TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(company_name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(location, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(department, '')), 'D')
    ) STORED
);

-- ============================================================
-- 3. INDEXES FOR FAST QUERIES
-- ============================================================

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_jobs_fts ON jobs USING GIN (fts);

-- Trigram indexes for fuzzy / autocomplete search
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON jobs USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_company_trgm ON jobs USING GIN (company_name gin_trgm_ops);

-- Filter indexes
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_jobs_is_remote ON jobs (is_remote) WHERE is_remote = true;
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs (employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_min ON jobs (salary_min) WHERE salary_min IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs (company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_country_iso ON jobs (country_iso);

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_ats ON companies (ats);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies (is_active) WHERE is_active = true;

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public read access for jobs (anyone can search without auth)
CREATE POLICY "Jobs are publicly readable"
    ON jobs FOR SELECT
    USING (true);

-- Public read access for companies
CREATE POLICY "Companies are publicly readable"
    ON companies FOR SELECT
    USING (true);

-- Service role can do everything (used by the Python sync engine)
-- (Service role key bypasses RLS automatically in Supabase)

-- ============================================================
-- 5. DATABASE FUNCTION: Search jobs with full-text search
-- ============================================================
CREATE OR REPLACE FUNCTION search_jobs(
    search_query TEXT DEFAULT NULL,
    filter_remote BOOLEAN DEFAULT NULL,
    filter_employment_type TEXT DEFAULT NULL,
    filter_salary_min NUMERIC DEFAULT NULL,
    filter_company TEXT DEFAULT NULL,
    filter_country TEXT DEFAULT NULL,
    sort_by TEXT DEFAULT 'posted_at',
    sort_order TEXT DEFAULT 'desc',
    page_size INTEGER DEFAULT 20,
    page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    global_id TEXT,
    title TEXT,
    company_name TEXT,
    ats_type TEXT,
    url TEXT,
    apply_url TEXT,
    location TEXT,
    country_iso TEXT,
    is_remote BOOLEAN,
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT,
    salary_period TEXT,
    salary_summary TEXT,
    department TEXT,
    employment_type TEXT,
    posted_at TIMESTAMPTZ,
    first_seen_at TIMESTAMPTZ,
    is_active BOOLEAN,
    rank REAL,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered AS (
        SELECT
            j.id,
            j.global_id,
            j.title,
            j.company_name,
            j.ats_type,
            j.url,
            j.apply_url,
            j.location,
            j.country_iso,
            j.is_remote,
            j.salary_min,
            j.salary_max,
            j.salary_currency,
            j.salary_period,
            j.salary_summary,
            j.department,
            j.employment_type,
            j.posted_at,
            j.first_seen_at,
            j.is_active,
            CASE
                WHEN search_query IS NOT NULL AND search_query != ''
                THEN ts_rank(j.fts, websearch_to_tsquery('english', search_query))
                ELSE 0
            END AS rank
        FROM jobs j
        WHERE j.is_active = true
            AND (search_query IS NULL OR search_query = '' OR j.fts @@ websearch_to_tsquery('english', search_query))
            AND (filter_remote IS NULL OR j.is_remote = filter_remote)
            AND (filter_employment_type IS NULL OR j.employment_type = filter_employment_type)
            AND (filter_salary_min IS NULL OR j.salary_min >= filter_salary_min)
            AND (filter_company IS NULL OR j.company_name ILIKE '%' || filter_company || '%')
            AND (filter_country IS NULL OR j.country_iso = filter_country)
    )
    SELECT
        f.*,
        count(*) OVER () AS total_count
    FROM filtered f
    ORDER BY
        CASE WHEN sort_by = 'rank' AND sort_order = 'desc' THEN f.rank END DESC NULLS LAST,
        CASE WHEN sort_by = 'posted_at' AND sort_order = 'desc' THEN f.posted_at END DESC NULLS LAST,
        CASE WHEN sort_by = 'posted_at' AND sort_order = 'asc' THEN f.posted_at END ASC NULLS LAST,
        CASE WHEN sort_by = 'salary' AND sort_order = 'desc' THEN f.salary_max END DESC NULLS LAST,
        CASE WHEN sort_by = 'salary' AND sort_order = 'asc' THEN f.salary_min END ASC NULLS LAST,
        f.posted_at DESC NULLS LAST
    LIMIT page_size
    OFFSET page_offset;
END;
$$ LANGUAGE plpgsql STABLE;
