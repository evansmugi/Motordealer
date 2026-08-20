'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Car } from 'lucide-react';

export default function FunnelPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">

      <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Guided Process</span>
          <h1 className="text-4xl font-black uppercase text-white">Your 4-Step Luxury Purchase Funnel</h1>
          <p className="text-xs text-neutral-400">Transparent steps from vehicle discovery to doorstep delivery.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c] font-black flex items-center justify-center text-sm shrink-0">
              01
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">Dossier Selection & Verification</h3>
              <p className="text-xs text-neutral-400 mt-1">Select from our verified 150-point inspected fleet or request a custom import specification.</p>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c] font-black flex items-center justify-center text-sm shrink-0">
              02
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">Private Showroom Viewing & Test Drive</h3>
              <p className="text-xs text-neutral-400 mt-1">Book an exclusive viewing session with a dedicated relationship concierge.</p>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c] font-black flex items-center justify-center text-sm shrink-0">
              03
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">Trade-In Valuation or Asset Lease</h3>
              <p className="text-xs text-neutral-400 mt-1">Offset your existing car value or structure pre-approved bank financing terms.</p>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c] font-black flex items-center justify-center text-sm shrink-0">
              04
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">Final Delivery & Warranty Activation</h3>
              <p className="text-xs text-neutral-400 mt-1">Doorstep transport delivery with 1-year bumper-to-bumper warranty certificate.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/vehicle" className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-black font-extrabold text-xs rounded-xl uppercase">
            Start Your Journey <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
