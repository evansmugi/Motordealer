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
    viewBox="0 0 1000 300" 
    className={`h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
  >
    <defs>
      <linearGradient id="knkGoldGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="25%" stopColor="#f59e0b" />
        <stop offset="60%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id="wingGoldGradInline" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="30%" stopColor="#d97706" />
        <stop offset="70%" stopColor="#f59e0b" />
        <stop offset="90%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="dividerGradInline" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b45309" stopOpacity="0.2" />
        <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.9" />
        <stop offset="70%" stopColor="#fde68a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    <g transform="translate(40, 20)">
      <path d="M 210 260 C 130 180, 70 90, 40 20 C 100 70, 150 160, 210 260 Z" fill="url(#wingGoldGradInline)" />
      <path d="M 210 260 C 145 195, 95 125, 65 60 C 115 110, 165 185, 210 260 Z" fill="url(#wingGoldGradInline)" opacity="0.95" />
      <path d="M 210 260 C 160 210, 120 155, 95 105 C 135 150, 175 205, 210 260 Z" fill="url(#wingGoldGradInline)" opacity="0.88" />

      <path d="M 210 260 C 290 180, 350 90, 380 20 C 320 70, 270 160, 210 260 Z" fill="url(#wingGoldGradInline)" />
      <path d="M 210 260 C 275 195, 325 125, 355 60 C 305 110, 255 185, 210 260 Z" fill="url(#wingGoldGradInline)" opacity="0.95" />
      <path d="M 210 260 C 260 210, 300 155, 325 105 C 285 150, 245 205, 210 260 Z" fill="url(#wingGoldGradInline)" opacity="0.88" />
    </g>

    <line x1="490" y1="35" x2="490" y2="265" stroke="url(#dividerGradInline)" strokeWidth="3" strokeLinecap="round" />

    <g transform="translate(540, 0)">
      <text x="30" y="145" fontFamily="Georgia, 'Times New Roman', serif" fontSize="140" fontWeight="bold" fill="url(#knkGoldGradInline)" letterSpacing="-2">
        KnK
      </text>

      <g transform="translate(0, 195)">
        <line x1="0" y1="-8" x2="60" y2="-8" stroke="url(#knkGoldGradInline)" strokeWidth="3" strokeLinecap="round" />
        <text x="75" y="0" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontSize="28" fontWeight="900" fill="#FFFFFF" letterSpacing="12">
          AUTOMOTIVE
        </text>
        <line x1="340" y1="-8" x2="400" y2="-8" stroke="url(#knkGoldGradInline)" strokeWidth="3" strokeLinecap="round" />
      </g>

      <text x="200" y="245" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontSize="17" fontWeight="700" fill="#D97706" letterSpacing="5" textAnchor="middle">
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
