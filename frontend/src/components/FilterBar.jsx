import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Most relevant' },
  { value: 'recent', label: 'Most recent' },
  { value: 'salary_high', label: 'Salary: High to Low' },
];

export default function FilterBar({ totalCount, sortBy, onSortChange, activeFilters = 1, onOpenFilterModal }) {
  const [showSort, setShowSort] = useState(false);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="flex items-center justify-between py-2.5 px-0.5">
      {/* Total count */}
      <div className="text-[13.5px] text-slate-600 font-medium">
        <span className="font-bold text-slate-900">
          {typeof totalCount === 'number' ? totalCount.toLocaleString() : (totalCount || '0')}
        </span> jobs found
      </div>

      {/* Sort & Filter */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-lg px-3 py-1.5 hover:border-slate-300 shadow-xs transition-colors"
          >
            {currentSort.label}
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showSort ? 'rotate-180' : ''}`} />
          </button>

          {showSort && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 min-w-[170px] z-50 animate-fade-in-up">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onSortChange?.(opt.value);
                      setShowSort(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-[12.5px] rounded-lg transition-colors ${
                      sortBy === opt.value
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <Check size={14} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filters Button */}
        <button
          onClick={onOpenFilterModal}
          className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-lg px-3 py-1.5 hover:border-slate-300 shadow-xs transition-colors"
        >
          <SlidersHorizontal size={13} className="text-slate-500" />
          <span>Filters</span>
          {activeFilters > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center ml-0.5 text-[10px]">
              {activeFilters}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

