import React from 'react';

// Brand SVG logos as React components matching reference design
export const BrandLogos = {
  google: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  ),
  microsoft: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10" height="10" rx="1" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" rx="1" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" rx="1" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" rx="1" fill="#FFB900"/>
    </svg>
  ),
  swiggy: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="7" fill="#FC8019"/>
      <path d="M12 4.2C8.8 4.2 6.2 6.8 6.2 10c0 4.1 5.8 10 5.8 10s5.8-5.9 5.8-10c0-3.2-2.6-5.8-5.8-5.8zm0 8.2c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4z" fill="white"/>
    </svg>
  ),
  atlassian: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0052CC"/>
      <path d="M8.38 10.26c-.2-.3-.53-.28-.7.05L3.73 19.4c.16.32.46.6.82.6h5.4c.32 0 .6-.2.74-.5.78-1.68-.1-5.58-2.31-9.24z" fill="#2684FF"/>
      <path d="M11.64 3.2c-2.44 4.34-2.6 8.1-.5 11.5.14.22.4.3.64.3h5.36c.36 0 .66-.28.82-.6L12.34 3.26c-.18-.32-.52-.34-.7-.06z" fill="#FFFFFF"/>
    </svg>
  ),
  phonepe: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#5f259f"/>
      <text x="12" y="17" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" fill="white" textAnchor="middle">पे</text>
    </svg>
  ),
  razorpay: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#021f4c"/>
      <path d="M9.5 5.5L6.8 18.5h2.8l1.1-4.8h3.2L15.5 5.5H9.5z" fill="#3395FF"/>
      <path d="M13.8 13.7h-3.2l-.6 2.8h3.2l.6-2.8z" fill="white"/>
    </svg>
  ),
  chargebee: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FFF"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 17.5c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z" fill="#FF5C35"/>
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#FF5C35"/>
      <circle cx="12" cy="12" r="2.2" fill="#FF5C35"/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="#FF5C35" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  freshworks: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0C1B2A"/>
      <path d="M12 4C12 4 12 8 8 10C4 12 4 12 4 12C4 12 8 12 10 16C12 20 12 20 12 20C12 20 12 16 16 14C20 12 20 12 20 12C20 12 16 12 14 8C12 4 12 4 12 4Z" fill="url(#fw-grad)"/>
      <defs>
        <linearGradient id="fw-grad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD100"/>
          <stop offset="0.33" stopColor="#FF4D4D"/>
          <stop offset="0.66" stopColor="#9C27B0"/>
          <stop offset="1" stopColor="#00E5FF"/>
        </linearGradient>
      </defs>
    </svg>
  ),
};

// Avatar palette for companies without logo
export const AVATAR_PALETTES = [
  { bg: "#eff6ff", text: "#1d4ed8" },
  { bg: "#f0fdf4", text: "#15803d" },
  { bg: "#faf5ff", text: "#7e22ce" },
  { bg: "#fff7ed", text: "#c2410c" },
  { bg: "#fef2f2", text: "#b91c1c" },
  { bg: "#f0fdfa", text: "#0f766e" },
  { bg: "#eef2ff", text: "#4338ca" },
];

export function getCompanyLogo(companyName) {
  if (!companyName) return null;
  const clean = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const key in BrandLogos) {
    if (clean.includes(key)) {
      return { type: 'svg', logo: BrandLogos[key] };
    }
  }
  // Fallback: generate avatar
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palette = AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
  const initial = companyName.trim().charAt(0).toUpperCase() || "J";
  return { type: 'avatar', initial, bg: palette.bg, color: palette.text };
}

