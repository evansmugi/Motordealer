'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, ChevronRight, ArrowRight, Zap } from 'lucide-react';
import PredictiveSelect from '../components/common/PredictiveSelect';

import { useStore } from '../context/StoreContext';
import { VEHICLES } from '../lib/vehicle-dataset';

const MAKE_OPTIONS = [
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz', badge: 'German' },
  { value: 'BMW', label: 'BMW', badge: 'German' },
  { value: 'Audi', label: 'Audi', badge: 'German' },
  { value: 'Porsche', label: 'Porsche', badge: 'German' },
  { value: 'Land Rover', label: 'Land Rover', badge: 'British' },
  { value: 'Lexus', label: 'Lexus', badge: 'Japanese' }
];

const BODY_OPTIONS = [
  { value: 'SUV', label: 'Luxury SUV' },
  { value: 'Sedan', label: 'Executive Sedan' },
  { value: 'Coupe', label: 'Sport Coupe' },
  { value: 'Convertible', label: 'Roadster' }
];

const PRICE_OPTIONS = [
  { value: '5000000', label: 'Under KES 5 Million' },
  { value: '10000000', label: 'KES 5M - 10M' },
  { value: '20000000', label: 'KES 10M - 20M' },
  { value: '50000000', label: 'KES 20M+ Flagship' }
];

export default function HomePage() {
  const [selectedMake, setSelectedMake] = useState('Mercedes-Benz');
  const [selectedBody, setSelectedBody] = useState('SUV');
  const [selectedPrice, setSelectedPrice] = useState('20000000');

  const { vehicles: storeVehicles, formatPrice } = useStore();
  const rawList = storeVehicles && storeVehicles.length > 0 ? storeVehicles : VEHICLES;
  
  const featuredItems = rawList.filter((v: any) => Boolean(v.isFeatured || v.is_featured || v.offer_type === 'Featured' || (Array.isArray(v.badges) && v.badges.includes('FEATURED'))));

  const displayList = featuredItems.length > 0 ? featuredItems : rawList.slice(0, 6);

  const featuredCars = displayList.map((v: any) => ({
    id: v.id,
    title: `${v.year || 2024} ${v.make || ''} ${v.model || ''} ${v.trim ? v.trim : ''}`.trim(),
    make: v.make || 'Mercedes-Benz',
    model: v.model || 'Luxury Model',
    price: formatPrice(v.pricing?.cashPrice || v.price || 24500000),
    image: v.heroImage || (Array.isArray(v.images) && v.images[0] && (v.images[0].url || v.images[0])) || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    year: String(v.year || 2024),
    mileage: v.history?.odometerKm ? `${Number(v.history.odometerKm).toLocaleString()} KM` : (v.mileage || '45 KM'),
    fuel: typeof v.fuelEnergy === 'object' ? (v.fuelEnergy.fuelType || 'Petrol') : (v.fuel_type || 'Petrol'),
    transmission: typeof v.transmission === 'object' ? (v.transmission.type || 'Automatic') : (v.transmission || 'Automatic'),
    features: v.features ? (Array.isArray(v.features) ? v.features.flatMap((f: any) => typeof f === 'string' ? f : (f.items || [])) : []) : ['Burmester 3D Sound', 'Panoramic Sunroof'],
    isFeatured: Boolean(v.isFeatured || v.is_featured || v.offer_type === 'Featured' || (Array.isArray(v.badges) && v.badges.includes('FEATURED')))
  }));

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c9a84c]/10 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-semibold">
              <Zap size={14} /> East Africa's Premier Luxury Fleet
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Drive The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5c158] via-[#c9a84c] to-[#997926]">Pinnacle</span> Of Automotive Engineering.
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              KnK Automotive provides verified, high-specification luxury vehicles, bespoke import services, and comprehensive concierge trade-in support.
            </p>

            {/* Predictive Filter Bar */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
              <h3 className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                <Search size={14} /> Instant Inventory Finder
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 font-semibold mb-1">Make</label>
                  <PredictiveSelect
                    options={MAKE_OPTIONS}
                    value={selectedMake}
                    onChange={setSelectedMake}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 font-semibold mb-1">Body Style</label>
                  <PredictiveSelect
                    options={BODY_OPTIONS}
                    value={selectedBody}
                    onChange={setSelectedBody}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 font-semibold mb-1">Budget Range</label>
                  <PredictiveSelect
                    options={PRICE_OPTIONS}
                    value={selectedPrice}
                    onChange={setSelectedPrice}
                  />
                </div>
              </div>

              <Link
                href="/vehicle"
                className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#e5c158] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                Search {selectedMake} Vehicles <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#c9a84c]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop"
                alt="Luxury Vehicle"
                className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0d0d0d]/80 backdrop-blur-xl border border-neutral-800 rounded-2xl">
                <span className="text-[10px] bg-[#c9a84c] text-black font-extrabold px-2 py-0.5 rounded uppercase">Featured Flagship</span>
                <h4 className="text-base font-extrabold text-white mt-1">2024 Mercedes-Benz S 580 4MATIC</h4>
                <p className="text-xs text-[#c9a84c] font-bold mt-0.5">KES 24,500,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="py-16 px-6 bg-[#0a0a0a] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">KnK Showroom</span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight mt-1">Featured Inventory Dossiers</h2>
            </div>
            <Link
              href="/vehicle"
              className="text-xs font-bold text-[#c9a84c] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              View Full {rawList.length} Vehicle Inventory <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="bg-[#101010] border border-neutral-800 hover:border-[#c9a84c]/50 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#c9a84c] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#c9a84c]/30">
                    {car.year}
                  </span>
                  {car.isFeatured && (
                    <span className="absolute top-4 right-4 bg-[#c9a84c] text-black text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      ★ FEATURED
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                      <span className="bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded font-mono font-bold">{car.make}</span>
                      <span className="text-neutral-500 font-medium">{car.mileage}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#c9a84c] transition-colors">{car.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
                      <span>{car.fuel}</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                    </div>

                    {/* Special Feature Badges */}
                    {car.features && car.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {car.features.slice(0, 2).map((feat: string, idx: number) => (
                          <span key={idx} className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 px-2 py-0.5 rounded-md font-medium">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-900 pt-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-semibold">Price</span>
                      <div className="text-base font-black text-[#c9a84c]">{car.price}</div>
                    </div>
                    <Link
                      href={`/product/${car.id}`}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white hover:bg-[#c9a84c] hover:text-black font-bold text-xs rounded-xl transition-all"
                    >
                      Dossier Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-[#080808] py-12 px-6 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-neutral-300 font-bold">
            <ShieldCheck className="text-[#c9a84c]" size={18} /> KnK Automotive Enterprise Systems © 2026
          </div>
          <div className="flex gap-6 text-neutral-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/brand-identity" className="hover:text-white">Brand Guidelines</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
