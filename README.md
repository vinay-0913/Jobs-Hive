# Easy Jobs 💼🚀

An automated tech job discovery and matching platform aggregated across 50+ ATS platforms (Greenhouse, Lever, Ashby, Workday, SmartRecruiters, etc.), top companies, and verified sources.

---

## 🌟 Architecture Overview

```
                          ┌────────────────────────┐
                          │   GitHub Actions Cron  │  (Runs every 6 hours)
                          │   .github/workflows    │
                          └───────────┬────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │     Python Pipeline    │  (ats-scrapers & backend)
                          │  backend/ingest_...py  │
                          └───────────┬────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │  Supabase (PostgreSQL) │  (Cloud Database & REST API)
                          └───────────┬────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │    Unified React + Vite Single-Page App      │
               │            (Cloudflare Pages)                │
               │                                              │
               │   • Route /     -> High-converting Landing   │
               │   • Route /jobs -> Interactive Job Search    │
               └──────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── sync_jobs.yml       # Scheduled GitHub Actions workflow (runs ingestion every 6h)
├── backend/
│   ├── ingest_tech_jobs.py     # Main tech jobs ingestion & deduplication script
│   ├── sync_engine.py          # Real-time multi-threaded ATS scraper engine
│   ├── seed_companies.py       # Seed script for curated tech companies
│   ├── schema.sql              # Supabase PostgreSQL schema with indexes & RPCs
│   └── requirements.txt        # Python backend dependencies
├── ats-scrapers/               # Modular ATS scraping engine
├── frontend/                   # Single React + Vite Web Application
│   ├── public/
│   │   ├── _redirects          # Cloudflare Pages SPA rewrite rule (/* /index.html 200)
│   │   └── assets/logos/       # Brand & ATS SVG icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/        # Hero, Companies, Features, Stats, CTA, Footer
│   │   │   └── jobs/           # Header, JobCard, JobDetail, FilterBar, Pagination
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx # Full-featured modern landing page (Route: /)
│   │   │   └── JobsPage.jsx    # Real-time search & split-view drawer (Route: /jobs)
│   │   ├── services/
│   │   │   └── supabaseClient.js # Supabase client singleton
│   │   ├── App.jsx             # React Router (BrowserRouter)
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore                  # Global ignore for Node, Python, and secrets
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Frontend Development (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:3000** in your browser:
- **`http://localhost:3000/`** $\rightarrow$ Landing Page
- **`http://localhost:3000/jobs`** $\rightarrow$ Interactive Job Search App

### 2. Backend Job Ingestion Pipeline (Python)
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python ingest_tech_jobs.py
```

---

## ☁️ Deployment Guide

### Deploying Frontend to Cloudflare Pages (100% Free)

1. **Push your repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Easy Jobs platform"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
   - Select your GitHub repository.
   - Configure the build settings:
     - **Framework preset**: `Vite`
     - **Root directory**: `frontend`
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click **Save and Deploy**.

> [!NOTE]
> The included `frontend/public/_redirects` file automatically configures Cloudflare Pages for Single Page Application (SPA) routing, ensuring direct visits to `/jobs` or bookmarked URLs work without 404 errors.

---

### Setting Up Automated Backend Job Sync (GitHub Actions)

The scheduled pipeline (`.github/workflows/sync_jobs.yml`) automatically runs every 6 hours on GitHub's free runners to scrape new job postings and update your Supabase database.

To enable it:
1. In your GitHub repository, go to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
2. Add the following repository secrets:
   - `SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`)
   - `SUPABASE_SERVICE_KEY`: Your Supabase Service Role Key (from Supabase Project Settings $\rightarrow$ API)
3. The cron schedule will automatically run every 6 hours. You can also trigger it manually anytime under the **Actions** tab.

---

## 🔒 Security Best Practices
- Never commit `.env` files containing private service keys.
- The React frontend uses the public `anon` key with PostgreSQL Row Level Security (RLS) policies for read access.
- The Python scraper runs securely in GitHub Actions using the private `SUPABASE_SERVICE_KEY`.

---

## 📄 License
MIT License. Free for open source and commercial use.
