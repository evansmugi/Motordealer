'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

export const StorefrontBrandLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { siteSettings } = useStore();
  const [imageError, setImageError] = useState(false);

  let rawLogoUrl = siteSettings?.storefrontHeaderLogoUrl || siteSettings?.logoUrl;
  if (rawLogoUrl === '/logo.svg' || rawLogoUrl === '/images/knk-logo-horizontal.png') {
    rawLogoUrl = '';
  }

  // Reset image error state whenever logo URL updates
  useEffect(() => {
    setImageError(false);
  }, [rawLogoUrl]);

  return (
    <Link href="/" className={`flex items-center gap-3.5 group shrink-0 ${className}`}>
      {rawLogoUrl && !imageError ? (
        <img 
          src={rawLogoUrl} 
          alt="KnK Automotive Enterprise Logo" 
          onError={() => setImageError(true)}
          className="h-12 sm:h-14 w-auto max-w-[240px] sm:max-w-[320px] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_12px_rgba(201,168,76,0.35)]" 
        />
      ) : (
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fef08a] via-[#e5c158] to-[#c9a84c] text-black font-black flex items-center justify-center text-lg shadow-xl shadow-[#c9a84c]/25 border border-[#fef08a]/60 group-hover:scale-105 transition-transform">
            KnK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-[#c9a84c] transition-colors">
                KnK AUTOMOTIVE
              </span>
              <span className="bg-[#c9a84c]/20 border border-[#c9a84c]/50 text-[#c9a84c] text-[10px] font-black px-2 py-0.5 rounded-md tracking-widest uppercase shadow-sm">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono tracking-wider font-semibold">PREMIER VEHICLE SHOWROOM</p>
          </div>
        </div>
      )}
    </Link>
  );
};

export default StorefrontBrandLogo;
