'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check, X } from 'lucide-react';

interface StyledTimePickerProps {
  value: string;
  onChange: (timeStr: string) => void;
  placeholder?: string;
  className?: string;
}

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

export default function StyledTimePicker({
  value,
  onChange,
  placeholder = 'Select time slot...',
  className = ''
}: StyledTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#121212] border border-neutral-800 hover:border-[#c9a84c]/50 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-sm text-white flex items-center justify-between transition-all outline-none"
      >
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#c9a84c]" />
          <span className={value ? 'text-white font-medium' : 'text-neutral-500'}>
            {value ? value : placeholder}
          </span>
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

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-[#0d0d0d] border border-neutral-800 rounded-xl p-2 shadow-2xl backdrop-blur-xl max-h-56 overflow-y-auto divide-y divide-neutral-900">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => {
                onChange(slot);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                value === slot
                  ? 'bg-[#c9a84c]/20 text-[#c9a84c] font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <span>{slot}</span>
              {value === slot && <Check size={14} className="text-[#c9a84c]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
