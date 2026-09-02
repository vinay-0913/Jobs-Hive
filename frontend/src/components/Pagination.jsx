import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-2 pt-4 pb-2 px-1 border-t border-slate-200/70 shrink-0">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="bg-white hover:border-slate-300 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-700 flex items-center gap-1 shadow-2xs transition-all"
        title="Previous Page"
      >
        <ChevronLeft size={15} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && <span className="text-slate-400 text-xs px-0.5">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
              p === currentPage
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-slate-400 text-xs px-0.5">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="bg-white hover:border-slate-300 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-700 flex items-center gap-1 shadow-2xs transition-all"
        title="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

