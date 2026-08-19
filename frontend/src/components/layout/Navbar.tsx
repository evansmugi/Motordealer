'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Car, Grid, ArrowRightLeft, Calendar, Calculator, Layers, 
  Search, Menu, X, ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { compareList, setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      label: 'Showroom Dossiers',
      href: '/vehicle',
      icon: Car,
      badge: 'Showroom',
      description: 'Instant search & detailed vehicle dossiers'
    },
    {
      label: 'Inventory Matrix',
      href: '/products',
      icon: Grid,
      badge: 'Catalog',
      description: 'Multi-axis discovery catalog grid'
    },
    {
      label: 'Trade-In Valuation',
      href: '/trade-in',
      icon: ArrowRightLeft,
      description: 'Dynamic vehicle credit calculator'
    },
    {
      label: 'VIP Test Drive',
      href: '/book-test-drive',
      icon: Calendar,
      description: 'Schedule concierge viewing'
    },
    {
      label: 'Finance Calculator',
      href: '/finance',
      icon: Calculator,
      description: 'Instant monthly payment estimates'
    },
    {
      label: 'Compare Vehicles',
      href: '/compare',
      icon: Layers,
      count: compareList?.length || 0,
      description: 'Side-by-side spec comparison'
    }
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#060606]/95 backdrop-blur-xl border-b border-neutral-800/90 shadow-2xl shadow-black/80 py-3' 
          : 'bg-[#080808]/90 backdrop-blur-md border-b border-neutral-800/60 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Mark Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#c9a84c] text-black font-black flex items-center justify-center shadow-lg shadow-[#c9a84c]/20 group-hover:scale-105 transition-transform">
              <Car size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white group-hover:text-[#c9a84c] transition-colors">
                  KnK AUTOMOTIVE
                </span>
                <span className="bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest uppercase">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider">PREMIER VEHICLE SHOWROOM</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 shadow-md shadow-[#c9a84c]/10'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-[#c9a84c]' : 'text-neutral-400'} />
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {link.badge}
                    </span>
                  )}

                  {typeof link.count === 'number' && link.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#c9a84c] text-black font-extrabold text-[10px] flex items-center justify-center">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <Search size={14} className="text-[#c9a84c]" />
              <span className="hidden md:inline">Search Specs...</span>
            </button>

            {/* Admin Portal Gateway Link */}
            <a
              href="http://localhost:5181"
              target="_blank"
              rel="noreferrer noopener"
              className="px-4 py-2 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-[#c9a84c]/20"
            >
              <span>ADMIN PORTAL</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="http://localhost:5181"
              target="_blank"
              rel="noreferrer noopener"
              className="px-3 py-1.5 bg-[#c9a84c] text-black font-bold text-[11px] rounded-lg uppercase"
            >
              ADMIN
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-[#0a0a0a] px-4 py-6 mt-3 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="text-[10px] font-bold uppercase text-[#c9a84c] tracking-wider mb-2 font-mono">
              Systematic Store Navigation
            </div>

            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#c9a84c]/15 border-[#c9a84c] text-white font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-[#c9a84c] text-black' : 'bg-neutral-800 text-[#c9a84c]'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {link.label}
                          {link.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-[#c9a84c] border border-[#c9a84c]/30">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{link.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
