'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StorefrontBrandLogo from '../common/StorefrontBrandLogo';
import { 
  ShieldCheck, PhoneCall, Mail, MapPin, Lock, Send, Clock, 
  Car, Sparkles, ArrowRight, Award, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#05070c] border-t-2 border-neutral-800/80 text-neutral-300 pt-16 pb-10 transition-all font-sans relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        {/* ========================================================================= */}
        {/* TOP VIP NEWSLETTER BANNER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#0c1220] via-[#090d16] to-[#0c1220] border border-[#c9a84c]/40 rounded-3xl p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Sparkles size={12} /> VIP CONCIERGE DIRECTORY
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Join the Exclusive KnK Automotive VIP Club
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Receive priority notifications on new luxury vehicle arrivals, rare import allocations, and private showroom events.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>Thank you! Your email is registered for VIP alerts.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full lg:w-auto max-w-md">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#050810] border border-neutral-700 text-white placeholder:text-neutral-500 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#c9a84c] via-[#e5c158] to-[#c9a84c] text-black font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN 5-COLUMN FOOTER DIRECTORY */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Heritage (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <StorefrontBrandLogo />
            <p className="text-xs text-neutral-400 leading-relaxed mt-3">
              KnK Automotive Enterprise is East Africa&apos;s premier luxury vehicle showroom and executive fleet marketplace. We deliver verified 150+ point inspected luxury cars, bespoke importations, and instant trade-in appraisals.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck size={16} className="shrink-0" />
                <span>150+ Point Inspection Verified Fleet</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c9a84c]">
                <Award size={16} className="shrink-0" />
                <span>Same-Day Logbook & Ownership Transfer</span>
              </div>
            </div>
          </div>

          {/* Column 2: Vehicle Inventory (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#c9a84c] pb-1 border-b border-neutral-800">
              Vehicle Fleet
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-300">
              <li>
                <Link href="/vehicle" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Showroom Catalog</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>All Cars Directory</span>
                </Link>
              </li>
              <li>
                <Link href="/most-searched" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Popular Brands</span>
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Parts & Accessories</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Concierge Services (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#c9a84c] pb-1 border-b border-neutral-800">
              Concierge Services
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-300">
              <li>
                <Link href="/trade-in" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Trade-In Valuation</span>
                </Link>
              </li>
              <li>
                <Link href="/book-test-drive" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Book Test Drive</span>
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Finance Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Compare Vehicles</span>
                </Link>
              </li>
              <li>
                <Link href="/import-with-us" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Bespoke Imports</span>
                </Link>
              </li>
              <li>
                <Link href="/helpmechoose" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>AI Car Advisor</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Enterprise Directory (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#c9a84c] pb-1 border-b border-neutral-800">
              Company & Media
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-300">
              <li>
                <Link href="/about" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>About Enterprise</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>News & Buying Guides</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Contact & Showrooms</span>
                </Link>
              </li>
              <li>
                <Link href="/brand-identity" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Brand Identity</span>
                </Link>
              </li>
              <li>
                <Link href="/funnel" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-neutral-500" />
                  <span>Purchase Journey</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Showroom Concierge Contact (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#c9a84c] pb-1 border-b border-neutral-800">
              Showroom Contact
            </h4>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <span className="leading-snug">Westlands Expressway, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall size={16} className="text-[#c9a84c] shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#c9a84c] shrink-0" />
                <span>concierge@knk.com</span>
              </div>
              <div className="flex items-start gap-2.5 text-neutral-400">
                <Clock size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <span className="leading-snug">Mon - Sat: 8:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* FOOTER BOTTOM BAR WITH PROMINENT ADMIN PORTAL LINK */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} KnK Automotive Enterprise. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-neutral-500">
              Nairobi, Kenya • KES / USD Supported
            </span>
            
            {/* Prominent Admin Portal Button Link */}
            <a 
              href="http://localhost:5181" 
              target="_blank" 
              rel="noreferrer noopener" 
              className="px-4 py-2 rounded-xl bg-neutral-900 border-2 border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 group cursor-pointer"
              title="Access Admin Management Portal"
            >
              <Lock size={14} className="group-hover:rotate-12 transition-transform" />
              <span>Admin Portal</span>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
