'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function StorefrontBrandIdentityPage() {
  const { siteSettings } = useStore();
  const logoUrl = siteSettings?.storefrontHeaderLogoUrl || siteSettings?.logoUrl || '/images/knk-logo-horizontal.png';

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Brand Standards</span>
          <h1 className="text-3xl font-black uppercase text-white">KnK Automotive Brand Matrix</h1>
          <p className="text-xs text-neutral-400">Official logotypes, luxury color tokens, and press media assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#c9a84c] uppercase">Media 1: Favicon Emblem</h3>
            <div className="h-36 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#c9a84c] text-black font-black flex items-center justify-center text-lg">
                KnK
              </div>
            </div>
            <a href="/favicon.png" download="knk-emblem.png" className="w-full py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl flex items-center justify-center gap-2">
              <Download size={14} /> Download Emblem
            </a>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#c9a84c] uppercase">Media 2: Universal System Logo</h3>
            <div className="h-36 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-center p-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Universal Logo" className="max-h-20 w-auto object-contain" />
              ) : (
                <div className="text-lg font-black text-white uppercase">
                  KnK <span className="text-[#c9a84c]">AUTOMOTIVE</span>
                </div>
              )}
            </div>
            <a href={logoUrl} download="knk-system-logo.png" className="w-full py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl flex items-center justify-center gap-2">
              <Download size={14} /> Download Vector Logo
            </a>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#c9a84c] uppercase">Media 3: Header Lockup</h3>
            <div className="h-36 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-center text-center p-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Storefront Header Logo Lockup (.PNG)" className="max-h-24 w-auto object-contain" />
              ) : (
                <span className="text-xs font-black text-[#c9a84c] uppercase tracking-widest">KnK AUTOMOTIVE ENTERPRISE</span>
              )}
            </div>
            <a href={logoUrl} download="knk-header-logo.png" className="w-full py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl flex items-center justify-center gap-2">
              <Download size={14} /> Download Lockup (.PNG)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
