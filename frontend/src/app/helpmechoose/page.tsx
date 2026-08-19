'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Car, Check, ArrowRight } from 'lucide-react';
import PredictiveSelect from '../../components/common/PredictiveSelect';

const USE_CASE_OPTIONS = [
  { value: 'Executive Daily Driver', label: 'Executive Daily Driver', badge: 'Comfort' },
  { value: 'Off-Road & Safari Travel', label: 'Off-Road & Safari Travel', badge: 'Rugged' },
  { value: 'Weekend Performance & Sport', label: 'Weekend Performance & Sport', badge: 'Fast' },
  { value: 'Family Transport', label: 'Family Transport', badge: '7 Seater' }
];

export default function HelpMeChoosePage() {
  const [useCase, setUseCase] = useState('Executive Daily Driver');
  const [budget, setBudget] = useState('15000000');
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleCalculate = () => {
    if (useCase.includes('Off-Road')) {
      setRecommendation('2023 Range Rover Autobiography LWB or Toyota Land Cruiser LC300 ZX');
    } else if (useCase.includes('Performance')) {
      setRecommendation('2024 Porsche Cayenne Turbo E-Hybrid or BMW M8 Competition');
    } else {
      setRecommendation('2024 Mercedes-Benz S 580 4MATIC or Lexus LX 600 VIP');
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#c9a84c] text-black font-extrabold flex items-center justify-center text-base">
              KnK
            </div>
            <span className="text-lg font-black text-white uppercase tracking-wider">KnK <span className="text-[#c9a84c]">Assistant</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Ai Car Advisor</span>
          <h1 className="text-3xl font-black uppercase text-white">Interactive Car Selection Assistant</h1>
          <p className="text-xs text-neutral-400">Match your daily lifestyle requirements to our curated luxury vehicle fleet.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Primary Vehicle Use Case</label>
            <PredictiveSelect options={USE_CASE_OPTIONS} value={useCase} onChange={setUseCase} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Target Budget (KES)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> GENERATE BEST VEHICLE MATCH
          </button>

          {recommendation && (
            <div className="p-6 bg-[#121212] border border-[#c9a84c]/50 rounded-2xl space-y-3">
              <span className="text-[10px] bg-[#c9a84c] text-black font-bold px-2 py-0.5 rounded uppercase">Recommended Match</span>
              <h3 className="text-base font-extrabold text-white">{recommendation}</h3>
              <Link href="/vehicle" className="inline-flex items-center gap-1 text-xs font-bold text-[#c9a84c] hover:underline">
                View Matching Vehicle Dossiers <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
