import React from 'react';
import { Search, ShieldCheck, Globe, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'One Search, Everywhere',
    description: 'We pull jobs from 50+ platforms so you never miss an opportunity.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & Fresh',
    description: 'Every job is deduplicated and refreshed daily for accuracy.',
  },
  {
    icon: Globe,
    title: 'India & Remote First',
    description: 'Find the best opportunities across India & remote.',
  },
  {
    icon: Zap,
    title: 'Faster Job Search',
    description: 'Smart filters, saved searches & personalized recommendations.',
  },
];

export default function ValueProps() {
  return (
    <section className="py-14 px-6 bg-white" id="features-section">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-[26px] font-bold text-slate-900 tracking-tight">
          Why tech professionals choose Easy Jobs
        </h2>
      </div>

      <div className="max-w-[1080px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="text-center p-3">
              <div className="w-12 h-12 bg-blue-50/90 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="text-[15.5px] font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
