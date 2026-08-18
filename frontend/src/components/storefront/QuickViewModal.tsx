'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShoppingBag, Star, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();

  if (!quickViewProduct) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(8, 9, 12, 0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '780px', maxWidth: '90%', background: '#0E1017', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', overflow: 'hidden', padding: '32px', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '8px', color: '#94A3B8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div>
          <img src={quickViewProduct.images[0]} alt={quickViewProduct.name} style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '16px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{quickViewProduct.brand}</span>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#F8FAFC', margin: '4px 0 12px' }}>{quickViewProduct.name}</h2>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#34d399', marginBottom: '16px' }}>${quickViewProduct.price.toLocaleString()}</div>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '20px' }}>{quickViewProduct.description}</p>
          </div>

          <button
            onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
            className="nexus-btn-primary"
            style={{ width: '100%' }}
          >
            <ShoppingBag size={18} /> ADD TO CART NOW
          </button>
        </div>
      </div>
    </div>
  );
};
