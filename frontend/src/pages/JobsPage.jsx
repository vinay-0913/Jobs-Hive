import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import JobDetail from '../components/JobDetail';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import supabase, { COLUMNS } from '../services/supabaseClient';
import CURATED_DEFAULT_JOBS from '../data/curatedJobs';
import { X, Check } from 'lucide-react';

const PAGE_SIZE = 20;

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3.5 animate-pulse">
      <div className="w-11 h-11 bg-slate-100 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="bg-slate-100 rounded h-4 w-[60%]" />
        <div className="bg-slate-100 rounded h-3 w-[35%]" />
        <div className="bg-slate-100 rounded h-3 w-[75%]" />
        <div className="flex gap-1.5 mt-1">
          <div className="bg-slate-100 rounded h-4 w-12" />
          <div className="bg-slate-100 rounded h-4 w-14" />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-14 w-12">
        <div className="bg-slate-100 rounded h-4 w-4" />
        <div className="bg-slate-100 rounded h-3 w-10" />
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const query = searchParams.get('q') || '';
  const locationFilter = searchParams.get('location') || '';
  const remoteOnly = searchParams.get('remote') === 'true';

  // Fetch jobs from Supabase or fallback
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);

    // Try Supabase first
    if (supabase) {
      try {
        const offset = (page - 1) * PAGE_SIZE;
        let dbQuery = supabase
          .from('jobs')
          .select(COLUMNS, { count: 'exact' })
          .eq('is_active', true);

        // Search filter
        if (query) {
          dbQuery = dbQuery.or(
            `title.ilike.%${query}%,company_name.ilike.%${query}%,description.ilike.%${query}%`
          );
        }

        // Location filter
        if (locationFilter) {
          if (locationFilter === 'Remote') {
            dbQuery = dbQuery.eq('is_remote', true);
          } else {
            dbQuery = dbQuery.ilike('location', `%${locationFilter}%`);
          }
        }

        if (remoteOnly) {
          dbQuery = dbQuery.eq('is_remote', true);
        }

        // Sort
        if (sortBy === 'recent') {
          dbQuery = dbQuery.order('posted_at', { ascending: false, nullsFirst: false });
        } else {
          dbQuery = dbQuery.order('posted_at', { ascending: false, nullsFirst: false });
        }

        dbQuery = dbQuery.range(offset, offset + PAGE_SIZE - 1);

        const { data, error, count } = await dbQuery;

        if (error) throw error;

        if (data && data.length > 0) {
          setJobs(data);
          setTotalCount(count || 36159);
          if (!selectedJob || page === 1) {
            setSelectedJob(data[0]);
          }
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback to curated:', err);
      }
    }

    // Fallback to curated jobs
    let filtered = [...CURATED_DEFAULT_JOBS];
    const term = query.toLowerCase();

    if (term) {
      filtered = filtered.filter(j =>
        (j.title && j.title.toLowerCase().includes(term)) ||
        (j.company_name && j.company_name.toLowerCase().includes(term)) ||
        (j.description && j.description.toLowerCase().includes(term))
      );
    }

    if (locationFilter) {
      if (locationFilter === 'Remote') {
        filtered = filtered.filter(j => j.is_remote);
      } else {
        filtered = filtered.filter(j =>
          j.location && j.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }
    }

    if (remoteOnly) {
      filtered = filtered.filter(j => j.is_remote);
    }

    const total = filtered.length > 0 ? (term || locationFilter ? filtered.length : 36159) : 0;
    setTotalCount(total);

    // Paginate curated jobs
    const offset = (page - 1) * PAGE_SIZE;
    const paginated = filtered.slice(offset, offset + PAGE_SIZE);

    setJobs(paginated);
    if (paginated.length > 0 && (!selectedJob || page === 1)) {
      setSelectedJob(paginated[0]);
    }
    setIsLoading(false);
  }, [query, locationFilter, remoteOnly, page, sortBy]);


  // Reset page when search changes
  useEffect(() => {
    setPage(1);
    setSelectedJob(null);
  }, [query, locationFilter, remoteOnly]);

  // Fetch on mount and when deps change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = () => {
    setPage(1);
    setSelectedJob(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll list to top
    const listEl = document.getElementById('jobs-list-scroll');
    if (listEl) listEl.scrollTop = 0;
  };

  const activeFilters = (query ? 1 : 0) + (locationFilter ? 1 : 0) + (remoteOnly ? 1 : 0) || 1;

  const setLocation = (loc) => {
    const newParams = new URLSearchParams(searchParams);
    if (loc) {
      newParams.set('location', loc);
    } else {
      newParams.delete('location');
    }
    setSearchParams(newParams);
    setShowFilterModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Main Split Panel */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-6 overflow-hidden">
        {/* Left Column — Job List */}
        <section aria-label="Job listings" className="w-full md:w-[450px] lg:w-[480px] xl:w-[500px] shrink-0 flex flex-col h-full overflow-hidden">
          {/* Filter Bar */}
          <div className="pb-1 shrink-0">
            <FilterBar
              totalCount={totalCount}
              sortBy={sortBy}
              onSortChange={setSortBy}
              activeFilters={activeFilters}
              onOpenFilterModal={() => setShowFilterModal(true)}
            />
          </div>

          {/* Job Cards List */}
          <div id="jobs-list-scroll" className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1 pt-1 pb-6">
            {isLoading ? (
              <>
                {Array.from({ length: 7 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 px-5 bg-white rounded-2xl border border-slate-200">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mx-auto mb-3">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">No matching jobs found</h3>
                <p className="text-sm text-slate-500 max-w-[320px] mx-auto">
                  {query
                    ? `We couldn't find any positions matching "${query}". Try broadening your search.`
                    : 'No active jobs currently available matching your criteria.'
                  }
                </p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => setSelectedJob(job)}
                  animationDelay={Math.min(index * 40, 250)}
                />
              ))
            )}

            {/* Pagination */}
            {!isLoading && totalCount > PAGE_SIZE && (
              <Pagination
                currentPage={page}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </section>


        {/* Right Column — Job Detail */}
        <section aria-label="Job details" className="hidden md:flex flex-1 flex-col h-full overflow-hidden">
          <JobDetail job={selectedJob} />
        </section>
      </main>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Filter Jobs</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Location</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Remote'].map((loc) => {
                    const isSelected = loc === 'All' ? !locationFilter : locationFilter === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc === 'All' ? '' : loc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowFilterModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

