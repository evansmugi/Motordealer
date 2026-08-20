'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';

export default function MostSearchedPage() {
  const brands = [
    { id: 'mercedes', name: 'Mercedes-Benz', count: '14 Available', country: 'Germany' },
    { id: 'porsche', name: 'Porsche', count: '8 Available', country: 'Germany' },
    { id: 'landrover', name: 'Land Rover', count: '10 Available', country: 'United Kingdom' },
    { id: 'bmw', name: 'BMW', count: '12 Available', country: 'Germany' },
    { id: 'lexus', name: 'Lexus', count: '6 Available', country: 'Japan' }
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Market Popularity</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Most Searched Automotive Marques</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((b) => (
            <Link key={b.id} href={`/most-searched/${b.id}`} className="bg-[#0a0a0a] border border-neutral-800 hover:border-[#c9a84c] rounded-3xl p-6 transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded uppercase font-mono">{b.country}</span>
                <span className="text-xs text-neutral-500">{b.count}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#c9a84c] transition-colors">{b.name}</h3>
              <div className="text-xs font-bold text-[#c9a84c] flex items-center gap-1">
                Explore Brand Fleet <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
