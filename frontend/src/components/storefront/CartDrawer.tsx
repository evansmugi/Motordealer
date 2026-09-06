'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, theme } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoNotice, setPromoNotice] = useState<string | null>(null);

  const isLight = theme === 'light';

  if (!isCartOpen) return null;

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'NEXUS2026') {
      const discAmount = cartTotal * 0.15;
      setDiscount(discAmount);
      setPromoNotice('15% Nexus Launch Promo applied!');
    } else {
      setPromoNotice('Invalid promo code.');
    }
  };

  const finalTotal = cartTotal - discount;

  return (
    <div className={`fixed inset-0 z-[1000] flex justify-end backdrop-blur-md transition-all ${
      isLight ? 'bg-slate-900/60' : 'bg-black/70'
    }`}>
      <div className={`w-[460px] max-w-full h-full flex flex-col p-6 sm:p-7 shadow-2xl border-l transition-all ${
        isLight
          ? 'bg-slate-50 border-amber-500/60 text-slate-900 shadow-slate-900/30'
          : 'bg-[#0E1017] border-white/10 text-white shadow-[-15px_0_40px_rgba(0,0,0,0.8)]'
      }`}>
        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Shopping Cart</h2>
            <div className={`text-xs font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{cart.length} unique items</div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight ? 'bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className={`p-3.5 rounded-2xl border mb-5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
        }`}>
          <div className={`text-xs flex justify-between mb-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <span>{cartTotal >= freeShippingThreshold ? '🎉 Free Express Delivery Unlocked!' : `Add $${(freeShippingThreshold - cartTotal).toLocaleString()} for Free Delivery`}</span>
            <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-blue-400'}`}>{Math.round(progressPercent)}%</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
            <div className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Cart Items Scroll Container */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className={`text-center py-16 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className="text-base font-bold mb-2">Your cart is empty</div>
              <p className="text-xs">Explore the showroom catalog and select items.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className={`flex gap-3.5 p-3.5 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{item.product.name}</div>
                  <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Variant: {item.variantColor}</div>
                  <div className={`text-sm font-extrabold mt-1.5 ${isLight ? 'text-amber-800' : 'text-blue-400'}`}>${item.product.price.toLocaleString()}</div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <button onClick={() => removeFromCart(item.product.id, item.variantColor)} className="text-rose-500 hover:text-rose-600 cursor-pointer">
                    <Trash2 size={16} />
                  </button>

                  <div className={`flex items-center gap-2 p-1 rounded-lg border ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white/10 border-white/10 text-white'
                  }`}>
                    <button onClick={() => updateQuantity(item.product.id, item.variantColor, item.quantity - 1)} className="cursor-pointer text-slate-400 hover:text-slate-900">
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.variantColor, item.quantity + 1)} className="cursor-pointer text-slate-400 hover:text-slate-900">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code Form & Summary Footer */}
        {cart.length > 0 && (
          <div className={`mt-5 pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <form onSubmit={handleApplyPromo} className="flex gap-2 mb-3.5">
              <input
                type="text"
                placeholder="Promo Code (NEXUS2026)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-600'
                    : 'bg-white/5 border-white/10 text-white focus:border-[#c9a84c]'
                }`}
              />
              <button type="submit" className={`px-4 rounded-xl text-xs font-extrabold uppercase border cursor-pointer ${
                isLight ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}>Apply</button>
            </form>
            {promoNotice && <div className="text-xs font-bold text-emerald-500 mb-3">{promoNotice}</div>}

            <div className={`flex justify-between text-xs mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-500 font-bold mb-1.5">
                <span>Discount (15%)</span>
                <span>-${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className={`flex justify-between text-lg font-black my-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>Total</span>
              <span>${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className={`w-full py-3.5 px-6 font-extrabold rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:opacity-95 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black hover:opacity-90 shadow-[#c9a84c]/20'
              }`}
            >
              PROCEED TO EXPRESS CHECKOUT <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
