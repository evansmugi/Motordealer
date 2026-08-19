'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';

export default function BlogDetailPage() {
  const { id } = useParams();

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase">
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <span className="text-xs font-bold text-[#c9a84c] uppercase">KnK Insights</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto py-12 px-6 space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-bold bg-[#c9a84c]/20 text-[#c9a84c] px-3 py-1 rounded-full uppercase font-mono">Customs & Duty</span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">2026 Import Duty Changes: Complete Guide for Kenyan Luxury Car Buyers</h1>
          <div className="flex items-center gap-6 text-xs text-neutral-400 pt-2 border-t border-neutral-900">
            <span className="flex items-center gap-1.5"><User size={14} className="text-[#c9a84c]" /> Executive Chief Editor</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Aug 18, 2026</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> 5 min read</span>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop"
          alt="Import Duty"
          className="w-full h-80 object-cover rounded-3xl border border-neutral-800"
        />

        <div className="text-sm text-neutral-300 space-y-4 leading-relaxed">
          <p>
            Understanding the updated Kenya Revenue Authority (KRA) CRSP valuation schedule is essential for high-net-worth vehicle importers in 2026.
          </p>
          <h3 className="text-lg font-bold text-[#c9a84c] uppercase pt-4">1. Depreciated Valuation Schedule</h3>
          <p>
            Vehicles older than 1 year continue to benefit from standard KRA annual depreciation scales up to the maximum 8-year age restriction threshold.
          </p>
        </div>
      </article>
    </div>
  );
}
