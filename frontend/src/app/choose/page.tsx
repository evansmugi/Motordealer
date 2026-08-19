'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Check, ArrowLeft } from 'lucide-react';

export default function VehicleComparisonPage() {
  const cars = [
    {
      title: '2024 Mercedes-Benz S 580',
      price: 'KES 24,500,000',
      engine: '4.0L V8 Biturbo',
      hp: '496 HP',
      fuel: 'Petrol',
      transmission: '9-Speed Auto',
      seats: '5 Executive'
    },
    {
      title: '2024 Porsche Cayenne Turbo',
      price: 'KES 28,000,000',
      engine: '4.0L V8 Hybrid',
      hp: '729 HP',
      fuel: 'PHEV',
      transmission: '8-Speed PDK',
      seats: '5 Sport'
    },
    {
      title: '2023 Range Rover Autobiography',
      price: 'KES 32,500,000',
      engine: '4.4L Twin-Turbo V8',
      hp: '523 HP',
      fuel: 'Petrol',
      transmission: '8-Speed Auto',
      seats: '4 Executive LWB'
    }
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/vehicle" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase">
            <ArrowLeft size={16} /> Back to Inventory
          </Link>
          <span className="text-sm font-bold text-[#c9a84c] uppercase">Vehicle Comparison Matrix</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-12 px-6 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Side-By-Side Spec Audit</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Vehicle Comparison Matrix</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((c, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white uppercase">{c.title}</h3>
              <div className="text-xl font-black text-[#c9a84c]">{c.price}</div>

              <div className="space-y-3 text-xs border-t border-neutral-900 pt-4">
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Engine</span>
                  <span className="font-semibold text-white">{c.engine}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Power Output</span>
                  <span className="font-semibold text-white">{c.hp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Fuel System</span>
                  <span className="font-semibold text-white">{c.fuel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Transmission</span>
                  <span className="font-semibold text-white">{c.transmission}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Seating Layout</span>
                  <span className="font-semibold text-white">{c.seats}</span>
                </div>
              </div>

              <Link href="/book-test-drive" className="w-full block py-2.5 bg-[#c9a84c] text-black text-center font-bold text-xs rounded-xl uppercase">
                Compare Drive
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
