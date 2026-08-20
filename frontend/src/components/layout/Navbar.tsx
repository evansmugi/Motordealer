'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Car, Grid, ArrowRightLeft, Calendar, Calculator, Layers, 
  Search, Menu, X, Globe, ChevronDown, ChevronRight,
  ShieldCheck, Sparkles, ArrowRight, DollarSign, Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import StorefrontBrandLogo from '../common/StorefrontBrandLogo';
import CurrencySelector from '../common/CurrencySelector';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { 
    compareList, 
    setIsSearchOpen, 
    currencies, 
    selectedCurrencyCode, 
    setSelectedCurrencyCode 
  } = useStore();

  const [activeMegaMenu, setActiveMegaMenu] = useState<'vehicles' | 'finance' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        ref={navRef}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#030509]/98 backdrop-blur-2xl border-b border-[#c9a84c]/40 shadow-2xl shadow-black/95 py-4' 
            : 'bg-[#05070c] border-b border-neutral-800/90 py-5 sm:py-6'
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          
          {/* Dynamic Brand Logo (Loads from Admin Settings or High-Contrast Brand Mark) */}
          <StorefrontBrandLogo />

          {/* Desktop Categorized Navigation Tabs with BIG BRIGHT WHITE ICONS */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            
            {/* Nav Tab 1: Showroom */}
            <Link
              href="/vehicle"
              onMouseEnter={() => setActiveMegaMenu(null)}
              className={`group px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                pathname === '/vehicle'
                  ? 'bg-gradient-to-r from-[#c9a84c]/25 via-[#e5c158]/15 to-[#c9a84c]/10 text-[#c9a84c] border-2 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/15'
                  : 'text-neutral-200 border-2 border-transparent hover:border-[#c9a84c] hover:bg-gradient-to-r hover:from-[#c9a84c]/25 hover:via-[#e5c158]/15 hover:to-[#c9a84c]/10 hover:text-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/15'
              }`}
            >
              <Car size={20} className="shrink-0 stroke-[2.2] transition-colors text-current group-hover:text-[#c9a84c]" />
              <span className="whitespace-nowrap font-extrabold text-current group-hover:text-[#c9a84c] transition-colors">Showroom</span>
            </Link>

            {/* Nav Tab 2: Vehicles (Mega Menu Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('vehicles')}
            >
              <button
                type="button"
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'vehicles' ? null : 'vehicles')}
                className={`group px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeMegaMenu === 'vehicles' || pathname.startsWith('/products')
                    ? 'bg-gradient-to-r from-[#c9a84c]/25 via-[#e5c158]/15 to-[#c9a84c]/10 text-[#c9a84c] border-2 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/15'
                    : 'text-neutral-200 border-2 border-transparent hover:border-[#c9a84c] hover:bg-gradient-to-r hover:from-[#c9a84c]/25 hover:via-[#e5c158]/15 hover:to-[#c9a84c]/10 hover:text-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/15'
                }`}
              >
                <Grid size={20} className="shrink-0 stroke-[2.2] transition-colors text-current group-hover:text-[#c9a84c]" />
                <span className="whitespace-nowrap font-extrabold text-current group-hover:text-[#c9a84c] transition-colors">Vehicles</span>
                <ChevronDown size={16} className={`transition-transform duration-200 stroke-[2.5] ${activeMegaMenu === 'vehicles' ? 'rotate-180 text-[#c9a84c]' : 'text-current group-hover:text-[#c9a84c]'}`} />
              </button>
            </div>

            {/* Nav Tab 3: Financing (Mega Menu Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('finance')}
            >
              <button
                type="button"
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'finance' ? null : 'finance')}
                className={`group px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeMegaMenu === 'finance' || pathname.startsWith('/trade-in') || pathname.startsWith('/finance')
                    ? 'bg-gradient-to-r from-[#c9a84c]/25 via-[#e5c158]/15 to-[#c9a84c]/10 text-[#c9a84c] border-2 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/15'
                    : 'text-neutral-200 border-2 border-transparent hover:border-[#c9a84c] hover:bg-gradient-to-r hover:from-[#c9a84c]/25 hover:via-[#e5c158]/15 hover:to-[#c9a84c]/10 hover:text-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/15'
                }`}
              >
                <ArrowRightLeft size={20} className="shrink-0 stroke-[2.2] transition-colors text-current group-hover:text-[#c9a84c]" />
                <span className="whitespace-nowrap font-extrabold text-current group-hover:text-[#c9a84c] transition-colors">Financing</span>
                <ChevronDown size={16} className={`transition-transform duration-200 stroke-[2.5] ${activeMegaMenu === 'finance' ? 'rotate-180 text-[#c9a84c]' : 'text-current group-hover:text-[#c9a84c]'}`} />
              </button>
            </div>

            {/* Nav Tab 4: Compare */}
            <Link
              href="/compare"
              onMouseEnter={() => setActiveMegaMenu(null)}
              className={`group px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 relative ${
                pathname === '/compare'
                  ? 'bg-gradient-to-r from-[#c9a84c]/25 via-[#e5c158]/15 to-[#c9a84c]/10 text-[#c9a84c] border-2 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/15'
                  : 'text-neutral-200 border-2 border-transparent hover:border-[#c9a84c] hover:bg-gradient-to-r hover:from-[#c9a84c]/25 hover:via-[#e5c158]/15 hover:to-[#c9a84c]/10 hover:text-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/15'
              }`}
            >
              <Layers size={20} className="shrink-0 stroke-[2.2] transition-colors text-current group-hover:text-[#c9a84c]" />
              <span className="whitespace-nowrap font-extrabold text-current group-hover:text-[#c9a84c] transition-colors">Compare</span>

              {typeof compareList?.length === 'number' && compareList.length > 0 && (
                <span className="w-5.5 h-5.5 rounded-full bg-gradient-to-r from-[#fef08a] via-[#e5c158] to-[#c9a84c] text-black font-black text-xs flex items-center justify-center shadow-md border border-black/20">
                  {compareList.length}
                </span>
              )}
            </Link>

          </nav>

          {/* Right Action Bar Controls with BRIGHT WHITE ICONS */}
          <div className="hidden sm:flex items-center gap-3.5">
            
            {/* Multi-Currency Dropdown Selector */}
            {currencies && currencies.length > 0 && (
              <CurrencySelector />
            )}

            {/* Quick Search Trigger (Icon-Only Translucent Modal Trigger) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 rounded-xl bg-neutral-900/90 border-2 border-neutral-800 hover:border-[#c9a84c]/60 text-white hover:text-[#c9a84c] flex items-center justify-center transition-all cursor-pointer group shadow-md"
              title="Search Vehicles (Press '/')"
              aria-label="Search Vehicles"
            >
              <Search size={20} className="text-white group-hover:text-[#c9a84c] group-hover:scale-110 transition-transform stroke-[2.2]" />
            </button>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl bg-neutral-900 border-2 border-neutral-800 text-white cursor-pointer"
              aria-label="Search Vehicles"
            >
              <Search size={20} className="text-white" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-neutral-900 border-2 border-neutral-800 text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* SOLID OPAQUE HIGH-CONTRAST DROPDOWN PANELS */}
        {/* ========================================================================= */}

        {/* Mega Menu 1: Vehicles */}
        {activeMegaMenu === 'vehicles' && (
          <div 
            className="absolute top-full left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setActiveMegaMenu('vehicles')}
          >
            <div className="max-w-7xl mx-auto bg-[#090d16] border-2 border-[#c9a84c]/60 shadow-[0_20px_60px_rgba(0,0,0,0.95)] rounded-2xl overflow-hidden grid grid-cols-12 text-white">
              
              {/* Left Column: Highlighted Featured Surface */}
              <div className="col-span-4 bg-[#050811] p-6 border-r border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#c9a84c] font-mono text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Sparkles size={14} className="text-white" /> Featured Cars
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
                    Showroom Catalog
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                    Explore photos, features, prices, and book a viewing for your dream car.
                  </p>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-200">
                      <ShieldCheck size={16} className="text-white" />
                      <span>Fully Inspected Vehicles</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-200">
                      <Zap size={16} className="text-white" />
                      <span>Live Exchange Rates & Prices</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/vehicle"
                  onClick={() => setActiveMegaMenu(null)}
                  className="mt-6 inline-flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all shadow-md"
                >
                  <span>Browse All Cars</span>
                  <ArrowRight size={16} className="text-black" />
                </Link>
              </div>

              {/* Middle Column: Inventory Categories */}
              <div className="col-span-4 p-6 bg-[#090d16] border-r border-neutral-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c] block mb-4">
                  Car Categories
                </span>
                
                <div className="space-y-3">
                  <Link
                    href="/products"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Grid size={16} className="text-white" /> All Cars Catalog
                      </span>
                      <ChevronRight size={16} className="text-white group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Browse all available cars with easy filters</p>
                  </Link>

                  <Link
                    href="/products?condition=Brand+New"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles size={16} className="text-white" /> Brand New Cars
                      </span>
                      <ChevronRight size={16} className="text-white group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Factory fresh cars with zero mileage</p>
                  </Link>

                  <Link
                    href="/products?condition=Certified+Pre-Owned"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-white" /> Used Cars
                      </span>
                      <ChevronRight size={16} className="text-white group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Quality checked pre-owned vehicles</p>
                  </Link>
                </div>
              </div>

              {/* Right Column: Quick Services */}
              <div className="col-span-4 p-6 bg-[#04060c]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c] block mb-4">
                  Our Services
                </span>

                <div className="space-y-3">
                  <Link
                    href="/book-test-drive"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center gap-2">
                      <Calendar size={16} className="text-white" />
                      <span>Book Test Drive</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Try out any car at your home or office</p>
                  </Link>

                  <Link
                    href="/compare"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center gap-2">
                      <Layers size={16} className="text-white" />
                      <span>Compare Cars</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Compare two or more cars side by side</p>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Mega Menu 2: Financing */}
        {activeMegaMenu === 'finance' && (
          <div 
            className="absolute top-full left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setActiveMegaMenu('finance')}
          >
            <div className="max-w-7xl mx-auto bg-[#090d16] border-2 border-[#c9a84c]/60 shadow-[0_20px_60px_rgba(0,0,0,0.95)] rounded-2xl overflow-hidden grid grid-cols-12 text-white">
              
              {/* Left Column */}
              <div className="col-span-4 bg-[#050811] p-6 border-r border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#c9a84c] font-mono text-[10px] font-bold uppercase tracking-widest mb-3">
                    <DollarSign size={14} className="text-white" /> Trade-In Your Car
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
                    Car Trade-In
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                    Get an instant valuation for your current car towards buying a new one.
                  </p>
                </div>

                <Link
                  href="/trade-in"
                  onClick={() => setActiveMegaMenu(null)}
                  className="inline-flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all shadow-md"
                >
                  <span>Value My Car</span>
                  <ArrowRight size={16} className="text-black" />
                </Link>
              </div>

              {/* Middle Column */}
              <div className="col-span-4 p-6 bg-[#090d16] border-r border-neutral-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c] block mb-4">
                  Car Loans & Payments
                </span>
                
                <div className="space-y-3">
                  <Link
                    href="/finance"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calculator size={16} className="text-white" /> Finance Calculator
                      </span>
                      <ChevronRight size={16} className="text-white group-hover:text-[#c9a84c]" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Calculate your monthly car payments easily</p>
                  </Link>

                  <Link
                    href="/trade-in"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ArrowRightLeft size={16} className="text-white" /> Trade-In Appraisal
                      </span>
                      <ChevronRight size={16} className="text-white group-hover:text-[#c9a84c]" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Swap your old car for credit on a new car</p>
                  </Link>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-4 p-6 bg-[#04060c]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c] block mb-4">
                  Test Drive
                </span>

                <div className="space-y-3">
                  <Link
                    href="/book-test-drive"
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-[#c9a84c]/40"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#c9a84c] flex items-center gap-2">
                      <Calendar size={16} className="text-white" />
                      <span>Book Test Drive</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 pl-6">Schedule a convenient day to view and test drive</p>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-[#080a10] px-4 py-6 mt-3 space-y-4 animate-in slide-in-from-top duration-200">
            
            {/* Mobile Currency & Search Toolbar */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              {currencies && currencies.length > 0 && (
                <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
                  <Globe size={16} className="text-white" />
                  <select
                    value={selectedCurrencyCode}
                    onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                    className="bg-transparent text-[#c9a84c] font-black text-xs outline-none"
                    aria-label="Select Storefront Mobile Currency"
                  >
                    {currencies.filter(c => c.active).map(curr => (
                      <option key={curr.code} value={curr.code} className="bg-neutral-950 text-white">
                        {curr.code} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300"
              >
                <Search size={16} className="text-white" />
                <span>Search Vehicles</span>
              </button>
            </div>

            <div className="text-[10px] font-mono font-bold uppercase text-[#c9a84c] tracking-widest px-1">
              STOREFRONT NAVIGATION DIRECTORY
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/vehicle"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border bg-neutral-900/60 border-neutral-800 text-neutral-300 flex items-center gap-3"
              >
                <Car size={20} className="text-white" />
                <div>
                  <div className="text-xs font-bold text-white">Showroom Dossiers</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Instant search & detailed vehicle dossiers</p>
                </div>
              </Link>

              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border bg-neutral-900/60 border-neutral-800 text-neutral-300 flex items-center gap-3"
              >
                <Grid size={20} className="text-white" />
                <div>
                  <div className="text-xs font-bold text-white">Inventory Matrix</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Multi-axis discovery catalog grid</p>
                </div>
              </Link>

              <Link
                href="/trade-in"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border bg-neutral-900/60 border-neutral-800 text-neutral-300 flex items-center gap-3"
              >
                <ArrowRightLeft size={20} className="text-white" />
                <div>
                  <div className="text-xs font-bold text-white">Trade-In Valuation</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Dynamic vehicle credit calculator</p>
                </div>
              </Link>

              <Link
                href="/book-test-drive"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border bg-neutral-900/60 border-neutral-800 text-neutral-300 flex items-center gap-3"
              >
                <Calendar size={20} className="text-white" />
                <div>
                  <div className="text-xs font-bold text-white">VIP Test Drive</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Schedule concierge viewing</p>
                </div>
              </Link>

              <Link
                href="/finance"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border bg-neutral-900/60 border-neutral-800 text-neutral-300 flex items-center gap-3"
              >
                <Calculator size={20} className="text-white" />
                <div>
                  <div className="text-xs font-bold text-white">Finance Calculator</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Instant monthly payment estimates</p>
                </div>
              </Link>

              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border bg-neutral-900/60 border-neutral-800 text-neutral-300 flex items-center gap-3"
              >
                <Layers size={20} className="text-white" />
                <div>
                  <div className="text-xs font-bold text-white">Compare Vehicles ({compareList?.length || 0})</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Side-by-side spec comparison</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
