"""Sync engine — scrapes jobs from tracked companies and upserts into Supabase.

Usage:
    py sync_engine.py              # Sync all active companies
    py sync_engine.py openai       # Sync a single company by name
    py sync_engine.py --dry-run    # Preview without writing to DB
"""

import os
import sys
import json
import time
import logging
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("sync")


def get_scraper(ats: str, slug: str):
    """Get the appropriate ats-scrapers scraper for the given ATS and slug."""
    from ats_scrapers.scrapers import get_scraper as _get_scraper
    return _get_scraper(ats, slug)


def job_to_dict(job, company_id: str, company_name: str) -> dict:
    """Convert an ats_scrapers Job object to a dict for Supabase upsert."""
    now = datetime.now(timezone.utc).isoformat()

    return {
        "global_id": job.global_id or f"{job.ats_type}:{job.ats_id or id(job)}",
        "company_id": company_id,
        "title": job.title,
        "company_name": company_name,
        "ats_type": str(job.ats_type),
        "url": str(job.url),
        "apply_url": str(job.apply_url) if job.apply_url else None,
        "location": job.location,
        "country_iso": job.country_iso,
        "is_remote": job.is_remote,
        "salary_min": float(job.salary_min) if job.salary_min is not None else None,
        "salary_max": float(job.salary_max) if job.salary_max is not None else None,
        "salary_currency": job.salary_currency,
        "salary_period": job.salary_period,
        "salary_summary": job.salary_summary,
        "department": job.department,
        "team": job.team,
        "employment_type": job.employment_type,
        "experience": job.experience,
        "description": (job.description[:25000] if job.description else None),
        "posted_at": job.posted_at.isoformat() if job.posted_at else None,
        "fetched_at": now,
        "is_active": True,
    }


def sync_company(company: dict, dry_run: bool = False) -> int:
    """Scrape a single company and upsert its jobs into Supabase.

    Returns the number of jobs upserted.
    """
    name = company["name"]
    ats = company["ats"]
    slug = company["slug"]
    company_id = company["id"]

    log.info(f"Syncing {name} ({ats}/{slug})...")

    try:
        scraper = get_scraper(ats, slug)
        jobs = scraper.fetch()
    except Exception as e:
        log.error(f"  [FAIL] Failed to scrape {name}: {e}")
        return 0

    if not jobs:
        log.warning(f"  [WARN] No jobs returned for {name}")
        return 0

    log.info(f"  >> Fetched {len(jobs)} jobs from {name}")

    if dry_run:
        for job in jobs[:3]:
            log.info(f"    - {job.title:50s}  {job.location or '-'}")
        return len(jobs)

    # Convert to dicts for upsert
    rows = []
    for job in jobs:
        try:
            rows.append(job_to_dict(job, company_id, name))
        except Exception as e:
            log.warning(f"  [WARN] Skipping job '{job.title}': {e}")

    if not rows:
        return 0

    # Batch upsert in chunks of 500 (Supabase limit)
    chunk_size = 500
    upserted = 0
    for i in range(0, len(rows), chunk_size):
        chunk = rows[i : i + chunk_size]
        try:
            result = (
                supabase.table("jobs")
                .upsert(chunk, on_conflict="global_id")
                .execute()
            )
            upserted += len(result.data)
        except Exception as e:
            log.error(f"  [FAIL] Upsert failed for chunk {i}-{i+len(chunk)}: {e}")

    # Mark jobs not in latest scrape as inactive
    scraped_global_ids = [r["global_id"] for r in rows]
    try:
        # Get all active jobs for this company currently in DB
        existing = (
            supabase.table("jobs")
            .select("global_id")
            .eq("company_id", company_id)
            .eq("is_active", True)
            .execute()
        )
        existing_ids = {j["global_id"] for j in existing.data}
        stale_ids = existing_ids - set(scraped_global_ids)

        if stale_ids:
            # Mark stale jobs as inactive in batches
            stale_list = list(stale_ids)
            for i in range(0, len(stale_list), 100):
                batch = stale_list[i : i + 100]
                supabase.table("jobs").update({"is_active": False}).in_(
                    "global_id", batch
                ).execute()
            log.info(f"  >> Marked {len(stale_ids)} stale jobs as inactive")
    except Exception as e:
        log.warning(f"  [WARN] Could not mark stale jobs: {e}")

    # Update last_synced_at
    try:
        supabase.table("companies").update(
            {"last_synced_at": datetime.now(timezone.utc).isoformat()}
        ).eq("id", company_id).execute()
    except Exception as e:
        log.warning(f"  [WARN] Could not update last_synced_at: {e}")

    log.info(f"  [OK] Upserted {upserted} jobs for {name}")
    return upserted


def sync_all(dry_run: bool = False, company_filter: str = None):
    """Sync all active companies (or a single one by name)."""
    log.info("=" * 60)
    log.info("Job Search Aggregator — Sync Engine")
    log.info("=" * 60)

    # Fetch company list from Supabase
    query = supabase.table("companies").select("*").eq("is_active", True)
    if company_filter:
        query = query.ilike("name", f"%{company_filter}%")

    result = query.execute()
    companies = result.data

    if not companies:
        log.warning("No active companies found to sync.")
        return

    log.info(f"Syncing {len(companies)} companies...")
    if dry_run:
        log.info("  (DRY RUN — no data will be written)")

    total_jobs = 0
    success_count = 0
    fail_count = 0
    start_time = time.time()

    for company in companies:
        try:
            count = sync_company(company, dry_run=dry_run)
            total_jobs += count
            if count > 0:
                success_count += 1
            else:
                fail_count += 1
        except Exception as e:
            log.error(f"  [FAIL] Unexpected error syncing {company['name']}: {e}")
            fail_count += 1

        # Small delay between companies to be respectful
        time.sleep(1)

    elapsed = time.time() - start_time
    log.info("=" * 60)
    log.info(f"Sync complete in {elapsed:.1f}s")
    log.info(f"  Companies: {success_count} succeeded, {fail_count} failed")
    log.info(f"  Total jobs upserted: {total_jobs}")
    log.info("=" * 60)


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    company_filter = None

    for arg in sys.argv[1:]:
        if not arg.startswith("--"):
            company_filter = arg
            break

    sync_all(dry_run=dry_run, company_filter=company_filter)
