import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://limaxguumazwurrkshso.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbWF4Z3V1bWF6d3VycmtzaHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzY1MTMsImV4cCI6MjEwMzc1MjUxM30.qBrBII_SEO_qevCbuA8SbEJHNGvaDi2d0pEmdCcEOH8";

export const COLUMNS = "id,global_id,title,company_name,ats_type,url,apply_url,location,country_iso,is_remote,salary_min,salary_max,salary_currency,salary_period,salary_summary,department,team,employment_type,experience,description,posted_at,fetched_at,first_seen_at,is_active";

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn("Failed to create Supabase client:", e);
}

export default supabase;
