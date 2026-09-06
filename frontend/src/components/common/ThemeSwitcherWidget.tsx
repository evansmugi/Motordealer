'use client';

import React, { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const emptySubscribe = () => () => {};

export default function ThemeSwitcherWidget() {
  const { theme, toggleTheme } = useStore();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) return null;

  const isLight = theme === 'light';

  return (
    <aside aria-label="Theme Customization" className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        className={`group relative flex items-center gap-3 py-3 px-3.5 sm:px-4 rounded-l-2xl border-l-2 border-y border-r-0 shadow-2xl transition-all duration-300 hover:pr-5 ${
          isLight
            ? 'bg-[#0f172a]/95 backdrop-blur-xl border-amber-500/60 text-amber-400 hover:bg-[#1e293b] shadow-slate-900/40'
            : 'bg-[#0b0e14]/95 backdrop-blur-xl border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#121622] shadow-black/80 hover:border-[#c9a84c]'
        }`}
      >
        {/* Glow Accent Indicator */}
        <span
          className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 rounded-full blur-[2px] transition-colors duration-300 ${
            isLight ? 'bg-amber-400' : 'bg-[#c9a84c]'
          }`}
        />

        {/* Icon Container with animation */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
          {isLight ? (
            <Moon className="w-4 h-4 text-amber-300 animate-pulse" />
          ) : (
            <Sun className="w-4 h-4 text-[#c9a84c] group-hover:rotate-90 transition-transform duration-500" />
          )}
        </div>

        {/* Label & Text Pill */}
        <div className="flex flex-col items-start text-left">
          <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest opacity-70 leading-none">
            {isLight ? 'Theme: Light' : 'Theme: Dark'}
          </span>
          <span className="text-xs font-bold whitespace-nowrap mt-1 leading-none tracking-tight">
            {isLight ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </button>
    </aside>
  );
}
