import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ChevronDown } from 'lucide-react';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 h-[68px] flex items-center transition-all duration-200">
      <div className="w-full max-w-[1180px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none" id="nav-brand-logo">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-[0_2px_6px_rgba(37,99,235,0.35)]">
            J
          </div>
          <span className="text-[19px] font-bold text-slate-900 tracking-tight">Jobs Hive</span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/jobs"
            className="text-sm font-semibold text-slate-900 py-1.5 flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Find Jobs
          </Link>

          <a
            href="#salary-insights"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 py-1.5 flex items-center gap-1 transition-colors"
          >
            Salary Insights
          </a>
          <Link
            to="/jobs?remote=true"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 py-1.5 flex items-center gap-1 transition-colors"
          >
            Remote Jobs
          </Link>


        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/jobs?filter=saved')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Saved Jobs"
            aria-label="Saved Jobs"
          >
            <Heart size={20} strokeWidth={1.8} />
          </button>

          <button
            onClick={() => alert('Sign in functionality coming soon! You can search and save all jobs right now.')}
            className="text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => alert('Sign up functionality coming soon! You can search and save all jobs right now.')}
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-[0_2px_6px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
