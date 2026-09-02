import React, { useState } from 'react';
import { MapPin, Bookmark } from 'lucide-react';
import { getCompanyLogo } from '../data/brandLogos';
import { cleanJobTitle, formatLocation, formatExperience, extractSkillTags, timeAgo, isJobSaved, toggleSaveJob, formatEmploymentType } from '../utils/helpers';

export function CompanyLogo({ companyName, size = "md" }) {
  const logoData = getCompanyLogo(companyName);
  const sizeClasses = size === "lg" 
    ? "w-16 h-16 rounded-2xl p-2.5 text-2xl" 
    : "w-11 h-11 rounded-xl p-1.5 text-base";

  if (!logoData) {
    return (
      <div className={`${sizeClasses} bg-white text-blue-600 border border-slate-200 flex items-center justify-center font-extrabold shadow-xs shrink-0`}>
        E
      </div>
    );
  }

  if (logoData.type === 'svg') {
    return (
      <div className={`${sizeClasses} bg-white border border-slate-200/80 flex items-center justify-center shadow-xs shrink-0`}>
        {logoData.logo}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} border border-slate-200/80 flex items-center justify-center font-extrabold shadow-xs shrink-0`}
      style={{ backgroundColor: logoData.bg, color: logoData.color }}
    >
      {logoData.initial}
    </div>
  );
}

export default function JobCard({ job, isSelected, onClick, animationDelay = 0 }) {
  const [saved, setSaved] = useState(isJobSaved(job.id));

  const title = cleanJobTitle(job.title);
  const location = formatLocation(job);
  const experience = formatExperience(job);
  const skills = extractSkillTags(job);
  const time = timeAgo(job.posted_at || job.first_seen_at);
  const empType = formatEmploymentType(job.employment_type);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const nowSaved = toggleSaveJob(job.id);
    setSaved(nowSaved);
    window.dispatchEvent(new Event('bookmarkChanged'));
  };

  return (
    <div
      className={`group bg-white border rounded-2xl p-4 cursor-pointer relative transition-all duration-150 ${
        isSelected
          ? 'border-[#0062ff] ring-1 ring-[#0062ff] shadow-xs'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
      style={{ animationDelay: `${animationDelay}ms`, backgroundColor: '#ffffff' }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3.5">
        {/* Logo */}
        <CompanyLogo companyName={job.company_name} />

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-[15px] font-bold tracking-tight text-slate-900 leading-snug">
                {title}
              </h3>
              <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] leading-none">
                New
              </span>
            </div>

            {/* Remote badge on right if applicable */}
            {job.is_remote && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 leading-none shrink-0">
                <MapPin size={10} />
                Remote
              </span>
            )}
          </div>

          {/* Company */}
          <div className="text-[13px] font-semibold text-slate-800 mb-1">{job.company_name}</div>

          {/* Metadata row */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[12px] text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1 text-slate-700">
              <MapPin size={12} className="text-slate-400" />
              {location}
            </span>
            <span className="text-slate-300">•</span>
            <span>{empType}</span>
            <span className="text-slate-300">•</span>
            <span>{experience}</span>
          </div>

          {/* Skill Tags */}
          <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200/60 leading-none">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Bookmark & Time */}
        <div className="flex flex-col items-end justify-between shrink-0 self-stretch min-w-[50px] pl-1">
          <button
            onClick={handleBookmark}
            className={`p-1 rounded-md transition-colors ${saved ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
            title={saved ? 'Unsave job' : 'Save job'}
          >
            <Bookmark size={18} fill={saved ? '#0062ff' : 'none'} stroke={saved ? '#0062ff' : 'currentColor'} strokeWidth={1.8} />
          </button>
          <span className="text-[11.5px] text-slate-500 font-normal whitespace-nowrap mt-auto">{time}</span>
        </div>
      </div>
    </div>
  );
}
