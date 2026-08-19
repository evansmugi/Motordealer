'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ShieldCheck, Check, DollarSign, ArrowRight, Plane } from 'lucide-react';
import PredictiveSelect from '../../components/common/PredictiveSelect';

const COUNTRY_OPTIONS = [
  { value: 'United Kingdom (UK)', label: 'United Kingdom (UK)', badge: 'Right Hand Drive' },
  { value: 'Japan', label: 'Japan', badge: 'Fast Transit' },
  { value: 'Australia', label: 'Australia', badge: 'High Spec' },
  { value: 'South Africa', label: 'South Africa', badge: 'SUV Specialist' }
];

export default function ImportWithUsPage() {
  const [sourceCountry, setSourceCountry] = useState('United Kingdom (UK)');
  const [fobPrice, setFobPrice] = useState('35000');
  const [engineCc, setEngineCc] = useState('3000');
  const [year, setYear] = useState('2022');
  const [submitted, setSubmitted] = useState(false);

  // Duty calculation formula
  const numericFob = parseFloat(fobPrice) || 0;
  const cifEstimate = numericFob * 1.15; // Freight & Insurance
  const importDuty = cifEstimate * 0.35; // 35% Import Duty
  const exciseDuty = (cifEstimate + importDuty) * 0.20; // 20% Excise
  const vat = (cifEstimate + importDuty + exciseDuty) * 0.16; // 16% VAT
  const totalCustomsTax = importDuty + exciseDuty + vat;
  const estimatedLandedKes = Math.round((cifEstimate + totalCustomsTax) * 165);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#c9a84c] text-black font-extrabold flex items-center justify-center text-base">
              KnK
            </div>
            <span className="text-lg font-black text-white uppercase tracking-wider">KnK <span className="text-[#c9a84c]">Imports</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Bespoke Importation</span>
          <h1 className="text-4xl font-black uppercase text-white tracking-tight">Custom Vehicle Import & Duty Calculator</h1>
          <p className="text-xs text-neutral-400">Import your exact specification luxury car with guaranteed KRA clearance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-[#c9a84c] uppercase flex items-center gap-2">
              <Calculator size={18} /> Customs Clearance Duty Estimator
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Origin Country</label>
                <PredictiveSelect options={COUNTRY_OPTIONS} value={sourceCountry} onChange={setSourceCountry} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">FOB Value (£ / $)</label>
                  <input
                    type="number"
                    value={fobPrice}
                    onChange={(e) => setFobPrice(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Engine CC</label>
                  <input
                    type="number"
                    value={engineCc}
                    onChange={(e) => setEngineCc(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Reg Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="p-6 bg-[#121212] border border border-[#c9a84c]/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Estimated Customs Duty (KES)</span>
                <span className="font-bold text-white">KES {Math.round(totalCustomsTax * 165).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-neutral-800 pt-3">
                <span className="font-extrabold text-white uppercase">Est. Total Landed Cost</span>
                <span className="text-xl font-black text-[#c9a84c]">KES {estimatedLandedKes.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Import Order Form */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase">Submit Import Order Request</h3>
            {submitted ? (
              <div className="p-6 text-center text-emerald-400 text-xs font-bold space-y-2">
                <Check size={28} className="mx-auto" />
                <p>Import sourcing order received! An import specialist will contact you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Target Car (Make / Model)</label>
                  <input type="text" required placeholder="e.g. 2023 Porsche Taycan 4S" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Your Full Name</label>
                  <input type="text" required placeholder="Alexander Vance" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Phone Number</label>
                  <input type="tel" required placeholder="+254 700 000 000" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider">
                  INITIATE IMPORT SOURCING
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
