import React from 'react';

export default function CtaBanner() {
  return (
    <section className="py-4 px-6 pb-14">
      <div className="max-w-[1080px] mx-auto bg-gradient-to-r from-blue-50/70 via-sky-50/30 to-blue-50/70 border border-blue-100/80 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden text-center lg:text-left">
        {/* Left 3D Paper Airplane Graphic */}
        <div className="cta-plane-visual shrink-0" aria-hidden="true">
          <svg width="260" height="175" viewBox="0 0 280 190" fill="none" className="cta-plane-svg">
            <defs>
              <linearGradient id="planeTopWing" x1="100" y1="50" x2="230" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="planeRightWing" x1="140" y1="70" x2="230" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="planeUnderfold" x1="120" y1="80" x2="200" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <filter id="planeGlowShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="2" dy="12" stdDeviation="12" floodColor="#1E40AF" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* Dotted Loop Trail */}
            <path
              d="M45,150 C30,120 70,80 100,105 C115,120 100,150 75,145 C50,140 65,100 120,110 C150,115 165,105 178,98"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Sparkles & Doodle Accents */}
            <g transform="translate(35, 75)">
              <path d="M6,0 L7.5,4.5 L12,6 L7.5,7.5 L6,12 L4.5,7.5 L0,6 L4.5,4.5 Z" fill="#93C5FD" />
            </g>
            <g transform="translate(245, 45)">
              <path d="M5,0 L6.2,3.8 L10,5 L6.2,6.2 L5,10 L3.8,6.2 L0,5 L3.8,3.8 Z" fill="#60A5FA" />
            </g>
            <g transform="translate(195, 145)">
              <path d="M4,0 L5,3 L8,4 L5,5 L4,8 L3,5 L0,4 L3,3 Z" fill="#BFDBFE" />
            </g>
            <path d="M125,50 L125,56 M122,53 L128,53" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M210,120 L210,126 M207,123 L213,123" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="160" cy="55" r="2" fill="#BFDBFE" />
            <circle cx="85" cy="65" r="1.5" fill="#93C5FD" />

            {/* 3D Faceted Origami Paper Airplane Group */}
            <g filter="url(#planeGlowShadow)">
              <polygon points="235,68 140,118 165,92" fill="#172554" />
              <polygon points="235,68 95,78 165,92" fill="url(#planeTopWing)" />
              <polygon points="235,68 115,50 95,78" fill="#60A5FA" />
              <polygon points="235,68 165,92 152,112" fill="url(#planeRightWing)" />
              <polygon points="235,68 152,112 140,118" fill="url(#planeUnderfold)" />
            </g>
          </svg>
        </div>

        {/* Right Content */}
        <div className="flex-1 max-w-[500px]">
          <h2 className="text-2xl sm:text-3xl md:text-[30px] font-extrabold leading-[1.18] text-slate-900 tracking-[-0.03em] mb-2.5">
            Don't just search jobs.<br />
            Find the <span className="text-blue-600">right one.</span>
          </h2>
          <p className="text-[14.5px] text-slate-500 mb-6 leading-relaxed">
            Create your profile, save jobs, get alerts and apply faster.
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
            <button
              onClick={() => alert('Account creation coming soon!')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Create Free Account
            </button>
            <button
              onClick={() => alert('Resume upload coming soon!')}
              className="bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-[14px] font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
