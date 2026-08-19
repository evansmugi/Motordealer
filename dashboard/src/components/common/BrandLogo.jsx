import React from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { cn } from '@/lib/utils'

/**
 * Universal Brand Logo Component
 * 
 * Directly renders the official main logo: KNK Logo 1-7.png
 * (Wing Emblem + KnK Wordmark + Premium Automotive Solutions)
 */
export default function BrandLogo({
  size = 'md',
  customLogoUrl,
  className,
}) {
  const siteSettings = useCRMStore(state => state.siteSettings) || {}
  let logoUrl = customLogoUrl || siteSettings.logoUrl || '/images/knk-logo-horizontal.png'
  if (logoUrl === '/logo.svg' || !logoUrl) {
    logoUrl = '/images/knk-logo-horizontal.png'
  }

  const imgHeights = {
    sm: 'h-12 sm:h-14',
    md: 'h-16 sm:h-18',
    lg: 'h-20 sm:h-24'
  }

  return (
    <div className={cn("inline-flex items-center select-none group", className)}>
      <img 
        src={logoUrl} 
        alt="KnK Automotive Logo" 
        className={cn("w-auto object-contain transition-transform duration-300 group-hover:scale-102", imgHeights[size])} 
      />
    </div>
  )
}
