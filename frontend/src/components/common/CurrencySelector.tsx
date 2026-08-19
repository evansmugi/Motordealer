'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const CurrencySelector: React.FC = () => {
  const { currencies, selectedCurrencyCode, setSelectedCurrencyCode } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeCurrencies = currencies.filter(c => c.active);
  const currentCurrency = activeCurrencies.find(c => c.code === selectedCurrencyCode) || activeCurrencies[0] || { code: 'KES', symbol: 'KES', name: 'Kenyan Shilling' };

  return (
    <div className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs font-mono font-bold text-neutral-200 hover:text-white hover:border-[#c9a84c]/50 transition-all shadow-sm cursor-pointer"
      >
        <Globe size={13} className="text-[#c9a84c]" />
        <span>{currentCurrency.code} ({currentCurrency.symbol})</span>
        <ChevronDown size={12} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0a0a0a] border border-[#c9a84c]/30 shadow-2xl z-50 py-2 animate-fadeIn backdrop-blur-xl"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1.5 border-b border-neutral-900 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            Select Display Currency
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {activeCurrencies.map((curr) => (
              <button
                key={curr.code}
                type="button"
                onClick={() => {
                  setSelectedCurrencyCode(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors hover:bg-neutral-900 ${
                  curr.code === selectedCurrencyCode ? 'text-[#c9a84c] font-bold bg-[#c9a84c]/10' : 'text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold">{curr.code}</span>
                  <span className="text-[11px] text-neutral-500 font-sans">({curr.name})</span>
                </div>
                {curr.code === selectedCurrencyCode && <Check size={13} className="text-[#c9a84c]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
