'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface LuxuryDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  required?: boolean;
  label?: string;
  placeholder?: string;
  minDate?: string;
  theme?: 'dark' | 'light';
}

export const LuxuryDatePicker: React.FC<LuxuryDatePickerProps> = ({
  value,
  onChange,
  label = 'PREFERRED VIEWING DATE *',
  placeholder = 'Select viewing date...',
  theme = 'dark'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';

  // Parse current selected or initial viewing date
  const parsedDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Days calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${m}-${d}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const formattedDisplay = value ? new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className={`block text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
          isLight ? 'text-slate-700' : 'text-neutral-400'
        }`}>
          {label}
        </label>
      )}

      {/* Input Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-all select-none relative ${
          isLight
            ? 'bg-slate-100 border-slate-300 text-slate-900 hover:border-[#b89535]'
            : 'bg-[#121622] border-[#1e2638] text-white hover:border-[#c9a84c]/70'
        } ${isOpen ? (isLight ? 'border-[#b89535] ring-1 ring-[#b89535]/30' : 'border-[#c9a84c] ring-1 ring-[#c9a84c]/30') : ''}`}
      >
        <CalendarIcon size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          isLight ? 'text-amber-700' : 'text-[#c9a84c]'
        }`} />
        <span className={formattedDisplay ? (isLight ? 'font-mono text-slate-900 font-bold' : 'font-mono text-white font-semibold') : (isLight ? 'text-slate-500' : 'text-neutral-500')}>
          {formattedDisplay || placeholder}
        </span>
        <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold ${
          isLight ? 'text-amber-700' : 'text-[#c9a84c]'
        }`}>
          {isOpen ? 'Close' : 'Select'}
        </span>
      </div>

      {/* Popover Calendar Selector */}
      {isOpen && (
        <div className={`absolute left-0 right-0 bottom-full mb-2 z-[9999] rounded-2xl p-4 shadow-2xl font-sans animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl border-2 ${
          isLight
            ? 'bg-white border-amber-500/80 text-slate-900 shadow-slate-400/50'
            : 'bg-[#0c101c] border-[#c9a84c]/80 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
        }`}>
          {/* Header Controls */}
          <div className={`flex items-center justify-between mb-3 pb-2 border-b ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}>
            <button
              type="button"
              title="Previous Month"
              onClick={handlePrevMonth}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-amber-100 text-slate-700' : 'bg-white/5 hover:bg-[#c9a84c]/20 hover:text-[#c9a84c] text-neutral-400'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={`font-mono text-xs font-extrabold uppercase tracking-widest ${
              isLight ? 'text-amber-700' : 'text-[#c9a84c]'
            }`}>
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              title="Next Month"
              onClick={handleNextMonth}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-amber-100 text-slate-700' : 'bg-white/5 hover:bg-[#c9a84c]/20 hover:text-[#c9a84c] text-neutral-400'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days Header */}
          <div className={`grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-extrabold mb-2 ${
            isLight ? 'text-slate-600' : 'text-neutral-400'
          }`}>
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {/* Previous Month Padding Days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`prev-${i}`} className={`py-1.5 select-none ${
                isLight ? 'text-slate-300' : 'text-neutral-600'
              }`}>
                {prevMonthDays - firstDayOfMonth + i + 1}
              </div>
            ))}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const m = String(viewMonth + 1).padStart(2, '0');
              const d = String(day).padStart(2, '0');
              const currentDateStr = `${viewYear}-${m}-${d}`;
              const isSelected = value === currentDateStr;
              const isToday = todayStr === currentDateStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d9b85c] to-amber-600 text-slate-950 shadow-md font-black scale-105'
                      : isToday
                      ? isLight ? 'bg-amber-100 text-amber-800 border border-amber-400 font-extrabold' : 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40'
                      : isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-neutral-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className={`flex items-center justify-between mt-3 pt-2 border-t text-[10px] font-mono ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className={isLight ? 'text-slate-500 hover:text-rose-600 font-bold' : 'text-neutral-400 hover:text-rose-400'}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(todayStr);
                setIsOpen(false);
              }}
              className={`font-bold hover:underline ${isLight ? 'text-amber-700' : 'text-[#c9a84c]'}`}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
