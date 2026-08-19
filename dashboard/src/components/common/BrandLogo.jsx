import React, { useEffect, useState } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { cn } from '@/lib/utils'

/**
 * Universal Brand Logo Component
 * Supports 3 dynamic target locations:
 * - 'sidebar': Left-most side of the header (Admin Sidebar brand panel)
 * - 'topnav': Navigation bar at the top (Admin top header)
 * - 'storefront': Left of the navigation header on client store
 */
export default function BrandLogo({
  size = 'md',
  location = 'sidebar',
  customLogoUrl,
  className,
}) {
  const siteSettings = useCRMStore(state => state.siteSettings) || {}
  const [localSettings, setLocalSettings] = useState(siteSettings)

  // Listen for live setting updates via CustomEvent
  useEffect(() => {
    const handleSettingsUpdated = (e) => {
      if (e.detail) {
        setLocalSettings(e.detail)
      }
    }
    window.addEventListener('knk_settings_updated', handleSettingsUpdated)
    return () => {
      window.removeEventListener('knk_settings_updated', handleSettingsUpdated)
    }
  }, [])

  const currentSettings = { ...siteSettings, ...localSettings }

  let targetLogoUrl = customLogoUrl
  if (!targetLogoUrl) {
    if (location === 'sidebar') {
      targetLogoUrl = currentSettings.adminSidebarLogoUrl || currentSettings.logoUrl
    } else if (location === 'topnav') {
      targetLogoUrl = currentSettings.adminTopNavLogoUrl || currentSettings.logoUrl
    } else if (location === 'storefront') {
      targetLogoUrl = currentSettings.storefrontHeaderLogoUrl || currentSettings.logoUrl
    } else {
      targetLogoUrl = currentSettings.logoUrl
    }
  }

  if (!targetLogoUrl || targetLogoUrl === '/logo.svg') {
    targetLogoUrl = '/images/knk-logo-horizontal.png'
  }

  const imgHeights = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24'
  }

  return (
    <div className={cn("inline-flex items-center select-none group", className)}>
      <img 
        src={targetLogoUrl} 
        alt="KnK Automotive Enterprise Logo" 
        className={cn("w-auto object-contain transition-all duration-300 group-hover:scale-105", imgHeights[size])} 
      />
    </div>
  )
}
