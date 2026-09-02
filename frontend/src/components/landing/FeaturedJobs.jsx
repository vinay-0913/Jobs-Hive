import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bookmark, ArrowRight } from 'lucide-react';
import supabase, { COLUMNS } from '../../services/supabaseClient';
import CURATED_DEFAULT_JOBS from '../../data/curatedJobs';
import { CompanyLogo } from '../JobCard';
import {
  cleanJobTitle,
  formatLocation,
  formatExperience,
  extractSkillTags,
  timeAgo,
  formatSalaryDisplay,
  formatEmploymentType,
  isJobSaved,
  toggleSaveJob,
} from '../../utils/helpers';

function SkeletonFeaturedCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:py-4.5 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5 animate-pulse">
      <div className="w-[46px] h-[46px] bg-slate-100 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-slate-100 rounded h-4 w-[50%]" />
        <div className="bg-slate-100 rounded h-3 w-[25%]" />
        <div className="bg-slate-100 rounded h-3 w-[65%]" />
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 sm:min-w-[110px]">
        <div className="bg-slate-100 rounded h-4 w-20" />
        <div className="bg-slate-100 rounded h-3 w-12" />
      </div>
    </div>
  );
}

export default function FeaturedJobs({ onSelectJob }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  // Listen for bookmark updates
  const syncSaved = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      setSavedIds(new Set(saved.map((j) => (typeof j === 'object' ? j.id : j))));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    syncSaved();
    window.addEventListener('bookmarkChanged', syncSaved);
    return () => window.removeEventListener('bookmarkChanged', syncSaved);
  }, []);

  // Fetch real jobs from Supabase backend
  useEffect(() => {
    let isMounted = true;

    async function loadLatestJobs() {
      setLoading(true);
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('jobs')
            .select(COLUMNS)
            .eq('is_active', true)
            .order('posted_at', { ascending: false, nullsFirst: false })
            .limit(5);

          if (!error && data && data.length > 0 && isMounted) {
            setJobs(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Falling back to curated jobs on backend error:', err);
        }
      }

      if (isMounted) {
        setJobs(CURATED_DEFAULT_JOBS.slice(0, 5));
        setLoading(false);
      }
    }

    loadLatestJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookmark = (e, job) => {
    e.stopPropagation();
    toggleSaveJob(job.id, job);
    syncSaved();
    window.dispatchEvent(new Event('bookmarkChanged'));
  };

  return (
    <section className="py-6 px-6 pb-14" id="jobs-section">
      <div className="max-w-[1080px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Latest job openings</h2>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group"
          >
            <span>View all jobs</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <SkeletonFeaturedCard key={n} />
            ))}
          </div>
        ) : (
          /* Jobs List with smooth staggered animation */
          <div className="flex flex-col gap-3">
            {jobs.map((job, index) => {
              const isSaved = savedIds.has(job.id);
              const title = cleanJobTitle(job.title);
              const location = formatLocation(job);
              const experience = formatExperience(job);
              const empType = formatEmploymentType(job.employment_type) || 'Full-time';
              const salary = formatSalaryDisplay(job);
              const time = timeAgo(job.posted_at || job.fetched_at || job.first_seen_at);
              const skills = extractSkillTags(job).slice(0, 3);

              // Check if posted within last 3 days
              const isNew =
                job.posted_at &&
                new Date().getTime() - new Date(job.posted_at).getTime() < 3 * 86400 * 1000;

              return (
                <div
                  key={job.id || index}
                  onClick={() =>
                    onSelectJob ? onSelectJob(job) : navigate(`/jobs?q=${encodeURIComponent(job.title)}`)
                  }
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="job-card-item animate-fade-in-up bg-white border border-slate-200/90 rounded-2xl p-4 sm:py-4.5 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5 cursor-pointer relative"
                >
                  {/* Company Logo */}
                  <div className="shrink-0">
                    <CompanyLogo companyName={job.company_name} size="md" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="job-title-text text-[15.5px] font-bold text-slate-900 tracking-tight">
                        {title}
                      </h3>
                      {job.is_remote && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/80 leading-none">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
                          </svg>
                          Remote
                        </span>
                      )}
                      {isNew && (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 leading-none">
                          New
                        </span>
                      )}
                    </div>

                    <div className="text-[13px] font-medium text-slate-500 mb-1.5">{job.company_name}</div>

                    <div className="flex items-center flex-wrap gap-2 text-[12.5px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-slate-400" />
                        {location}
                      </span>
                      <span className="text-slate-200">·</span>
                      <span className="inline-flex items-center gap-1">{empType}</span>
                      <span className="text-slate-200">·</span>
                      <span className="inline-flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        {experience}
                      </span>
                      {skills && skills.length > 0 && (
                        <div className="flex items-center flex-wrap gap-1.5 ml-1">
                          {skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-slate-50 border border-slate-200/70 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Salary & Time */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 sm:min-w-[110px] pt-2.5 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                    <div className="text-[15px] font-bold text-slate-900 whitespace-nowrap">{salary}</div>
                    <div className="text-xs text-slate-400 font-normal">{time}</div>
                    <button
                      type="button"
                      onClick={(e) => handleBookmark(e, job)}
                      className={`btn-bookmark p-1 rounded transition-transform duration-150 active:scale-90 ${
                        isSaved ? 'text-blue-600 active' : 'text-slate-400 hover:text-blue-600'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Job'}
                    >
                      <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
