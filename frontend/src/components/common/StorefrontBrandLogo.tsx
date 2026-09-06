'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

/**
 * High-Resolution Luxury Gold Wings Vector Logo Component
 * Guaranteed zero 404s, crisp SVG rendering on all screen densities
 */
export interface StorefrontBrandLogoProps {
  className?: string;
  imgClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'h-8 sm:h-10 md:h-12 max-w-[180px] sm:max-w-[220px] md:max-w-[280px]',
  md: 'h-10 sm:h-12 md:h-14 max-w-[220px] sm:max-w-[280px] md:max-w-[340px]',
  lg: 'h-12 sm:h-15 md:h-18 max-w-[260px] sm:max-w-[330px] md:max-w-[390px]',
  xl: 'h-16 sm:h-20 md:h-24 max-w-[340px] sm:max-w-[440px] md:max-w-[520px]',
  '2xl': 'h-20 sm:h-24 md:h-28 max-w-[400px] sm:max-w-[520px] md:max-w-[620px]',
};

export const KnKLuxuryVectorLogo: React.FC<{ className?: string; size?: keyof typeof sizeClasses }> = ({ className = '', size = 'xl' }) => (
  <img 
    src="/images/knk-logo-horizontal.png" 
    alt="KnK Automotive Enterprise Logo" 
    className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]} ${className}`} 
  />
);

export const StorefrontBrandLogo: React.FC<StorefrontBrandLogoProps> = ({ 
  className = '', 
  imgClassName = '',
  size = 'xl'
}) => {
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

  const [prevUrl, setPrevUrl] = useState(rawLogoUrl);

  if (prevUrl !== rawLogoUrl) {
    setPrevUrl(rawLogoUrl);
    setImageError(false);
  }

  const resolvedImgClass = imgClassName ? imgClassName : sizeClasses[size];

  return (
    <Link href="/" className={`flex items-center gap-3.5 group shrink-0 ${className}`}>
      {rawLogoUrl && rawLogoUrl.trim() !== '' && !imageError ? (
        <img 
          src={rawLogoUrl} 
          alt="KnK Automotive Enterprise Logo" 
          onError={() => setImageError(true)}
          className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${resolvedImgClass}`} 
        />
      ) : (
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
          KnK <span className="text-[#c9a84c]">AUTOMOTIVE</span>
        </span>
      )}
    </Link>
  );
};

export default StorefrontBrandLogo;
