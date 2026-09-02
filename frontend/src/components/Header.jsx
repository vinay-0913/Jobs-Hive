import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, User, X } from 'lucide-react';

export default function Header({ onSearch }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Sync query from URL params
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set('q', query.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
    onSearch?.(query.trim());
  };

  const clearSearch = () => {
    setQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
    onSearch?.('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 h-[68px] flex items-center shrink-0">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none shrink-0 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-[17px] shadow-[0_2px_6px_rgba(37,99,235,0.35)] group-hover:scale-105 transition-transform">
            E
          </div>
          <span className="text-[19px] font-bold text-slate-900 tracking-tight">Easy Jobs</span>
        </Link>

        {/* Center Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[560px] mx-4">
          <div className="relative flex items-center bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 rounded-full px-3.5 py-2 shadow-xs transition-all">
            <Search className="text-slate-400 shrink-0 mr-2.5" size={17} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, skills or company"
              className="w-full bg-transparent text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-slate-400 hover:text-slate-600 mr-2 p-0.5 rounded-full transition-colors"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="text-slate-400 hover:text-blue-600 shrink-0 p-0.5 transition-colors"
              title="Search"
            >
              <Search size={17} />
            </button>
          </div>
        </form>

        {/* Right Actions - Sign In */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Sign In functionality coming soon! You can browse and save all jobs now.")}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[13.5px] px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_2px_6px_rgba(37,99,235,0.25)] hover:shadow-md transition-all"
          >
            <User size={15} strokeWidth={2.2} />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
}

