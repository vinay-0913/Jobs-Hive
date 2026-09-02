"""Seed the companies table with an initial curated list of top tech companies.

Run once after setting up the Supabase schema:
    py seed_companies.py
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# fmt: off
SEED_COMPANIES = [
    # ── Greenhouse ────────────────────────────────────────────
    {"name": "Stripe",       "slug": "stripe",       "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/stripe"},
    {"name": "Airbnb",       "slug": "airbnb",       "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/airbnb"},
    {"name": "Discord",      "slug": "discord",      "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/discord"},
    {"name": "Coinbase",     "slug": "coinbase",     "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/coinbase"},
    {"name": "Databricks",   "slug": "databricks",   "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/databricks"},
    {"name": "Cloudflare",   "slug": "cloudflare",   "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/cloudflare"},
    {"name": "DoorDash",     "slug": "doordash",     "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/doordash"},
    {"name": "Instacart",    "slug": "instacart",    "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/instacart"},
    {"name": "Figma",        "slug": "figma",        "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/figma"},
    {"name": "Plaid",        "slug": "plaid",        "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/plaid"},
    {"name": "Reddit",       "slug": "reddit",       "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/reddit"},
    {"name": "Robinhood",    "slug": "robinhood",    "ats": "greenhouse", "careers_url": "https://job-boards.greenhouse.io/robinhood"},

    # ── Ashby ─────────────────────────────────────────────────
    {"name": "OpenAI",       "slug": "openai",       "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/openai"},
    {"name": "Ramp",         "slug": "ramp",         "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/ramp"},
    {"name": "Anthropic",    "slug": "anthropic",    "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/anthropic"},
    {"name": "Vercel",       "slug": "vercel",       "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/vercel"},
    {"name": "Linear",       "slug": "linear",       "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/linear"},
    {"name": "Retool",       "slug": "retool",       "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/retool"},
    {"name": "Notion",       "slug": "notion",       "ats": "ashby",      "careers_url": "https://jobs.ashbyhq.com/notion"},

    # ── Lever ─────────────────────────────────────────────────
    {"name": "Netflix",      "slug": "netflix",      "ats": "lever",      "careers_url": "https://jobs.lever.co/netflix"},
    {"name": "Rippling",     "slug": "rippling",     "ats": "lever",      "careers_url": "https://jobs.lever.co/rippling"},
    {"name": "Spotify",      "slug": "spotify",      "ats": "lever",      "careers_url": "https://jobs.lever.co/spotify"},

    # ── SmartRecruiters ───────────────────────────────────────
    {"name": "Visa",         "slug": "Visa",         "ats": "smartrecruiters", "careers_url": "https://careers.smartrecruiters.com/Visa"},
    {"name": "Bosch",        "slug": "BoschGroup",   "ats": "smartrecruiters", "careers_url": "https://careers.smartrecruiters.com/BoschGroup"},

    # ── Custom big-tech scrapers ──────────────────────────────
    {"name": "Google",       "slug": "google",       "ats": "google",     "careers_url": "https://www.google.com/about/careers/"},
    {"name": "Apple",        "slug": "apple",        "ats": "apple",      "careers_url": "https://jobs.apple.com/"},
    {"name": "Amazon",       "slug": "amazon",       "ats": "amazon",     "careers_url": "https://www.amazon.jobs/"},
    {"name": "Meta",         "slug": "meta",         "ats": "meta",       "careers_url": "https://www.metacareers.com/"},
    {"name": "Tesla",        "slug": "tesla",        "ats": "tesla",      "careers_url": "https://www.tesla.com/careers"},
    {"name": "Uber",         "slug": "uber",         "ats": "uber",       "careers_url": "https://www.uber.com/us/en/careers/"},
]
# fmt: on


def seed():
    print(f"Seeding {len(SEED_COMPANIES)} companies into Supabase...")

    for company in SEED_COMPANIES:
        company["is_active"] = True

    result = (
        supabase.table("companies")
        .upsert(SEED_COMPANIES, on_conflict="ats,slug")
        .execute()
    )

    print(f"[OK] Seeded {len(result.data)} companies successfully!")
    for c in result.data:
        print(f"  - {c['name']:20s}  ({c['ats']:18s})  {c.get('careers_url', '')}")


if __name__ == "__main__":
    seed()
