'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import PredictiveSelect from '../../components/common/PredictiveSelect';

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
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      title: '2024 Mercedes-Benz S 580 4MATIC',
      price: 'KES 24,500,000',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
      make: 'Mercedes-Benz',
      year: '2024',
      condition: 'Foreign Used',
      transmission: 'Automatic',
      fuel: 'Petrol',
      mileage: '8,400 KM'
    },
    {
      id: '2',
      title: '2024 Porsche Cayenne Turbo E-Hybrid',
      price: 'KES 28,000,000',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop',
      make: 'Porsche',
      year: '2024',
      condition: 'Brand New',
      transmission: 'Automatic',
      fuel: 'Hybrid',
      mileage: '0 KM'
    }
  ]);

  useEffect(() => {
    fetch('http://localhost:1338/api/car-listings')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          const fetched = data.data.map((item: { id?: string | number; attributes?: Record<string, unknown> }) => {
            const attr = item.attributes || (item as Record<string, unknown>);
            return {
              id: String(item.id || attr.id),
              title: String(attr.listing_title || `${attr.year || ''} ${attr.make || ''} ${attr.model || ''}`),
              price: attr.price ? `KES ${Number(attr.price).toLocaleString()}` : 'KES 24,500,000',
              image: Array.isArray(attr.images) && attr.images[0] && typeof attr.images[0] === 'object' && attr.images[0] !== null && 'url' in attr.images[0]
                ? String(attr.images[0].url)
                : 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
              make: String(attr.make || 'Mercedes-Benz'),
              year: String(attr.year || '2024'),
              condition: String(attr.condition || 'Foreign Used'),
              transmission: String(attr.transmission || 'Automatic'),
              fuel: String(attr.fuel_type || 'Petrol'),
              mileage: attr.mileage ? `${attr.mileage} KM` : '8,400 KM'
            };
          });
          setVehicles(fetched);
        }
      })
      .catch(() => null);
  }, []);

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
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#c9a84c] text-black font-extrabold flex items-center justify-center text-base">
              KnK
            </div>
            <span className="text-lg font-black text-white uppercase tracking-wider">
              KnK <span className="text-[#c9a84c]">Automotive</span>
            </span>
          </Link>
          <Link href="/book-test-drive" className="px-4 py-2 bg-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase">
            Book Viewing
          </Link>
        </div>
      </header>

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
            <div key={car.id} className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#c9a84c]/50 transition-all flex flex-col">
              <img src={car.image} alt={car.title} className="w-full h-56 object-cover" />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded font-mono">{car.year}</span>
                    <span>{car.condition}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{car.title}</h3>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-900 pt-3">
                  <div className="text-base font-extrabold text-[#c9a84c]">{car.price}</div>
                  <Link href={`/product/${car.id}`} className="px-4 py-2 bg-[#c9a84c] text-black font-bold text-xs rounded-xl">
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
