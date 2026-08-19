'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ModernDatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ModernDatePicker({
  value,
  onChange,
  placeholder = 'Select date...',
  className = ''
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSelectDay = (day: number) => {
    const d = new Date(year, month, day);
    const dateStr = d.toISOString().split('T')[0];
    onChange(dateStr);
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));

  return (
    <div className={`relative w-full text-left font-sans ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#121212] border border-neutral-800 hover:border-[#c9a84c]/50 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-sm text-white flex items-center justify-between transition-all outline-none"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-[#c9a84c]" />
          <span className={value ? 'text-white font-medium' : 'text-neutral-500'}>
            {value ? value : placeholder}
          </span>
        </div>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-neutral-500 hover:text-red-400 p-0.5"
          >
            <X size={14} />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-1 bg-[#0d0d0d] border border-neutral-800 rounded-xl p-3 shadow-2xl backdrop-blur-xl w-64">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-[#c9a84c]">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[10px] text-neutral-500 font-semibold">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === dStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`py-1 text-xs rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-[#c9a84c] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
