'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto py-16 px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Connect With Us</span>
          <h1 className="text-4xl font-black uppercase text-white tracking-tight">Executive Showroom Concierge</h1>
          <p className="text-xs text-neutral-400">Visit our flagship showroom or submit an immediate callback request.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white uppercase">Contact Information</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Showroom Address</div>
                  <div className="text-neutral-400 mt-0.5">KnK Towers, Westlands Rd, Nairobi, Kenya</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Direct Telephone</div>
                  <div className="text-neutral-400 mt-0.5">+254 700 000 000 / +254 711 000 000</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Concierge Email</div>
                  <div className="text-neutral-400 mt-0.5">vip@knkautomotive.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Showroom Hours</div>
                  <div className="text-neutral-400 mt-0.5">Mon - Sat: 08:00 AM - 07:00 PM (Sun by VIP Appointment)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <Check size={32} className="text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase">Callback Request Logged</h3>
                <p className="text-xs text-neutral-400">Our relationship advisor will call you within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white uppercase">Request Instant Callback</h3>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="Sir James Harrison" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Phone Number *</label>
                    <input type="tel" required placeholder="+254 700 000 000" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
                    <input type="email" placeholder="james@example.com" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Inquiry Details</label>
                  <textarea rows={3} placeholder="Vehicle of interest or custom import request..." className="w-full bg-[#121212] border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none" />
                </div>

                <button type="submit" className="w-full py-3 bg-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                  <Send size={16} /> Submit Callback Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
