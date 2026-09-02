import React from 'react';
import { Link } from 'react-router-dom';

const ATS_LOGOS = [
  { name: 'Greenhouse', src: '/assets/logos/greenhouse.svg', h: 'h-4.5 md:h-5' },
  { name: 'Lever', src: '/assets/logos/lever.svg', h: 'h-4 md:h-4.5' },
  { name: 'Ashby', src: '/assets/logos/ashby.svg', h: 'h-4 md:h-4.5' },
  { name: 'Workday', src: '/assets/logos/workday.svg', h: 'h-4 md:h-4.5' },
  { name: 'SmartRecruiters', src: '/assets/logos/smartrecruiters.svg', h: 'h-4.5 md:h-5' },
];

export default function Footer() {
  return (
    <footer className="site-footer bg-white pt-12 px-6 pb-8 border-t border-slate-100">
      <div className="max-w-[1080px] mx-auto">
        {/* Top Aggregator Logos Strip */}
        <div className="flex items-center justify-center flex-wrap gap-4 mb-10 pb-8 border-b border-slate-100">
          <span className="text-[13px] font-semibold text-slate-700">We aggregate jobs from</span>

          <div className="flex items-center flex-wrap gap-4">
            {ATS_LOGOS.map((ats, idx) => (
              <React.Fragment key={ats.name}>
                <div className="flex items-center">
                  <img src={ats.src} alt={ats.name} className={`${ats.h} object-contain`} />
                </div>
                {idx < ATS_LOGOS.length - 1 && (
                  <span className="text-slate-300 font-semibold text-sm">+</span>
                )}
              </React.Fragment>
            ))}

            <span className="text-[13px] text-slate-500 font-medium">&amp; more</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 mb-10">
          {/* Brand & Description */}
          <div className="max-w-[360px]">
            <Link to="/" className="flex items-center gap-2 mb-3 select-none">
              <svg
                className="shrink-0"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2.5" ry="2.5" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="2" y1="13" x2="22" y2="13" />
                <line x1="10" y1="13" x2="14" y2="13" />
              </svg>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Easy <span className="text-blue-600">Jobs</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-500 m-0">
              A centralized job search and matching platform that helps you find your dream job. Upload your resume, set
              your preferences, and find the best jobs.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="flex gap-12 sm:gap-20">
            {/* Product Column */}
            <div className="flex flex-col min-w-[110px]">
              <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight">Product</h4>
              <ul className="list-none flex flex-col gap-2.5 p-0 m-0">
                <li>
                  <a href="#how-it-works" className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features-section" className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/jobs" className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">
                    Job Board
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="flex flex-col min-w-[110px]">
              <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight">Company</h4>
              <ul className="list-none flex flex-col gap-2.5 p-0 m-0">
                <li>
                  <a href="#about" className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 w-full mb-6" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[12.5px] text-slate-500 gap-3.5">
          <div>© 2026 Easy Jobs. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 hover:-translate-y-0.5 transition-all"
              aria-label="X (Twitter)"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 hover:-translate-y-0.5 transition-all"
              aria-label="LinkedIn"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
