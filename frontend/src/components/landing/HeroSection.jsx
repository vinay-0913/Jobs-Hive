import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, X, ChevronDown } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Software Engineer',
  'Backend Developer',
  'Frontend Developer',
  'Data Scientist',
  'DevOps Engineer',
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location.trim()) {
      if (location === 'Remote') {
        params.set('remote', 'true');
      } else {
        params.set('location', location);
      }
    }
    navigate(`/jobs?${params.toString()}`);
  };

  const handlePopularClick = (tag) => {
    navigate(`/jobs?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative pt-14 pb-12 px-6 text-center bg-[radial-gradient(ellipse_at_50%_25%,#f4f8ff_0%,#ffffff_75%)] overflow-hidden">
      {/* Radial Background Ripples */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
        <div className="ripple ripple-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/50" />
        <div className="ripple ripple-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/35" />
        <div className="ripple ripple-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/20" />
      </div>

      <div className="relative max-w-[1080px] mx-auto z-10">
        {/* Floating 3D Badge Left (Briefcase) */}
        <div className="floating-badge floating-badge-left hidden xl:block absolute z-10 pointer-events-none -left-2 top-8" aria-hidden="true">
          <div className="w-[70px] h-[70px] bg-white rounded-2xl border border-slate-100 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.1)] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="briefcaseGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="lockGrad" x1="0" y1="0" x2="0" y2="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#dbeafe" />
                </linearGradient>
                <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1e40af" floodOpacity="0.25" />
                </filter>
              </defs>
              <rect x="6" y="14" width="36" height="26" rx="6" fill="url(#briefcaseGrad)" filter="url(#cardShadow)" />
              <path d="M16 14V10C16 7.79 17.79 6 20 6H28C30.21 6 32 7.79 32 10V14" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
              <rect x="20" y="21" width="8" height="6" rx="2" fill="url(#lockGrad)" />
              <path d="M6 24C16 26 32 26 42 24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Floating 3D Badge Right (Analytics Chart) */}
        <div className="floating-badge floating-badge-right hidden xl:block absolute z-10 pointer-events-none -right-2 top-8" aria-hidden="true">
          <div className="w-[70px] h-[70px] bg-white rounded-2xl border border-slate-100 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.1)] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="chartLineGrad" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle cx="10" cy="36" r="3.5" fill="#10b981" />
              <circle cx="22" cy="24" r="3.5" fill="#10b981" />
              <circle cx="32" cy="28" r="3.5" fill="#10b981" />
              <circle cx="40" cy="12" r="4.5" fill="#059669" />
              <path d="M10 36L22 24L32 28L40 12" stroke="url(#chartLineGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 6L43 9L46 10L43 11L42 14L41 11L38 10L41 9L42 6Z" fill="#10b981" />
            </svg>
          </div>
        </div>

        <div className="max-w-[760px] mx-auto">
          {/* Live Count Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50/90 border border-blue-100 rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-blue-600 mb-5 shadow-xs">
            <span className="flex items-center text-blue-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span>Tech jobs from 50+ platforms</span>
          </div>

          {/* Hero Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold leading-[1.12] text-slate-900 tracking-[-0.035em] mb-4">
            Find your next<br />
            <span className="text-blue-600">tech</span> opportunity.
          </h1>

          {/* Hero Subtitle */}
          <p className="text-[15px] sm:text-base leading-relaxed text-slate-500 max-w-[620px] mx-auto mb-8">
            Discover verified tech jobs across India and remote positions.<br className="hidden sm:inline" />
            Aggregated from top companies and trusted platforms.
          </p>

          {/* Main Unified Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white border border-slate-200/90 rounded-2xl md:rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] max-w-[760px] mx-auto mb-6 p-2 md:py-1.5 md:pl-5 md:pr-1.5 flex flex-col md:flex-row items-center gap-2 md:gap-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
          >
            {/* Search Query Field */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[200px] w-full md:w-auto pl-1">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skills or company"
                className="w-full border-none text-[14px] text-slate-800 bg-transparent py-2 outline-none placeholder:text-slate-400 font-normal"
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-900 p-1 flex items-center cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="hidden md:block w-px h-[24px] bg-slate-200 shrink-0" />

            {/* Location Select */}
            <div className="relative pr-1 flex items-center gap-2 w-full md:w-auto">
              <MapPin size={17} className="text-slate-400 shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full md:w-auto border-none bg-transparent text-[13.5px] font-medium text-slate-700 py-2 pr-6 pl-0 cursor-pointer appearance-none outline-none"
              >
                <option value="">India &amp; Remote</option>
                <option value="India">India (All Locations)</option>
                <option value="Remote">Remote Only</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Gurgaon">Gurgaon / NCR</option>
                <option value="Mumbai">Mumbai</option>
              </select>
              <ChevronDown size={12} className="absolute right-1 pointer-events-none text-slate-400" />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[14px] font-semibold px-7 h-[42px] rounded-lg md:rounded-full flex items-center justify-center whitespace-nowrap shrink-0 w-full md:w-auto shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Popular Searches Tag Bar */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-[12.5px]">
            <span className="text-slate-500 font-medium">Popular searches:</span>
            <div className="flex items-center flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handlePopularClick(tag)}
                  className="popular-tag bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/60 text-slate-700 text-[12px] font-medium px-3 py-1 rounded-full transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
