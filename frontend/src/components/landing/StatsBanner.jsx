import React from 'react';
import { Check } from 'lucide-react';

export default function StatsBanner() {
  return (
    <section className="py-4 px-4 sm:px-6 mb-8" id="stats-section">
      <div className="max-w-[1080px] mx-auto bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-blue-50/90 border border-blue-100/90 rounded-2xl p-6 sm:px-10 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="text-center flex-1">
          <div className="text-3xl sm:text-[32px] font-extrabold text-blue-600 leading-tight mb-1 tracking-tight">
            36,159+
          </div>
          <div className="text-[13px] font-medium text-slate-500">Active Jobs</div>
        </div>

        <div className="text-center flex-1">
          <div className="text-3xl sm:text-[32px] font-extrabold text-blue-600 leading-tight mb-1 tracking-tight">
            30+
          </div>
          <div className="text-[13px] font-medium text-slate-500">Top Companies</div>
        </div>

        <div className="text-center flex-1">
          <div className="text-3xl sm:text-[32px] font-extrabold text-blue-600 leading-tight mb-1 tracking-tight">
            50+
          </div>
          <div className="text-[13px] font-medium text-slate-500">Platforms Integrated</div>
        </div>

        <div className="text-center flex-1">
          <div className="text-3xl sm:text-[32px] font-extrabold text-blue-600 leading-tight mb-1 tracking-tight">
            1M+
          </div>
          <div className="text-[13px] font-medium text-slate-500">Job Seekers</div>
        </div>

        {/* Mini Verified Graphic */}
        <div className="shrink-0 sm:col-span-2 lg:col-span-1 flex justify-center" aria-hidden="true">
          <div className="w-[105px] h-[52px] bg-white border border-slate-200/90 rounded-xl shadow-xs p-2.5 flex items-center gap-2 relative">
            <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-1.5 bg-slate-200/80 rounded-full w-[85%]" />
              <div className="h-1.5 bg-slate-200/60 rounded-full w-[55%]" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_1px_4px_rgba(16,185,129,0.4)] text-white">
              <Check size={11} strokeWidth={3.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
