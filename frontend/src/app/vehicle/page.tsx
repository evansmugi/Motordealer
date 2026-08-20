'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import PredictiveSelect from '../../components/common/PredictiveSelect';

import { useStore } from '../../context/StoreContext';
import { VEHICLES } from '../../lib/vehicle-dataset';

const MAKE_OPTIONS = [
  { value: '', label: 'All Makes' },
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz', badge: 'German' },
  { value: 'BMW', label: 'BMW', badge: 'German' },
  { value: 'Audi', label: 'Audi', badge: 'German' },
  { value: 'Porsche', label: 'Porsche', badge: 'German' },
  { value: 'Land Rover', label: 'Land Rover', badge: 'British' },
  { value: 'Lexus', label: 'Lexus', badge: 'Japanese' }
];

const CONDITION_OPTIONS = [
  { value: '', label: 'All Conditions' },
  { value: 'Brand New', label: 'Brand New' },
  { value: 'Certified Pre-Owned', label: 'Certified Pre-Owned' },
  { value: 'Foreign Used', label: 'Foreign Used' }
];

const TRANSMISSION_OPTIONS = [
  { value: '', label: 'All Transmissions' },
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' }
];

const FUEL_OPTIONS = [
  { value: '', label: 'All Fuel Types' },
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Electric', label: 'Electric' }
];

export default function VehicleInventoryPage() {
  const [make, setMake] = useState('');
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuel, setFuel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { vehicles: storeVehicles } = useStore();
  const rawList = (storeVehicles && storeVehicles.length > 0) ? storeVehicles : VEHICLES;

  const vehicles = rawList.map((v: any) => ({
    id: v.id,
    title: v.trim || v.listing_title ? (v.trim || v.listing_title) : `${v.year || 2024} ${v.make || ''} ${v.model || ''}`.trim(),
    make: v.make || 'Mercedes-Benz',
    model: v.model || 'Luxury Model',
    price: `KES ${Number(v.pricing?.cashPrice || v.price || 24500000).toLocaleString()}`,
    image: v.heroImage || (Array.isArray(v.images) && v.images[0] && (v.images[0].url || v.images[0])) || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    year: String(v.year || '2024'),
    condition: v.condition === 'NEW' ? 'Brand New' : v.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified Pre-Owned' : (v.condition || 'Foreign Used'),
    transmission: typeof v.transmission === 'object' ? (v.transmission.type || 'Automatic') : (v.transmission || 'Automatic'),
    fuel: typeof v.fuelEnergy === 'object' ? (v.fuelEnergy.fuelType || 'Petrol') : (v.fuel_type || 'Petrol'),
    mileage: v.history?.odometerKm ? `${Number(v.history.odometerKm).toLocaleString()} KM` : (v.mileage || '45 KM'),
    features: v.features ? (Array.isArray(v.features) ? v.features.flatMap((f: any) => typeof f === 'string' ? f : (f.items || [])) : []) : ['Burmester 3D', 'Panoramic Roof']
  }));

  const filteredVehicles = vehicles.filter((v) => {
    if (make && v.make !== make) return false;
    if (condition && v.condition !== condition) return false;
    if (transmission && v.transmission !== transmission) return false;
    if (fuel && v.fuel !== fuel) return false;
    if (searchTerm && !v.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto py-10 px-6 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Inventory Directory</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Vehicle Showroom & Dossiers</h1>
        </div>

        {/* Predictive Filter Bar */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="text-xs font-bold text-[#c9a84c] uppercase flex items-center gap-2">
              <Filter size={16} /> Instant Search & Filter Controls
            </span>
            <span className="text-xs text-neutral-400">Showing {filteredVehicles.length} Vehicles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Make</label>
              <PredictiveSelect options={MAKE_OPTIONS} value={make} onChange={setMake} placeholder="All Makes" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Condition</label>
              <PredictiveSelect options={CONDITION_OPTIONS} value={condition} onChange={setCondition} placeholder="All Conditions" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Transmission</label>
              <PredictiveSelect options={TRANSMISSION_OPTIONS} value={transmission} onChange={setTransmission} placeholder="All Transmissions" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Fuel Type</label>
              <PredictiveSelect options={FUEL_OPTIONS} value={fuel} onChange={setFuel} placeholder="All Fuel Types" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Keyword Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search specs..."
                className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVehicles.map((car) => (
            <div key={car.id} className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#c9a84c]/50 transition-all flex flex-col group">
              <div className="relative h-56 overflow-hidden bg-neutral-950">
                <img src={car.image} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[#c9a84c] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-[#c9a84c]/30">
                  {car.year}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {car.condition}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="text-[#c9a84c] font-bold">{car.make}</span>
                    <span className="font-mono text-neutral-400">{car.mileage}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#c9a84c] transition-colors">{car.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
                    <span>{car.fuel}</span>
                    <span>•</span>
                    <span>{car.transmission}</span>
                  </div>

                  {/* Special Features Badges */}
                  {car.features && car.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {car.features.slice(0, 3).map((feat: string, idx: number) => (
                        <span key={idx} className="bg-[#121212] border border-neutral-800 text-[10px] text-neutral-300 px-2 py-0.5 rounded-md font-medium">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-neutral-900 pt-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">Price</span>
                    <div className="text-base font-extrabold text-[#c9a84c]">{car.price}</div>
                  </div>
                  <Link href={`/product/${car.id}`} className="px-4 py-2 bg-[#c9a84c] text-black font-bold text-xs rounded-xl hover:opacity-90 transition-all">
                    View Dossier
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
