import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import JobDetail from '../components/JobDetail';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import FilterModal from '../components/FilterModal';
import supabase, { COLUMNS } from '../services/supabaseClient';

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

  // URL parameters for all valid filters
  const query = searchParams.get('q') || '';
  const locationFilter = searchParams.get('location') || '';
  const workplaceFilter = searchParams.get('workplace') || (searchParams.get('remote') === 'true' ? 'remote' : '');
  const empTypeFilter = searchParams.get('emp_type') || '';
  const experienceFilter = searchParams.get('experience') || '';
  const datePostedFilter = searchParams.get('date_posted') || '';

  // Calculate number of active user filters
  const activeFilters =
    (locationFilter ? 1 : 0) +
    (workplaceFilter ? 1 : 0) +
    (empTypeFilter ? 1 : 0) +
    (experienceFilter ? 1 : 0) +
    (datePostedFilter ? 1 : 0);

  // Fetch real jobs from Supabase database with all active filters
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);

    if (!supabase) {
      setJobs([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    try {
      const offset = (page - 1) * PAGE_SIZE;
      let dbQuery = supabase
        .from('jobs')
        .select(COLUMNS, { count: 'estimated' })
        .eq('is_active', true);

      // 1. Keyword search (Title & Company)
      if (query.trim()) {
        const term = query.trim();
        dbQuery = dbQuery.or(`title.ilike.%${term}%,company_name.ilike.%${term}%`);
      }

      // 2. Workplace Filter (Remote vs In-Office/Hybrid)
      if (workplaceFilter === 'remote') {
        dbQuery = dbQuery.eq('is_remote', true);
      } else if (workplaceFilter === 'onsite') {
        dbQuery = dbQuery.eq('is_remote', false);
      }

      // 3. Location Filter (City / Region)
      if (locationFilter) {
        if (locationFilter.toLowerCase() === 'remote') {
          dbQuery = dbQuery.eq('is_remote', true);
        } else {
          dbQuery = dbQuery.ilike('location', `%${locationFilter}%`);
        }
      }

      // 4. Employment Type Filter
      if (empTypeFilter) {
        dbQuery = dbQuery.ilike('employment_type', `%${empTypeFilter}%`);
      }

      // 5. Experience Filter (Direct Database Column)
      if (experienceFilter === '0') {
        dbQuery = dbQuery.eq('experience', 0);
      } else if (experienceFilter === '1-2' || experienceFilter === '0-2') {
        dbQuery = dbQuery.gte('experience', 1).lte('experience', 2);
      } else if (experienceFilter === '3-5') {
        dbQuery = dbQuery.gte('experience', 3).lte('experience', 5);
      } else if (experienceFilter === '5+') {
        dbQuery = dbQuery.gte('experience', 5);
      }

      // 6. Date Posted Filter (Recency)
      if (datePostedFilter === '24h') {
        const d = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
        dbQuery = dbQuery.gte('posted_at', d);
      } else if (datePostedFilter === '7d') {
        const d = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
        dbQuery = dbQuery.gte('posted_at', d);
      } else if (datePostedFilter === '30d') {
        const d = new Date(Date.now() - 30 * 86400 * 1000).toISOString();
        dbQuery = dbQuery.gte('posted_at', d);
      }

      // 7. Sorting
      if (sortBy === 'salary_high') {
        dbQuery = dbQuery.order('salary_max', { ascending: false, nullsFirst: false });
      } else {
        dbQuery = dbQuery.order('posted_at', { ascending: false, nullsFirst: false });
      }

      // 8. Pagination Range
      dbQuery = dbQuery.range(offset, offset + PAGE_SIZE - 1);

      const { data, error, count } = await dbQuery;

      if (error) {
        console.error('Supabase query error:', error);
        setJobs([]);
        setTotalCount(0);
      } else if (data) {
        setJobs(data);
        setTotalCount(count != null ? count : data.length);
        if (!selectedJob || page === 1) {
          setSelectedJob(data[0] || null);
        }
      }
    } catch (err) {
      console.error('Database connection error:', err);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    query,
    locationFilter,
    workplaceFilter,
    empTypeFilter,
    experienceFilter,
    datePostedFilter,
    page,
    sortBy,
  ]);

  // Reset page to 1 whenever any filter or search query changes
  useEffect(() => {
    setPage(1);
    setSelectedJob(null);
  }, [query, locationFilter, workplaceFilter, empTypeFilter, experienceFilter, datePostedFilter]);

  // Fetch jobs when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = () => {
    setPage(1);
    setSelectedJob(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const listEl = document.getElementById('jobs-list-scroll');
    if (listEl) listEl.scrollTop = 0;
  };

  // Apply new filters from FilterModal to URL search params
  const handleApplyFilters = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);

    if (newFilters.location) {
      newParams.set('location', newFilters.location);
    } else {
      newParams.delete('location');
    }

    if (newFilters.workplace) {
      newParams.set('workplace', newFilters.workplace);
      if (newFilters.workplace === 'remote') {
        newParams.set('remote', 'true');
      } else {
        newParams.delete('remote');
      }
    } else {
      newParams.delete('workplace');
      newParams.delete('remote');
    }

    if (newFilters.empType) {
      newParams.set('emp_type', newFilters.empType);
    } else {
      newParams.delete('emp_type');
    }

    if (newFilters.experience) {
      newParams.set('experience', newFilters.experience);
    } else {
      newParams.delete('experience');
    }

    if (newFilters.datePosted) {
      newParams.set('date_posted', newFilters.datePosted);
    } else {
      newParams.delete('date_posted');
    }

    setSearchParams(newParams);
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
                  {query || activeFilters > 0
                    ? "We couldn't find any positions matching your criteria. Try adjusting or clearing your filters."
                    : 'No active jobs currently available matching your criteria.'}
                </p>
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newParams = new URLSearchParams();
                      if (query) newParams.set('q', query);
                      setSearchParams(newParams);
                    }}
                    className="mt-4 px-4 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-block"
                  >
                    Clear All Filters
                  </button>
                )}
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
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentFilters={{
          location: locationFilter,
          workplace: workplaceFilter,
          empType: empTypeFilter,
          experience: experienceFilter,
          datePosted: datePostedFilter,
        }}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
