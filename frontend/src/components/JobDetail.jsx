import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MapPin, Clock, ExternalLink, Heart, Bookmark, CheckCircle2, Star, Briefcase } from 'lucide-react';
import { CompanyLogo } from './JobCard';
import { cleanJobTitle, formatLocation, formatExperience, extractSkillTags, timeAgo, isJobSaved, toggleSaveJob, formatEmploymentType } from '../utils/helpers';

const TABS = ['Job Description', 'About Company', 'Benefits', 'Requirements', 'Skills', 'Reviews'];

// Custom components for Markdown rendering with darker, high-contrast text
const MarkdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-[17px] font-bold text-slate-900 mt-6 mb-2.5 first:mt-0 tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[16px] font-bold text-slate-900 mt-6 mb-2.5 first:mt-0 tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[15.5px] font-bold text-slate-900 mt-6 mb-2.5 first:mt-0 tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-[14.5px] font-bold text-slate-900 mt-5 mb-2 first:mt-0 tracking-tight">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-[14px] text-slate-800 leading-[1.68] mb-3.5 last:mb-0 font-normal">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 mb-5 pl-4 list-disc marker:text-slate-500 text-[14px] text-slate-800">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 mb-5 pl-4 list-decimal marker:text-slate-600 font-medium text-[14px] text-slate-800">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-[14px] text-slate-800 leading-relaxed pl-1">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-slate-950">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-900">
      {children}
    </em>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-600 pl-3.5 py-1.5 my-3.5 text-slate-800 italic bg-slate-50 rounded-r-lg">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) => (
    inline ? (
      <code className="bg-slate-100 text-slate-900 font-mono text-[12px] px-1.5 py-0.5 rounded border border-slate-200">
        {children}
      </code>
    ) : (
      <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 my-3.5 overflow-x-auto text-[12.5px] font-mono leading-relaxed">
        <code>{children}</code>
      </pre>
    )
  ),
};

export default function JobDetail({ job }) {
  const [activeTab, setActiveTab] = useState('Job Description');
  const [saved, setSaved] = useState(isJobSaved(job?.id));

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
        <div className="text-center">
          <Briefcase size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Job Selected</h3>
          <p className="text-xs text-slate-500">Select a job from the list on the left to view details</p>
        </div>
      </div>
    );
  }

  const title = cleanJobTitle(job.title);
  const location = formatLocation(job);
  const experience = formatExperience(job);
  const skills = extractSkillTags(job);
  const time = timeAgo(job.posted_at || job.first_seen_at);
  const empType = formatEmploymentType(job.employment_type);

  const handleBookmark = () => {
    const nowSaved = toggleSaveJob(job.id);
    setSaved(nowSaved);
    window.dispatchEvent(new Event('bookmarkChanged'));
  };

  const applyUrl = job.apply_url || job.url || 'https://www.google.com/about/careers/applications/jobs/results';

  // Work model
  const workModel = job.is_remote ? 'Remote' : (job.work_model || 'Hybrid');
  const role = job.role || 'Individual Contributor';
  const team = job.team || job.department || 'Core Engineering';
  const fullLoc = job.full_location || (location.includes('Bangalore') ? 'Bangalore, Karnataka, India' : (location.includes('Hyderabad') ? 'Hyderabad, Telangana, India' : location));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-7 shadow-xs flex flex-col h-full overflow-hidden animate-fade-in-up">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-5 shrink-0">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Logo & Job Titles */}
          <div className="flex items-start gap-4 min-w-0">
            <CompanyLogo companyName={job.company_name} size="lg" />
            <div className="min-w-0">
              {/* Title row */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[21px] lg:text-[23px] font-bold text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] leading-none">
                  New
                </span>
                {job.is_remote && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 leading-none">
                    <MapPin size={11} />
                    Remote
                  </span>
                )}
              </div>

              {/* Company Name */}
              <div className="text-[15px] font-bold text-slate-900 mb-2">
                {job.company_name}
              </div>

              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[13px] text-slate-600 font-medium">
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <MapPin size={13} className="text-slate-400" />
                  {location}
                </span>
                <span className="text-slate-300">•</span>
                <span>{empType}</span>
                <span className="text-slate-300">•</span>
                <span>{experience}</span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Clock size={13} className="text-slate-400" />
                  Posted {time}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Bookmark, Apply Now, Save) */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-xl border border-transparent hover:border-slate-200 transition-colors ${saved ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                title={saved ? 'Unsave' : 'Save job'}
              >
                <Bookmark size={20} fill={saved ? '#0062ff' : 'none'} stroke={saved ? '#0062ff' : 'currentColor'} strokeWidth={1.8} />
              </button>
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[13.5px] px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-md transition-all whitespace-nowrap"
              >
                <span>Apply Now</span>
                <ExternalLink size={14} strokeWidth={2.2} />
              </a>
            </div>

            <button
              onClick={handleBookmark}
              className={`w-full border rounded-xl px-5 py-2 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                saved
                  ? 'border-blue-300 bg-white text-blue-600 hover:bg-slate-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart size={15} fill={saved ? '#0062ff' : 'none'} stroke={saved ? '#0062ff' : 'currentColor'} strokeWidth={2} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 mt-6 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13.5px] whitespace-nowrap pb-2.5 border-b-2 transition-all relative ${
                activeTab === tab
                  ? 'text-blue-600 font-bold border-blue-600'
                  : 'text-slate-500 font-medium hover:text-slate-800 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 pb-2 pr-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Description Column */}
          <div className="flex-1 min-w-0 w-full">
            {activeTab === 'Job Description' && (
              <div className="job-description-markdown leading-relaxed">
                {job.description ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {job.description}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm text-slate-600">
                    No detailed job description provided. Click "Apply Now" to view the full job post on {job.company_name}'s career portal.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'About Company' && (
              <div className="space-y-4">
                <h3 className="text-[16px] font-bold text-slate-900">About {job.company_name}</h3>
                <p className="text-[14px] text-slate-800 leading-relaxed">
                  {job.company_name} is a world-class technology company shaping the future of global digital products, infrastructure, and engineering innovation. With thousands of passionate engineers and creatives worldwide, {job.company_name} values innovation, continuous learning, and scalable architecture.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-xs text-slate-500 font-medium">Industry</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">Software & Internet</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-xs text-slate-500 font-medium">Company Size</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">10,000+ Employees</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-xs text-slate-500 font-medium">Primary Office</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{location}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Benefits' && (
              <div className="space-y-4">
                <h3 className="text-[16px] font-bold text-slate-900">Perks & Benefits at {job.company_name}</h3>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Comprehensive Health & Wellness</h4>
                      <p className="text-xs text-slate-600 mt-1">Full medical, dental, and vision insurance for employees and dependents.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Flexible Work Arrangements</h4>
                      <p className="text-xs text-slate-600 mt-1">Hybrid and remote options with generous home-office stipends.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Learning & Development</h4>
                      <p className="text-xs text-slate-600 mt-1">Annual budget for books, certifications, conferences, and courses.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Retirement & Equity</h4>
                      <p className="text-xs text-slate-600 mt-1">Generous ESOP / RSU stock grants and matching retirement plans.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Requirements' && (
              <div className="space-y-4">
                <h3 className="text-[16px] font-bold text-slate-900">Key Requirements</h3>
                <ul className="space-y-2.5 pl-4 list-disc marker:text-blue-600 text-[14px] text-slate-800">
                  <li>Bachelor’s or Master’s degree in Computer Science, Engineering, or related technical field.</li>
                  <li>{experience} of hands-on experience in software engineering and distributed architectures.</li>
                  <li>Proficiency in core tech stack: {skills.join(', ')}.</li>
                  <li>Strong problem-solving abilities and solid understanding of data structures and algorithms.</li>
                  <li>Experience collaborating with cross-functional product and engineering teams.</li>
                </ul>
              </div>
            )}

            {activeTab === 'Skills' && (
              <div className="space-y-4">
                <h3 className="text-[16px] font-bold text-slate-900">Required Skills & Tech Stack</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, i) => (
                    <span key={i} className="bg-slate-100 text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
                      {skill}
                    </span>
                  ))}
                  <span className="bg-slate-100 text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
                    Git & CI/CD
                  </span>
                  <span className="bg-slate-100 text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
                    Agile / Scrum
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-slate-900">4.5</div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">Based on 1,200+ employee reviews</span>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>Work-Life Balance</span>
                      <span className="text-emerald-600 font-bold">4.4 / 5</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>Culture & Values</span>
                      <span className="text-emerald-600 font-bold">4.7 / 5</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>Compensation & Benefits</span>
                      <span className="text-emerald-600 font-bold">4.6 / 5</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Highlights Box */}
          <div className="w-full lg:w-[240px] xl:w-[260px] shrink-0">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
              <h4 className="text-[15px] font-bold text-slate-900 mb-4 tracking-tight">Job Highlights</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[12px] font-semibold text-slate-500 mb-0.5">Role</div>
                  <div className="text-[13.5px] font-bold text-slate-900">{role}</div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-500 mb-0.5">Team</div>
                  <div className="text-[13.5px] font-bold text-slate-900">{team}</div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-500 mb-0.5">Employment Type</div>
                  <div className="text-[13.5px] font-bold text-slate-900">{empType}</div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-500 mb-0.5">Work Model</div>
                  <div className="text-[13.5px] font-bold text-slate-900">{workModel}</div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-500 mb-0.5">Location</div>
                  <div className="text-[13.5px] font-bold text-slate-900">{fullLoc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


