'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Check, Download, ArrowLeft } from 'lucide-react';

export default function StorefrontBrandIdentityPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase">
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
          <span className="text-sm font-bold text-[#c9a84c] uppercase">Official Brand Guidelines</span>
        </div>
      </header>

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
            <button className="w-full py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl flex items-center justify-center gap-2">
              <Download size={14} /> Download Emblem
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#c9a84c] uppercase">Media 2: Universal System Logo</h3>
            <div className="h-36 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-center">
              <div className="text-lg font-black text-white uppercase">
                KnK <span className="text-[#c9a84c]">AUTOMOTIVE</span>
              </div>
            </div>
            <button className="w-full py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl flex items-center justify-center gap-2">
              <Download size={14} /> Download Vector Logo
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#c9a84c] uppercase">Media 3: Header Lockup</h3>
            <div className="h-36 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-center text-center p-4">
              <span className="text-xs font-black text-[#c9a84c] uppercase tracking-widest">KnK AUTOMOTIVE ENTERPRISE</span>
            </div>
            <button className="w-full py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl flex items-center justify-center gap-2">
              <Download size={14} /> Download Lockup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
