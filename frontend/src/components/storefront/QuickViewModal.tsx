'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShoppingBag, Star, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatPrice, theme } = useStore();
  const isLight = theme === 'light';

  if (!quickViewProduct) return null;

  return (
    <div className={`fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center p-4 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/85'
    }`}>
      <div className={`w-full max-w-3xl rounded-3xl p-6 sm:p-8 relative grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xl border-2 transition-all ${
        isLight
          ? 'bg-slate-50 border-amber-500 text-slate-900 shadow-slate-900/30'
          : 'bg-[#0E1017] border-white/10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
      }`}>
        <button
          onClick={() => setQuickViewProduct(null)}
          className={`absolute top-4 right-4 p-2 rounded-xl border transition-all cursor-pointer ${
            isLight ? 'bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <X size={20} />
        </button>

        <div>
          <img src={quickViewProduct.images[0]} alt={quickViewProduct.name} className="w-full h-80 object-cover rounded-2xl border border-slate-200/20" />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isLight ? 'text-amber-800' : 'text-blue-400'}`}>
              {quickViewProduct.brand}
            </span>
            <h2 className={`text-xl sm:text-2xl font-black mt-1 mb-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {quickViewProduct.name}
            </h2>
            <div className={`text-2xl font-black mb-4 ${isLight ? 'text-amber-800' : 'text-emerald-400'}`}>
              {formatPrice(quickViewProduct.price)}
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {quickViewProduct.description}
            </p>
          </div>

          <button
            onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
            className={`w-full py-3.5 px-6 font-extrabold rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isLight
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:opacity-95 shadow-amber-500/30'
                : 'bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black hover:opacity-90 shadow-[#c9a84c]/20'
            }`}
          >
            <ShoppingBag size={18} /> ADD TO CART NOW
          </button>
        </div>
      </div>
    </div>
  );
};
