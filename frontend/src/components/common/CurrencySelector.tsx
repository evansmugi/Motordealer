'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const CurrencySelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currencies, selectedCurrencyCode, setSelectedCurrencyCode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCurrencies = currencies.filter(c => c.active);
  const currentCurrency = activeCurrencies.find(c => c.code === selectedCurrencyCode) || activeCurrencies[0] || { 
    code: 'KES', symbol: 'KES', name: 'Kenyan Shilling' 
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block text-left select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border-2 border-neutral-800 hover:border-[#c9a84c]/60 text-xs font-black text-white hover:text-[#c9a84c] transition-all shadow-md cursor-pointer group"
      >
        <Globe size={18} className="text-white group-hover:text-[#c9a84c] transition-colors shrink-0 stroke-[2.2]" />
        <span className="font-mono text-xs tracking-wider uppercase whitespace-nowrap">
          {currentCurrency.code === currentCurrency.symbol
            ? currentCurrency.code
            : `${currentCurrency.code} (${currentCurrency.symbol})`}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-white group-hover:text-[#c9a84c] transition-transform duration-200 stroke-[2.5] ${isOpen ? 'rotate-180 text-[#c9a84c]' : ''}`} 
        />
      </button>

      {/* Luxury Custom Floating Dropdown Menu with Hover Bridge Container */}
      {isOpen && (
        <div className="absolute right-0 top-full pt-1.5 w-60 z-50">
          <div className="rounded-2xl bg-[#090d16] border-2 border-[#c9a84c]/60 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 text-white">
            
            {/* Menu Header */}
            <div className="px-4 py-2.5 border-b border-neutral-800 bg-[#050811] flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#c9a84c] uppercase tracking-widest">
                Storefront Currency
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Live Rates
              </span>
            </div>

            {/* Currency Items List */}
            <div className="p-1.5 space-y-1">
              {activeCurrencies.map((curr) => {
                const isSelected = curr.code === selectedCurrencyCode;

                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      setSelectedCurrencyCode(curr.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/50 text-[#c9a84c] font-bold shadow-md' 
                        : 'hover:bg-neutral-800/80 text-neutral-200 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-[#c9a84c] text-black shadow-sm' 
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      }`}>
                        {curr.symbol}
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-white tracking-wider flex items-center gap-1.5">
                          <span>{curr.code}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans">{curr.name}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={16} className="text-[#c9a84c] stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
