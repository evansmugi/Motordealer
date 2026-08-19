import React from 'react';

/**
 * KNK Automotive - Universal System & Brand Logo Component
 * 
 * Directly references the official real PNG assets stored in public/images/:
 * - Media 1 (Favicon / Icon Mark): /images/knk-favicon.png
 * - Media 2 (Universal System Logo): /images/KNK Logo 1-4.png
 * - Media 3 (Horizontal Lockup Logo): /images/KNK Logo 1-7.png
 */

export function KNKBlueprintGrid() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <g opacity="0.45" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="3 3">
        <circle cx="200" cy="200" r="185" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="none" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="#38BDF8" opacity="0.5" />
        <circle cx="200" cy="200" r="70" fill="none" stroke="#38BDF8" opacity="0.3" />

        <line x1="200" y1="0" x2="200" y2="400" strokeWidth="1.2" strokeDasharray="none" />
        <line x1="0" y1="200" x2="400" y2="200" strokeWidth="1.2" strokeDasharray="none" />

        <line x1="40" y1="40" x2="360" y2="360" />
        <line x1="360" y1="40" x2="40" y2="360" />

        <text x="205" y="35" fill="#38BDF8" fontSize="10" fontFamily="monospace">APPROVED MARK (R = 185.00mm)</text>
        <text x="205" y="195" fill="#38BDF8" fontSize="10" fontFamily="monospace">CENTER AXIS (0.00°)</text>
      </g>
    </svg>
  );
}

export default function KNKLogo({
  variant = 'primary', // 'primary' | 'horizontal' | 'media3' | 'stacked' | 'icon-only' | 'monochrome' | 'gold-on-black' | 'black-on-white' | 'small'
  colorScheme = 'gold', // 'gold' | 'black' | 'white' | 'chrome'
  size = 320,
  showGrid = false,
  className = ''
}) {
  // Determine graphic source & filters based on variant and theme
  let logoSrc = '/images/KNK Logo 1.png';
  let altText = 'KnK Automotive Approved Universal Logo';

  if (variant === 'icon-only' || variant === 'small' || variant === 'favicon' || variant === 'media1') {
    logoSrc = '/images/knk-favicon.png';
    altText = 'KnK Automotive Approved Wing Favicon Mark (Media 1)';
  } else if (variant === 'horizontal' || variant === 'media3') {
    logoSrc = '/images/knk-logo-horizontal.png';
    altText = 'KnK Automotive Approved Horizontal Logo (Media 3 - knk-logo-horizontal.png)';
  }

  // Theme color filter overrides for Chrome, White, Black variations
  let filterStyle = {};
  if (colorScheme === 'chrome') {
    filterStyle = { filter: 'grayscale(100%) brightness(1.2)' };
  } else if (colorScheme === 'white') {
    filterStyle = { filter: 'brightness(0) invert(1)' };
  } else if (colorScheme === 'black' || variant === 'black-on-white') {
    filterStyle = { filter: 'brightness(0)' };
  }

  // Calculate dimensions based on aspect ratios
  let styleWidth = size;
  let styleHeight = size;

  if (variant === 'horizontal' || variant === 'media3') {
    styleWidth = size * 3.37;
    styleHeight = size;
  } else if (variant === 'primary' || variant === 'stacked') {
    styleWidth = size;
    styleHeight = size;
  }

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: styleWidth, height: styleHeight }}
    >
      <img
        src={logoSrc}
        alt={altText}
        className="w-full h-full object-contain drop-shadow-md transition-all duration-300"
        style={filterStyle}
      />
      {showGrid && <KNKBlueprintGrid />}
    </div>
  );
}
