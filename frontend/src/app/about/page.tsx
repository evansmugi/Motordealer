'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#c9a84c] text-black font-extrabold flex items-center justify-center text-base">
              KnK
            </div>
            <span className="text-lg font-black text-white uppercase tracking-wider">KnK <span className="text-[#c9a84c]">Automotive</span></span>
          </Link>
          <Link href="/vehicle" className="text-xs font-bold text-[#c9a84c] hover:underline uppercase">Browse Fleet</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-16 px-6 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Our Heritage</span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">East Africa's Benchmark In Luxury Mobility</h1>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            KnK Automotive Enterprise provides VIP vehicle procurement, bespoke international imports, and certified luxury pre-owned cars across Kenya and East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl space-y-3">
            <ShieldCheck className="text-[#c9a84c]" size={32} />
            <h3 className="text-base font-bold text-white uppercase">150-Point Inspection</h3>
            <p className="text-xs text-neutral-400">Every car in our inventory undergoes rigorous mechanical, diagnostic, and chassis verification.</p>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl space-y-3">
            <Award className="text-[#c9a84c]" size={32} />
            <h3 className="text-base font-bold text-white uppercase">Bespoke Importation</h3>
            <p className="text-xs text-neutral-400">Direct sourcing from UK, Japan, Australia, and South Africa with guaranteed customs duty clearance.</p>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl space-y-3">
            <Users className="text-[#c9a84c]" size={32} />
            <h3 className="text-base font-bold text-white uppercase">VIP Concierge</h3>
            <p className="text-xs text-neutral-400">Dedicated relationship advisors offering trade-ins, asset financing, and door-step viewing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
