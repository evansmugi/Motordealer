'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

/**
 * High-Resolution Luxury Gold Wings Vector Logo Component
 * Guaranteed zero 404s, crisp SVG rendering on all screen densities
 */
export const KnKLuxuryVectorLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 600 150" 
    className={`h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
  >
    <defs>
      <linearGradient id="knkGoldGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="30%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id="wingGoldGradInline" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="80%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
    </defs>

    {/* Left Gold Wings Mark */}
    <g transform="translate(10, 5)">
      <path d="M 125 135 C 75 90, 45 40, 25 12 C 55 42, 85 85, 125 135 Z" fill="url(#wingGoldGradInline)" />
      <path d="M 125 135 C 85 100, 62 65, 48 35 C 72 65, 98 98, 125 135 Z" fill="url(#wingGoldGradInline)" opacity="0.9" />
      <path d="M 125 135 C 98 108, 80 82, 70 60 C 90 85, 108 110, 125 135 Z" fill="url(#wingGoldGradInline)" opacity="0.8" />

      <path d="M 125 135 C 175 90, 205 40, 225 12 C 195 42, 165 85, 125 135 Z" fill="url(#wingGoldGradInline)" />
      <path d="M 125 135 C 165 100, 188 65, 202 35 C 178 65, 152 98, 125 135 Z" fill="url(#wingGoldGradInline)" opacity="0.9" />
      <path d="M 125 135 C 152 108, 170 82, 180 60 C 160 85, 142 110, 125 135 Z" fill="url(#wingGoldGradInline)" opacity="0.8" />
    </g>

    {/* Right Typography */}
    <g transform="translate(250, 0)">
      <text x="50" y="82" fontFamily="Georgia, 'Times New Roman', serif" fontSize="82" fontWeight="bold" fill="url(#knkGoldGradInline)" letterSpacing="-1">
        KnK
      </text>

      <line x1="10" y1="98" x2="45" y2="98" stroke="url(#knkGoldGradInline)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="27.5" cy="98" r="2.5" fill="#fef08a" />
      
      <line x1="215" y1="98" x2="250" y2="98" stroke="url(#knkGoldGradInline)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="232.5" cy="98" r="2.5" fill="#fef08a" />

      <text x="130" y="122" fontFamily="'Inter', 'Montserrat', sans-serif" fontSize="11.5" fontWeight="700" fill="#d97706" letterSpacing="2.8" textAnchor="middle">
        PREMIUM AUTOMOTIVE SOLUTIONS
      </text>
    </g>
  </svg>
);

export const StorefrontBrandLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { siteSettings } = useStore();
  const [imageError, setImageError] = useState(false);

  let rawLogoUrl: string | undefined = undefined;
  if (siteSettings && siteSettings.storefrontHeaderLogoUrl !== undefined) {
    rawLogoUrl = siteSettings.storefrontHeaderLogoUrl;
  } else if (siteSettings && siteSettings.logoUrl !== undefined) {
    rawLogoUrl = siteSettings.logoUrl;
  } else {
    rawLogoUrl = '/images/knk-logo-horizontal.png';
  }

  // Reset image error state whenever logo URL updates
  useEffect(() => {
    setImageError(false);
  }, [rawLogoUrl]);

  return (
    <Link href="/" className={`flex items-center gap-3.5 group shrink-0 ${className}`}>
      {rawLogoUrl && rawLogoUrl.trim() !== '' && !imageError ? (
        <img 
          src={rawLogoUrl} 
          alt="KnK Automotive Enterprise Logo" 
          onError={() => setImageError(true)}
          className="h-10 sm:h-12 w-auto max-w-[280px] sm:max-w-[360px] object-contain transition-transform duration-300 group-hover:scale-105" 
        />
      ) : (
        <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
          KnK <span className="text-[#c9a84c]">AUTOMOTIVE</span>
        </span>
      )}
    </Link>
  );
};

export default StorefrontBrandLogo;
