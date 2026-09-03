import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

const LOCATIONS = [
  { id: '', label: 'All Cities' },
  { id: 'Bangalore', label: 'Bangalore' },
  { id: 'Hyderabad', label: 'Hyderabad' },
  { id: 'Pune', label: 'Pune' },
  { id: 'Gurgaon', label: 'Gurgaon / Delhi NCR' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'Chennai', label: 'Chennai' },
];

const WORKPLACE_TYPES = [
  { id: '', label: 'All' },
  { id: 'remote', label: 'Remote Only' },
  { id: 'onsite', label: 'In-Office / Hybrid' },
];

const EMPLOYMENT_TYPES = [
  { id: '', label: 'All Types' },
  { id: 'full', label: 'Full-time' },
  { id: 'contract', label: 'Contract' },
  { id: 'intern', label: 'Internship' },
];

const EXPERIENCE_LEVELS = [
  { id: '', label: 'All Levels' },
  { id: '0', label: '0 Yrs (Fresher / Intern / 0–2 Yrs)' },
  { id: '1-2', label: '1 – 2 Yrs (Junior / Associate)' },
  { id: '3-5', label: '3 – 5 Yrs (Mid-Level)' },
  { id: '5+', label: '5+ Yrs (Senior / Lead)' },
];

const DATE_POSTED = [
  { id: '', label: 'Any time' },
  { id: '24h', label: 'Past 24 Hours' },
  { id: '7d', label: 'Past 7 Days' },
  { id: '30d', label: 'Past 30 Days' },
];

export default function FilterModal({ isOpen, onClose, currentFilters, onApply }) {
  const [localFilters, setLocalFilters] = useState({
    location: '',
    workplace: '',
    empType: '',
    experience: '',
    datePosted: '',
  });

  // Sync incoming filters whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        location: currentFilters.location || '',
        workplace: currentFilters.workplace || (currentFilters.remote ? 'remote' : ''),
        empType: currentFilters.empType || '',
        experience: currentFilters.experience || '',
        datePosted: currentFilters.datePosted || '',
      });
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleReset = () => {
    setLocalFilters({
      location: '',
      workplace: '',
      empType: '',
      experience: '',
      datePosted: '',
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount =
    (localFilters.location ? 1 : 0) +
    (localFilters.workplace ? 1 : 0) +
    (localFilters.empType ? 1 : 0) +
    (localFilters.experience ? 1 : 0) +
    (localFilters.datePosted ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] z-10 animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold text-slate-900">Filter Jobs</h3>
            {activeCount > 0 && (
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200/60">
                {activeCount} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar text-left">
          {/* 1. Workplace Type */}
          <div>
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Workplace Type
            </label>
            <div className="flex flex-wrap gap-2">
              {WORKPLACE_TYPES.map((type) => {
                const selected = localFilters.workplace === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setLocalFilters((prev) => ({ ...prev, workplace: type.id }))}
                    className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {selected && <Check size={13} className="stroke-[2.5]" />}
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Location */}
          <div>
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              City / Location
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => {
                const selected = localFilters.location === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setLocalFilters((prev) => ({ ...prev, location: loc.id }))}
                    className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {selected && <Check size={13} className="stroke-[2.5]" />}
                    {loc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Employment Type */}
          <div>
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Job Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((emp) => {
                const selected = localFilters.empType === emp.id;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => setLocalFilters((prev) => ({ ...prev, empType: emp.id }))}
                    className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {selected && <Check size={13} className="stroke-[2.5]" />}
                    {emp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Experience Level */}
          <div>
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Experience Level
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((exp) => {
                const selected = localFilters.experience === exp.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setLocalFilters((prev) => ({ ...prev, experience: exp.id }))}
                    className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {selected && <Check size={13} className="stroke-[2.5]" />}
                    {exp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Date Posted */}
          <div>
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Date Posted
            </label>
            <div className="flex flex-wrap gap-2">
              {DATE_POSTED.map((dp) => {
                const selected = localFilters.datePosted === dp.id;
                return (
                  <button
                    key={dp.id}
                    type="button"
                    onClick={() => setLocalFilters((prev) => ({ ...prev, datePosted: dp.id }))}
                    className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {selected && <Check size={13} className="stroke-[2.5]" />}
                    {dp.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
