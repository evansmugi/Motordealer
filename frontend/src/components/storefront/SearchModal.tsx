'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { VEHICLES } from '../../lib/vehicle-dataset';
import { Search, X, Sparkles, ArrowRight, Car, Fuel, Gauge } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, vehicles, formatPrice, theme } = useStore();
  const [query, setQuery] = useState('');

  const isLight = theme === 'light';

  // Combined dataset: Store vehicles with fallback to VEHICLES
  const allVehicles = (vehicles && vehicles.length > 0) ? vehicles : VEHICLES;

  // Keyboard shortcut Listener ('/' to open, 'ESC' to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        // Prevent typing slash in inputs
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Real-time Predictive Matching
  const searchResults = cleanQuery === '' ? [] : allVehicles.filter((v: any) => {
    const title = `${v.year || ''} ${v.make || ''} ${v.model || ''} ${v.trim || ''}`.toLowerCase();
    const category = (v.category || v.bodyStyle || '').toLowerCase();
    const fuel = (v.fuel_type || v.fuelEnergy?.fuelType || '').toLowerCase();
    const condition = (v.condition || v.offer_type || '').toLowerCase();
    const tags = Array.isArray(v.features) ? v.features.join(' ').toLowerCase() : '';

    return title.includes(cleanQuery) || 
           category.includes(cleanQuery) || 
           fuel.includes(cleanQuery) || 
           condition.includes(cleanQuery) || 
           tags.includes(cleanQuery);
  });

  const popularSearches = [
    'Mercedes-Benz G63',
    'BMW M5 Competition',
    'Porsche 911',
    'Range Rover',
    'Land Cruiser 300',
    'Brand New'
  ];

  return (
    <div 
      className={`fixed inset-0 z-[100] backdrop-blur-2xl flex justify-center pt-16 sm:pt-24 px-4 sm:px-6 animate-in fade-in duration-200 ${
        isLight ? 'bg-slate-900/60' : 'bg-[#030509]/85'
      }`}
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className={`w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[82vh] animate-in slide-in-from-top-4 duration-300 shadow-2xl border-2 ${
          isLight
            ? 'bg-white border-amber-500 text-slate-900 shadow-slate-900/30'
            : 'bg-[#090d16] border-[#c9a84c]/60 text-white shadow-[0_25px_80px_rgba(0,0,0,0.95)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`p-4 sm:p-6 border-b flex items-center gap-4 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#050811] border-neutral-800'
        }`}>
          <Search size={22} className={`shrink-0 stroke-[2.5] ${isLight ? 'text-amber-600' : 'text-[#c9a84c]'}`} />
          <input
            type="text"
            autoFocus
            placeholder="Search by Make, Model, Year, SUV, Petrol, V8..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 bg-transparent border-none text-base sm:text-lg font-bold outline-none ${
              isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-neutral-500'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-neutral-400 hover:text-white'}`}
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              isLight
                ? 'bg-slate-200 border-slate-300 text-slate-800 hover:border-amber-600'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-[#c9a84c]/40'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Modal Body / Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {cleanQuery === '' ? (
            <div>
              <div className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-4 ${
                isLight ? 'text-amber-800' : 'text-[#c9a84c]'
              }`}>
                <Sparkles size={14} className={isLight ? 'text-amber-800' : 'text-white'} /> Popular Showroom Searches
              </div>
              <div className="flex flex-wrap gap-2.5">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 group cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 hover:border-amber-500 text-slate-800 hover:bg-slate-200'
                        : 'bg-neutral-900/90 border-neutral-800 hover:border-[#c9a84c]/60 text-neutral-200 hover:text-white'
                    }`}
                  >
                    <span>{term}</span>
                    <ArrowRight size={13} className={`group-hover:translate-x-0.5 transition-all ${
                      isLight ? 'text-slate-400 group-hover:text-amber-700' : 'text-neutral-400 group-hover:text-[#c9a84c]'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className={`flex items-center justify-between text-xs font-mono font-bold mb-4 pb-2 border-b ${
                isLight ? 'text-slate-500 border-slate-200' : 'text-neutral-400 border-neutral-800'
              }`}>
                <span className={`uppercase ${isLight ? 'text-amber-800 font-extrabold' : 'text-[#c9a84c]'}`}>
                  {searchResults.length} Match{searchResults.length === 1 ? '' : 'es'} Found
                </span>
                <span>Type to refine search</span>
              </div>

              {searchResults.length === 0 ? (
                <div className={`py-12 text-center space-y-3 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  <Car size={40} className={`mx-auto stroke-[1.5] ${isLight ? 'text-slate-400' : 'text-neutral-600'}`} />
                  <p className="text-sm font-semibold">No vehicles found matching &quot;{query}&quot;</p>
                  <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>Try searching for &quot;Mercedes&quot;, &quot;BMW&quot;, &quot;G63&quot;, or &quot;Used&quot;</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((car: any) => {
                    const carTitle = `${car.year || 2024} ${car.make || ''} ${car.model || ''} ${car.trim || ''}`.trim();
                    const carImage = car.heroImage || (Array.isArray(car.images) && car.images[0]?.url) || (Array.isArray(car.images) && car.images[0]) || '/images/g63-hero.png';
                    const carPrice = car.pricing?.cashPrice || car.price || 24500000;
                    const formattedPrice = formatPrice ? formatPrice(carPrice) : `KES ${Number(carPrice).toLocaleString()}`;
                    const targetUrl = car.slug ? `/product/${car.slug}` : `/vehicle`;

                    return (
                      <Link
                        key={car.id || car._id}
                        href={targetUrl}
                        onClick={() => setIsSearchOpen(false)}
                        className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 hover:border-amber-500'
                            : 'bg-neutral-900/80 hover:bg-neutral-800/90 border-neutral-800 hover:border-[#c9a84c]/60'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={carImage} 
                            alt={carTitle}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border group-hover:scale-105 transition-transform ${
                              isLight ? 'border-slate-300' : 'border-neutral-800'
                            }`} 
                          />
                          <div>
                            <h4 className={`text-sm sm:text-base font-extrabold transition-colors ${
                              isLight ? 'text-slate-900 group-hover:text-amber-700' : 'text-white group-hover:text-[#c9a84c]'
                            }`}>
                              {carTitle}
                            </h4>
                            <div className={`flex items-center gap-3 text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                              <span className="flex items-center gap-1">
                                <Gauge size={13} className={isLight ? 'text-slate-800' : 'text-white'} />
                                {car.history?.odometerKm ? `${Number(car.history.odometerKm).toLocaleString()} KM` : '45 KM'}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Fuel size={13} className={isLight ? 'text-slate-800' : 'text-white'} />
                                {typeof car.fuelEnergy === 'object' ? car.fuelEnergy?.fuelType : (car.fuel_type || 'Petrol')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={`text-sm sm:text-base font-black font-mono ${
                            isLight ? 'text-amber-800' : 'text-[#c9a84c]'
                          }`}>
                            {formattedPrice}
                          </div>
                          <span className={`inline-block mt-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                            isLight
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]'
                          }`}>
                            {car.condition || car.offer_type || 'Showroom'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-3 border-t flex items-center justify-between text-[11px] font-mono ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#04060c] border-neutral-800 text-neutral-400'
        }`}>
          <span>Press ESC to exit search</span>
          <span className={isLight ? 'text-amber-800 font-bold' : 'text-[#c9a84c]'}>KnK Automotive Inventory</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
