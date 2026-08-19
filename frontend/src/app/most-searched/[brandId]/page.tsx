'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Car } from 'lucide-react';

export default function BrandDetailPage() {
  const { brandId } = useParams();

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/most-searched" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase">
            <ArrowLeft size={16} /> Back to Brands
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Brand Showcase</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Marque: {String(brandId).toUpperCase()}</h1>
        </div>

        <div className="p-8 bg-[#0a0a0a] border border-neutral-800 rounded-3xl text-center space-y-4">
          <Car size={36} className="text-[#c9a84c] mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase">Curated {String(brandId).toUpperCase()} Inventory</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">Explore all certified pre-owned and brand-new models available in our Nairobi showroom.</p>
          <Link href="/vehicle" className="inline-block px-6 py-3 bg-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase">
            Browse All {String(brandId).toUpperCase()} Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
}
