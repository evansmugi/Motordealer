'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

export const StorefrontBrandLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { siteSettings } = useStore();
  let logoUrl = siteSettings?.storefrontHeaderLogoUrl || siteSettings?.logoUrl || '/images/knk-logo-horizontal.png';
  if (logoUrl === '/logo.svg' || !logoUrl) {
    logoUrl = '/images/knk-logo-horizontal.png';
  }

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt="KnK Automotive Logo" 
          className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
        />
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#c9a84c] text-black font-extrabold flex items-center justify-center text-base shadow-lg shadow-[#c9a84c]/20">
            KnK
          </div>
          <div>
            <span className="text-lg font-black text-white uppercase tracking-wider">
              KnK <span className="text-[#c9a84c]">Automotive</span>
            </span>
            <span className="block text-[9px] text-neutral-500 uppercase tracking-widest">
              Enterprise Storefront
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default StorefrontBrandLogo;
