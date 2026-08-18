'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoNotice, setPromoNotice] = useState<string | null>(null);

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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: '460px', maxWidth: '100%', background: '#0E1017', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', height: '100%', display: 'flex', flexDirection: 'column', padding: '28px', boxShadow: '-15px 0 40px rgba(0,0,0,0.8)' }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>Shopping Cart</h2>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{cart.length} unique hardware items</div>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '8px', padding: '8px', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>{cartTotal >= freeShippingThreshold ? '🎉 Free Express Delivery Unlocked!' : `Add $${(freeShippingThreshold - cartTotal).toLocaleString()} for Free Delivery`}</span>
            <span style={{ fontWeight: '700', color: '#3B82F6' }}>{Math.round(progressPercent)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #10B981)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>

        {/* Cart Items Scroll Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</div>
              <p style={{ fontSize: '13px' }}>Explore the catalog and select hardware items.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
                <img src={item.product.images[0]} alt={item.product.name} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC' }}>{item.product.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Variant: {item.variantColor}</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#3B82F6', marginTop: '6px' }}>${item.product.price.toLocaleString()}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <button onClick={() => removeFromCart(item.product.id, item.variantColor)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px 6px' }}>
                    <button onClick={() => updateQuantity(item.product.id, item.variantColor, item.quantity - 1)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.variantColor, item.quantity + 1)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
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
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Promo Code (NEXUS2026)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', outline: 'none' }}
              />
              <button type="submit" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '0 14px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Apply</button>
            </form>
            {promoNotice && <div style={{ fontSize: '11px', color: '#10B981', marginBottom: '12px' }}>{promoNotice}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94A3B8', marginBottom: '6px' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10B981', marginBottom: '6px' }}>
                <span>Discount (15%)</span>
                <span>-${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#F8FAFC', margin: '12px 0 20px' }}>
              <span>Total</span>
              <span>${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="nexus-btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              PROCEED TO EXPRESS CHECKOUT <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
