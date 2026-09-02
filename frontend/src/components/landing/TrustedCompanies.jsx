import React from 'react';

const COMPANIES = [
  { name: 'Google', logo: '/assets/logos/google.svg', heightClass: 'h-[32px]' },
  { name: 'Microsoft', logo: '/assets/logos/microsoft.svg', heightClass: 'h-[32px]' },
  { name: 'Amazon', logo: '/assets/logos/amazon.svg', heightClass: 'h-[30px]' },
  { name: 'TCS', logo: '/assets/logos/tcs.svg', heightClass: 'h-[30px]' },
  { name: 'Infosys', logo: '/assets/logos/infosys.svg', heightClass: 'h-[32px]' },
  { name: 'PhonePe', logo: '/assets/logos/phonepe.svg', heightClass: 'h-[30px]' },
  { name: 'Zoho', logo: '/assets/logos/zoho.svg', heightClass: 'h-[30px]' },
];

export default function TrustedCompanies() {
  return (
    <section className="trusted-companies-section py-8 px-6 text-center border-b border-slate-100 bg-white" id="companies-section">
      <p className="trusted-label text-[11.5px] font-semibold text-slate-400 mb-5 tracking-wide uppercase">
        Trusted by job seekers from top companies
      </p>
      <div className="company-logos-row max-w-[1080px] mx-auto flex items-center justify-center flex-wrap lg:flex-nowrap gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {COMPANIES.map((company) => (
          <div
            key={company.name}
            className="logo-item shrink-0 px-2 sm:px-3 h-[42px] flex items-center justify-center cursor-default"
            title={company.name}
          >
            <img
              src={company.logo}
              alt={company.name}
              className={`${company.heightClass} max-w-full w-auto object-contain block`}
              loading="lazy"
            />
          </div>
        ))}

        {/* & more label aligned to exact horizontal center */}
        <div className="shrink-0 px-2 h-[42px] flex items-center justify-center">
          <span className="company-more-text text-[13.5px] text-slate-400 font-semibold whitespace-nowrap">
            &amp; more
          </span>
        </div>
      </div>
    </section>
  );
}
