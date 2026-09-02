import React, { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import TrustedCompanies from '../components/landing/TrustedCompanies';
import ValueProps from '../components/landing/ValueProps';
import StatsBanner from '../components/landing/StatsBanner';
import FeaturedJobs from '../components/landing/FeaturedJobs';
import CtaBanner from '../components/landing/CtaBanner';
import Footer from '../components/landing/Footer';
import JobDetail from '../components/JobDetail';
import { X } from 'lucide-react';

export default function LandingPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <TrustedCompanies />
        <ValueProps />
        <StatsBanner />
        <FeaturedJobs onSelectJob={(job) => setSelectedJob(job)} />
        <CtaBanner />
      </main>

      {/* Footer */}
      <Footer />

      {/* Job Detail Drawer (if opened from featured list) */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedJob(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[640px] bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden animate-slide-in-right">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <JobDetail job={selectedJob} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
