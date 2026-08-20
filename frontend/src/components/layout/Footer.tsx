'use client';

import React from 'react';
import Link from 'next/link';
import StorefrontBrandLogo from '../common/StorefrontBrandLogo';
import { ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070c] border-t border-neutral-800 text-neutral-300 pt-16 pb-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Column 1: Brand & Identity */}
        <div className="md:col-span-5 space-y-4">
          <StorefrontBrandLogo />
          <p className="text-xs text-neutral-400 leading-relaxed max-w-md mt-2">
            KnK Automotive Enterprise is East Africa&apos;s premier vehicle showroom and concierge fleet. We deliver verified 150+ point inspected luxury vehicles, bespoke import solutions, and instant credit trade-in valuations.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>Inspection Verified & Approved Luxury Fleet</span>
          </div>
        </div>

        {/* Column 2: Quick Directory */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
            Showroom Directory
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-neutral-300">
            <li>
              <Link href="/vehicle" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Showroom Catalog</span>
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white transition-colors flex items-center gap-2">
                <span>All Cars Inventory</span>
              </Link>
            </li>
            <li>
              <Link href="/trade-in" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Trade-In Valuation</span>
              </Link>
            </li>
            <li>
              <Link href="/finance" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Finance Calculator</span>
              </Link>
            </li>
            <li>
              <Link href="/book-test-drive" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Book Test Drive</span>
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Compare Cars</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Showroom Concierge */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
            Concierge Viewing
          </h4>
          <div className="space-y-2.5 text-xs text-neutral-400">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
              <span>Nairobi Showroom, Kenya</span>
            </div>
            <div className="flex items-center gap-2.5">
              <PhoneCall size={16} className="text-[#c9a84c] shrink-0" />
              <span>+254 700 000 000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#c9a84c] shrink-0" />
              <span>concierge@knkautomotive.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          © {new Date().getFullYear()} KnK Automotive Enterprise. All rights reserved.
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[11px] text-neutral-500">System Telemetry Operational</span>
          
          {/* Subtle, discreet Admin Portal link */}
          <a 
            href="http://localhost:5181" 
            target="_blank" 
            rel="noreferrer noopener" 
            className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors font-mono tracking-wider underline decoration-neutral-700/60"
            title="System Gateway"
          >
            Admin Portal
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
