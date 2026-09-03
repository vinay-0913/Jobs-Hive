"""Tech Jobs Ingestion Pipeline — Ingest tech jobs from the ats-scrapers
public dataset into Supabase.

Downloads Parquet snapshots from 20+ ATS platforms, filters for:
  - Tech roles only (by title keyword matching)
  - India + Remote jobs only
  - Recent jobs (last 60 days)

Then upserts into Supabase with deduplication via global_id.

Usage:
    python ingest_tech_jobs.py                   # Full pipeline
    python ingest_tech_jobs.py --dry-run          # Preview without DB writes
    python ingest_tech_jobs.py --ats greenhouse   # Single ATS slice
"""

import os
import sys
import re
import time
import logging
from io import BytesIO
from datetime import datetime, timezone, timedelta

import httpx
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# ── Configuration ────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

MANIFEST_URL = "https://storage.stapply.ai/jobhive/v1/manifest.json"

# Maximum age of jobs to import (days)
MAX_JOB_AGE_DAYS = 30

# Maximum description length (chars) — truncate to save storage
MAX_DESCRIPTION_LENGTH = 2000

# Batch size for Supabase upserts
UPSERT_BATCH_SIZE = 500

# ── ATS Platforms to Process (ordered by priority) ───────────

ATS_SLICES = [
    # 🟢 Core tech ATS platforms
    "greenhouse",
    "ashby",
    "lever",
    # 🟢 Pure tech / startup platforms
    "ycombinator",
    "wellfound",
    "weworkremotely",
    "remoteok",
    "builtin",
    # 🟡 Big tech custom scrapers
    "google",
    "apple",
    "amazon",
    "bytedance",
    "tiktok",
    "uber",
    "tesla",
    # 🟡 Indian ATS platforms
    "keka",
    "darwinbox",
    # 🟡 Startup-friendly ATS
    "bamboohr",
    "workable",
    "teamtailor",
    "recruitee",
    "rippling",
    # 🟡 Large enterprise & GCC platforms (filtered by tech + India/Remote)
    "smartrecruiters",
    "icims",
    "workday",
    "oracle",
    "successfactors",
    "phenom",
    "eightfold",
    "breezy",
    "cornerstone",
    "jobvite",
    "dayforce",
]

# ── Tech Role Detection ─────────────────────────────────────

TECH_TITLE_PATTERN = re.compile(
    r"|".join([
        # Core engineering
        r"software", r"engineer", r"developer", r"programmer",
        # Frontend / Backend / Fullstack
        r"frontend", r"front[\s\-]?end",
        r"backend", r"back[\s\-]?end",
        r"fullstack", r"full[\s\-]?stack",
        # Infrastructure & Ops
        r"devops", r"dev[\s\-]?ops", r"sre", r"site\s*reliability",
        r"cloud\s*engineer", r"infrastructure", r"platform\s*engineer",
        # Mobile
        r"mobile\s*(?:dev|engineer)", r"ios\s*(?:dev|engineer)",
        r"android\s*(?:dev|engineer)",
        # Data & AI
        r"data\s*(?:scientist|engineer|analyst)",
        r"machine\s*learning", r"ml\s*engineer", r"ai\s*engineer",
        r"deep\s*learning", r"\bnlp\b", r"computer\s*vision",
        # Security
        r"security\s*engineer", r"cybersecurity", r"infosec", r"devsecops",
        # QA & Testing
        r"qa\s*engineer", r"quality\s*assurance", r"test\s*engineer",
        r"\bsdet\b", r"automation\s*engineer",
        # Architecture & Leadership
        r"architect", r"tech(?:nical)?\s*lead", r"engineering\s*manager",
        r"head\s*of\s*engineer", r"principal\s*engineer",
        r"staff\s*engineer", r"distinguished\s*engineer",
        # Systems & Networking
        r"systems?\s*engineer", r"network\s*engineer",
        # Database
        r"database\s*(?:engineer|admin)", r"\bdba\b",
        # Product & Design (tech-adjacent)
        r"product\s*(?:designer|manager)", r"ux\s*(?:designer|engineer)",
        r"ui\s*designer",
        # Languages in titles (e.g. "Python Developer", "Java Engineer")
        r"python\s*(?:dev|engineer)", r"java\s*(?:dev|engineer)",
        r"golang\s*(?:dev|engineer)", r"rust\s*(?:dev|engineer)",
        r"react\s*(?:dev|engineer)", r"node\.?js\s*(?:dev|engineer)",
        r"typescript\s*(?:dev|engineer)",
    ]),
    re.IGNORECASE,
)

# ── India Location Detection ────────────────────────────────

INDIA_LOCATION_PATTERN = re.compile(
    r"|".join([
        r"\bindia\b",
        # Major tech hubs
        r"bengaluru", r"bangalore", r"hyderabad", r"mumbai", r"pune",
        r"chennai", r"delhi", r"gurgaon", r"gurugram", r"noida",
        # Other cities
        r"kolkata", r"ahmedabad", r"jaipur", r"kochi",
        r"thiruvananthapuram", r"coimbatore", r"indore", r"lucknow",
        r"chandigarh", r"mysore", r"mysuru", r"nagpur",
        r"visakhapatnam", r"bhubaneswar", r"mangalore", r"mangaluru",
        # State abbreviations commonly seen
        r"\bKA\b", r"\bTN\b", r"\bMH\b", r"\bKL\b", r"\bTS\b",
        r"\bDL\b", r"\bHR\b", r"\bUP\b",
    ]),
    re.IGNORECASE,
)

# ── Logging ──────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ingest")


# ── Filter Functions ─────────────────────────────────────────

def filter_tech_titles(df: pd.DataFrame) -> pd.DataFrame:
    """Keep only jobs with tech-related titles."""
    mask = df["title"].fillna("").str.contains(TECH_TITLE_PATTERN, na=False)
    return df[mask]


def filter_india_remote(df: pd.DataFrame) -> pd.DataFrame:
    """Keep only jobs located in India or marked/described as remote."""
    location = df["location"].fillna("")

    # India: match location text or country_iso == "IN"
    india_match = location.str.contains(INDIA_LOCATION_PATTERN, na=False)
    country_india = df["country_iso"].fillna("").str.strip().str.upper() == "IN"

    # Remote: structured flag or "remote" in location text
    is_remote_flag = df["is_remote"].fillna(False)
    # Ensure boolean comparison works even if column is object type
    try:
        is_remote_flag = is_remote_flag.astype(bool)
    except (ValueError, TypeError):
        is_remote_flag = is_remote_flag.map(
            {True: True, "true": True, "True": True}
        ).fillna(False)

    remote_in_location = location.str.contains(r"\bremote\b", case=False, na=False)

    return df[india_match | country_india | is_remote_flag | remote_in_location]


def filter_recent(df: pd.DataFrame, days: int = MAX_JOB_AGE_DAYS) -> pd.DataFrame:
    """Keep only jobs posted within the last N days (or with no date)."""
    if "posted_at" not in df.columns:
        return df

    posted = pd.to_datetime(df["posted_at"], errors="coerce", utc=True)
    cutoff = pd.Timestamp.now(tz="UTC") - pd.Timedelta(days=days)

    # Keep: recent jobs OR jobs with no posted_at date
    return df[(posted >= cutoff) | posted.isna()]


def extract_experience(title: str, description: str = "", raw_val=None) -> int:
    """Extract required years of experience from raw value, title, and description.
    
    Returns:
        0 for Intern / Fresher / Trainee / 0 Yrs
        1-2 for Junior / Associate / Entry
        3-4 for Mid-Level / Level 2 / Level 3
        5+ for Senior / Lead / Staff / Architect / Management
    """
    if raw_val is not None and not pd.isna(raw_val):
        try:
            val = int(float(raw_val))
            if 0 <= val <= 25:
                return val
        except (ValueError, TypeError):
            pass

    t = (title or "").lower()

    # 1. Zero experience / Fresher / Intern / Trainee / 0-2, 0-3, 0-4, 0-5 year ranges
    if any(k in t for k in ["intern", "internship", "praktik", "trainee", "fresher", "co-op", "apprentice", "student", "0-2", "0-3", "0-4", "0-5", "0 to 2", "0 to 3", "0 to 5"]):
        return 0
    if re.search(r'\b0\s*(?:to|-)\s*[1-5]\s*(?:years?|yrs?)\b', t):
        return 0

    # 2. Executive / Senior Leadership
    if any(k in t for k in ["director", "vp ", "vice president", "head of", "principal", "fellow", "distinguished"]):
        return 8

    # 3. Staff / Lead / Architect / Manager
    if any(k in t for k in ["staff", "lead", "architect", "engineering manager", "tech lead"]):
        return 6

    # 4. Senior Level
    if any(k in t for k in ["senior", "sr.", "sr "]):
        return 5

    # 5. Mid Level
    if any(k in t for k in [" iii", " 3", "level 3"]):
        return 4
    if any(k in t for k in [" ii", " 2", "level 2", "mid-level", "mid level"]):
        return 3

    # 6. Junior / Entry / Graduate
    if any(k in t for k in ["junior", "jr.", "entry level", "graduate", "associate"]):
        return 1

    # 7. Regex check on description text
    d = (description or "")[:3000].lower()
    patterns = [
        # Fresher / 0 years: any range starting with 0 (e.g. 0-2, 0-3, 0-4, 0-5 years), freshers, or no experience
        (r'(?:no experience|freshers?|0\s*(?:to|-)\s*[1-5]\s*(?:years?|yrs?)|0\+?\s*(?:years?|yrs?))', 0),
        # Explicit ranges: "3-5 years", "2 to 4 years"
        (r'(\d{1,2})\+?\s*(?:to|-)\s*\d{1,2}\s*(?:years?|yrs?)(?:\s+of)?\s*(?:relevant|work|industry)?\s*experience', None),
        # Minimum / At least: "at least 3 years"
        (r'(?:minimum|at least|over)\s+(\d{1,2})\+?\s*(?:years?|yrs?)', None),
        # "5+ years of experience"
        (r'(\d{1,2})\+\s*(?:years?|yrs?)(?:\s+of)?\s*(?:relevant|work|industry)?\s*experience', None),
        (r'(\d{1,2})\s*(?:years?|yrs?)(?:\s+of)?\s*(?:relevant|work|industry)?\s*experience', None),
    ]

    for pattern, fixed_val in patterns:
        m = re.search(pattern, d)
        if m:
            if fixed_val is not None:
                return fixed_val
            try:
                yrs = int(m.group(1))
                if 0 <= yrs <= 20:
                    return yrs
            except (ValueError, TypeError, IndexError):
                pass

    return 2  # Standard developer baseline


# ── Transform ────────────────────────────────────────────────

def transform_to_supabase_rows(df: pd.DataFrame) -> list[dict]:
    """Convert a filtered DataFrame to a list of dicts for Supabase upsert."""
    rows = []
    now = datetime.now(timezone.utc).isoformat()

    for _, row in df.iterrows():
        ats_type = str(row.get("ats_type", "")).strip()
        ats_id = str(row.get("ats_id", "")).strip()

        # Must have identifiable fields
        if not ats_type or not ats_id or ats_id in ("", "nan", "None"):
            continue

        global_id = f"{ats_type}:{ats_id}"
        title = str(row.get("title", "")).strip()
        url = str(row.get("url", "")).strip()

        if not title or not url or url in ("", "nan"):
            continue

        # Truncate description to save storage
        description = row.get("description")
        if pd.notna(description) and description:
            description = str(description)[:MAX_DESCRIPTION_LENGTH]
        else:
            description = None

        # Safe string getter
        def safe_str(val, max_len=None):
            if pd.isna(val) or val is None:
                return None
            s = str(val).strip()
            if not s or s == "nan":
                return None
            if max_len:
                s = s[:max_len]
            return s

        # Safe numeric getter
        def safe_num(val):
            if pd.isna(val) or val is None:
                return None
            try:
                return float(val)
            except (ValueError, TypeError):
                return None

        # Safe bool getter
        def safe_bool(val):
            if pd.isna(val) or val is None:
                return None
            if isinstance(val, bool):
                return val
            s = str(val).strip().lower()
            if s in ("true", "1", "yes"):
                return True
            if s in ("false", "0", "no"):
                return False
            return None

        job = {
            "global_id": global_id,
            "title": title,
            "company_name": safe_str(row.get("company")) or "Unknown",
            "ats_type": ats_type,
            "url": url,
            "apply_url": safe_str(row.get("apply_url")),
            "location": safe_str(row.get("location")),
            "country_iso": safe_str(row.get("country_iso"), max_len=2),
            "is_remote": safe_bool(row.get("is_remote")),
            "salary_min": safe_num(row.get("salary_min")),
            "salary_max": safe_num(row.get("salary_max")),
            "salary_currency": safe_str(row.get("salary_currency")),
            "salary_period": safe_str(row.get("salary_period")),
            "salary_summary": safe_str(row.get("salary_summary")),
            "department": safe_str(row.get("department")),
            "team": safe_str(row.get("team")),
            "employment_type": safe_str(row.get("employment_type")),
            "experience": extract_experience(title, description, row.get("experience")),
            "description": description,
            "posted_at": safe_str(row.get("posted_at")),
            "fetched_at": now,
            "is_active": True,
            "source": "dataset",
        }
        rows.append(job)

    return rows


# ── Database Operations ──────────────────────────────────────

def upsert_jobs(rows: list[dict], sb_client, dry_run: bool = False) -> int:
    """Batch upsert jobs into Supabase."""
    if dry_run or not rows:
        return len(rows)

    upserted = 0
    for i in range(0, len(rows), UPSERT_BATCH_SIZE):
        chunk = rows[i : i + UPSERT_BATCH_SIZE]
        try:
            result = (
                sb_client.table("jobs")
                .upsert(chunk, on_conflict="global_id")
                .execute()
            )
            upserted += len(result.data)
        except Exception as e:
            log.error(f"    Upsert failed for chunk {i}–{i+len(chunk)}: {e}")

    return upserted


def delete_old_jobs(sb_client, max_age_days: int = MAX_JOB_AGE_DAYS):
    """Automatically delete jobs older than max_age_days (30 days) from Supabase.
    
    Uses small batches by ID to prevent PostgREST statement timeouts.
    """
    cutoff_posted = (datetime.now(timezone.utc) - timedelta(days=max_age_days)).isoformat()
    cutoff_unseen = (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()

    total_deleted = 0

    try:
        # 1. Fetch IDs of jobs older than 30 days and delete them in chunks
        while True:
            res = (
                sb_client.table("jobs")
                .select("id")
                .lt("posted_at", cutoff_posted)
                .limit(500)
                .execute()
            )
            ids = [row["id"] for row in res.data] if res.data else []
            if not ids:
                break

            sb_client.table("jobs").delete().in_("id", ids).execute()
            total_deleted += len(ids)

        if total_deleted > 0:
            log.info(f"🗑️ Deleted {total_deleted:,} jobs older than {max_age_days} days (by posted_at)")

        # 2. Fetch and delete stale dataset jobs not refreshed/seen in 14 days
        stale_deleted = 0
        while True:
            res_stale = (
                sb_client.table("jobs")
                .select("id")
                .eq("source", "dataset")
                .lt("fetched_at", cutoff_unseen)
                .limit(500)
                .execute()
            )
            stale_ids = [row["id"] for row in res_stale.data] if res_stale.data else []
            if not stale_ids:
                break

            sb_client.table("jobs").delete().in_("id", stale_ids).execute()
            stale_deleted += len(stale_ids)

        if stale_deleted > 0:
            log.info(f"🗑️ Deleted {stale_deleted:,} stale/removed jobs not refreshed in 14 days")

    except Exception as e:
        log.warning(f"Could not complete automatic job deletion: {e}")


# ── Pipeline ─────────────────────────────────────────────────

def fetch_manifest(http_client: httpx.Client) -> dict:
    """Fetch the public dataset manifest."""
    response = http_client.get(MANIFEST_URL)
    response.raise_for_status()
    return response.json()


def get_parquet_url(manifest: dict, ats: str) -> str | None:
    """Get the Parquet download URL for an ATS slice."""
    entry = manifest.get("by_ats", {}).get(ats)
    if not entry:
        return None
    # Prefer parquet (smaller), fall back to CSV
    return entry.get("parquet") or entry.get("csv")


def process_ats_slice(
    ats: str,
    manifest: dict,
    http_client: httpx.Client,
    sb_client,
    dry_run: bool = False,
) -> int:
    """Download, filter, and upsert jobs from one ATS slice."""
    url = get_parquet_url(manifest, ats)
    if not url:
        log.warning(f"  [{ats}] Not found in manifest, skipping")
        return 0

    # Download
    log.info(f"  [{ats}] Downloading...")
    try:
        response = http_client.get(url)
        response.raise_for_status()
    except Exception as e:
        log.error(f"  [{ats}] Download failed: {e}")
        return 0

    size_mb = len(response.content) / (1024 * 1024)
    log.info(f"  [{ats}] Downloaded {size_mb:.1f} MB")

    # Only load columns we actually need (saves memory for large files like Workday)
    NEEDED_COLUMNS = [
        "url", "title", "company", "ats_type", "ats_id", "location",
        "country_iso", "is_remote", "salary_min", "salary_max",
        "salary_currency", "salary_period", "salary_summary",
        "employment_type", "department", "team", "description",
        "posted_at", "apply_url", "experience",
    ]

    # Parse
    try:
        data = BytesIO(response.content)
        if url.endswith(".parquet"):
            import pyarrow.parquet as pq
            schema = pq.read_schema(data)
            available = schema.names
            data.seek(0)
            use_cols = [c for c in NEEDED_COLUMNS if c in available]

            # For large files (>100MB), read row groups one at a time
            # to avoid memory overflow (e.g. Workday at 426MB)
            if size_mb > 100:
                log.info(f"  [{ats}] Large file — reading in chunks")
                pf = pq.ParquetFile(data)
                filtered_chunks = []
                total = 0
                for i in range(pf.metadata.num_row_groups):
                    chunk_df = pf.read_row_group(i, columns=use_cols).to_pandas()
                    total += len(chunk_df)
                    # Apply filters immediately to keep memory low
                    chunk_df = filter_tech_titles(chunk_df)
                    chunk_df = filter_india_remote(chunk_df)
                    chunk_df = filter_recent(chunk_df)
                    if not chunk_df.empty:
                        filtered_chunks.append(chunk_df)
                    del chunk_df

                # Free the raw response from memory
                del response, data

                log.info(f"  [{ats}] Loaded {total:,} total jobs (chunked)")
                if not filtered_chunks:
                    log.info(f"  [{ats}] No jobs after filtering")
                    return 0
                df = pd.concat(filtered_chunks, ignore_index=True)
                del filtered_chunks
                log.info(f"  [{ats}]   → after all filters: {len(df):,}")
                # Skip the normal filter steps below (already applied)
                already_filtered = True
            else:
                df = pd.read_parquet(data, columns=use_cols)
                already_filtered = False
        else:
            df = pd.read_csv(data, usecols=lambda c: c in NEEDED_COLUMNS)
            already_filtered = False
    except Exception as e:
        log.error(f"  [{ats}] Failed to parse: {e}")
        return 0

    # Free the raw response from memory
    if 'response' in dir():
        try:
            del response
        except Exception:
            pass

    if not already_filtered:
        total = len(df)
        log.info(f"  [{ats}] Loaded {total:,} total jobs")

    # Apply filters (skip if already applied during chunked reading)
    if not already_filtered:
        df = filter_tech_titles(df)
        log.info(f"  [{ats}]   → tech titles: {len(df):,}")

        df = filter_india_remote(df)
        log.info(f"  [{ats}]   → India+Remote: {len(df):,}")

        df = filter_recent(df)
        log.info(f"  [{ats}]   → recent ({MAX_JOB_AGE_DAYS}d): {len(df):,}")

    if df.empty:
        log.info(f"  [{ats}] No jobs after filtering")
        return 0

    # Deduplicate by ats_type + ats_id to avoid "cannot affect row a second time" error
    if "ats_type" in df.columns and "ats_id" in df.columns:
        before = len(df)
        df = df.drop_duplicates(subset=["ats_type", "ats_id"], keep="last")
        dupes = before - len(df)
        if dupes > 0:
            log.info(f"  [{ats}]   → removed {dupes} duplicates")

    # Transform
    rows = transform_to_supabase_rows(df)
    log.info(f"  [{ats}]   → valid rows: {len(rows):,}")

    if not rows:
        return 0

    # Upsert
    upserted = upsert_jobs(rows, sb_client, dry_run=dry_run)
    action = "Would upsert" if dry_run else "Upserted"
    log.info(f"  [{ats}] ✓ {action} {upserted:,} jobs")
    return upserted


def run_pipeline(dry_run: bool = False, ats_filter: str | None = None):
    """Run the full ingestion pipeline."""
    log.info("=" * 60)
    log.info("Tech Jobs Ingestion Pipeline")
    log.info("  Regions: India + Remote")
    log.info("  Roles:   Tech only")
    log.info("  Recency: Last %d days", MAX_JOB_AGE_DAYS)
    log.info("  Desc:    Truncated to %d chars", MAX_DESCRIPTION_LENGTH)
    if dry_run:
        log.info("  Mode:    DRY RUN (no DB writes)")
    log.info("=" * 60)

    sb_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    http_client = httpx.Client(
        timeout=180.0,
        follow_redirects=True,
        headers={"User-Agent": "JobHive/1.0 (tech-jobs-pipeline)"},
    )

    try:
        # Fetch manifest
        log.info("Fetching dataset manifest...")
        manifest = fetch_manifest(http_client)
        stats = manifest.get("stats", {})
        log.info(
            "Dataset: %s jobs, %s companies, %s ATS sources",
            f"{stats.get('total_jobs', 0):,}",
            f"{stats.get('total_companies', 0):,}",
            stats.get("ats_count", 0),
        )

        # Determine slices to process
        slices = [ats_filter] if ats_filter else ATS_SLICES

        total_upserted = 0
        success_count = 0
        fail_count = 0
        start_time = time.time()

        for ats in slices:
            try:
                count = process_ats_slice(
                    ats, manifest, http_client, sb_client, dry_run=dry_run
                )
                total_upserted += count
                if count > 0:
                    success_count += 1
            except Exception as e:
                log.error(f"  [{ats}] Unexpected error: {e}")
                fail_count += 1

            # Brief pause between downloads
            time.sleep(1)

        # Automatically delete jobs older than 30 days or not refreshed in 14 days
        if not dry_run:
            delete_old_jobs(sb_client)

        elapsed = time.time() - start_time
        log.info("=" * 60)
        log.info("Pipeline complete in %.1fs", elapsed)
        log.info("  ATS sources with results: %d", success_count)
        log.info("  ATS sources failed: %d", fail_count)
        action = "previewed" if dry_run else "upserted"
        log.info("  Total jobs %s: %s", action, f"{total_upserted:,}")
        log.info("=" * 60)

    finally:
        http_client.close()


# ── CLI ──────────────────────────────────────────────────────

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    ats_filter = None

    for i, arg in enumerate(sys.argv[1:], 1):
        if arg == "--ats" and i < len(sys.argv) - 1:
            ats_filter = sys.argv[i + 1]
            break

    run_pipeline(dry_run=dry_run, ats_filter=ats_filter)
