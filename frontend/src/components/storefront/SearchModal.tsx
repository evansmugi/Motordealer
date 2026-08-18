'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, type ProductItem } from '../../lib/mock-dataset';
import { Search, X, TrendingUp, ArrowRight, Zap } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Listener '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = query.trim() === '' ? [] : PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const trendingSearches = ['Neural Visor', 'Quantum Core', 'Zero-G Ergonomic Pod', 'Autonomous Drone'];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(8, 9, 12, 0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
      <div style={{ width: '680px', maxWidth: '90%', background: '#0E1017', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Search Input Bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Search size={22} color="#3B82F6" />
          <input
            type="text"
            autoFocus
            placeholder="Search by hardware name, SKU, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#F8FAFC', fontSize: '18px', fontWeight: '600', outline: 'none' }}
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '8px', padding: '6px', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results / Trending Suggestions */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {query.trim() === '' ? (
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} color="#3B82F6" /> TRENDING SEARCHES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {trendingSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '6px 14px', color: '#94A3B8', fontSize: '13px', cursor: 'pointer' }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '800', marginBottom: '16px' }}>
                {results.length} MATCHING HARDWARE ITEMS FOUND
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.map((product: ProductItem) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', transition: 'all 0.2s ease' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>SKU: {product.sku} • {product.brand}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: '#3B82F6' }}>${product.price.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: '#10B981' }}>In Stock ({product.stock})</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
