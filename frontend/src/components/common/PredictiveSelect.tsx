'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface PredictiveSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PredictiveSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  className = ''
}: PredictiveSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.badge && o.badge.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full text-left font-sans ${className}`} ref={containerRef}>
      {/* Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#121212] border border-neutral-800 hover:border-[#c9a84c]/50 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-sm text-white flex items-center justify-between transition-all outline-none"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && <selectedOption.icon size={16} className="text-[#c9a84c] shrink-0" />}
          <span className={selectedOption ? 'text-white font-medium truncate' : 'text-neutral-500 truncate'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 px-1.5 py-0.5 rounded font-medium shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-neutral-400">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="hover:text-red-400 p-0.5"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180 text-[#c9a84c]' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-[#0d0d0d] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-64 flex flex-col">
          {/* Search Box */}
          <div className="p-2 border-b border-neutral-800 bg-[#121212] relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#181818] border border-neutral-700/60 focus:border-[#c9a84c] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto p-1 divide-y divide-neutral-900">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-neutral-500 text-center">No options match "{search}"</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    opt.value === value
                      ? 'bg-[#c9a84c]/20 text-[#c9a84c] font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opt.icon && <opt.icon size={14} className="text-neutral-400 shrink-0" />}
                    <span>{opt.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {opt.badge && (
                      <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    )}
                    {opt.value === value && <Check size={14} className="text-[#c9a84c]" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
