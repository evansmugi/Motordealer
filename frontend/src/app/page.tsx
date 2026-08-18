'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeroBanner } from '../components/storefront/HeroBanner';
import { ProductCard } from '../components/storefront/ProductCard';
import { PRODUCTS, CATEGORIES, type ProductItem, type CategoryItem } from '../lib/mock-dataset';
import { ArrowRight, Cpu } from 'lucide-react';

export default function HomePage() {
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const filteredProducts = selectedCat === 'ALL'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCat);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Signature Interaction #1: Spatial Hero Composition */}
      <HeroBanner />

      {/* Category Spatial Collections Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              SPATIAL DIVISIONS
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)' }}>
              Curated Technology Matrix
            </h2>
          </div>
          <Link href="/products" style={{ color: '#3B82F6', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Full Matrix <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {CATEGORIES.map((cat: CategoryItem) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(selectedCat === cat.slug ? 'ALL' : cat.slug)}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                border: selectedCat === cat.slug ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                background: selectedCat === cat.slug ? 'rgba(59, 130, 246, 0.1)' : 'var(--nexus-surface)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--nexus-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#3B82F6' }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--nexus-text)', marginBottom: '6px' }}>{cat.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', lineHeight: '1.5' }}>{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hardware Catalog Grid Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--nexus-text)' }}>
              {selectedCat === 'ALL' ? 'Featured Hardware Units' : `Category: ${selectedCat}`}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--nexus-text-dim)', marginTop: '4px' }}>
              Sub-millisecond bio-feedback sync & high-density cryogenic processing modules.
            </p>
          </div>
          {selectedCat !== 'ALL' && (
            <button onClick={() => setSelectedCat('ALL')} style={{ background: 'var(--nexus-surface)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '6px 14px', color: 'var(--nexus-text-muted)', fontSize: '12px', cursor: 'pointer' }}>
              Reset Filter
            </button>
          )}
        </div>

        {/* Signature Interaction #2: Product Card System */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          {filteredProducts.map((product: ProductItem) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Technology Narrative Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
        <div className="glass-panel" style={{ borderRadius: '24px', padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>ARCHITECTURE DISCLOSURE</span>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--nexus-text)', margin: '12px 0 20px', lineHeight: '1.2' }}>
              Built Upon Dual Strapi 5 & PostgreSQL Telemetry Engine
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--nexus-text-muted)', lineHeight: '1.7', marginBottom: '28px' }}>
              NEXUS PRIME isolates public consumer interactions from internal enterprise operations. Real-time inventory deductions, state machine transitions, and supplier logistics are managed autonomously inside the AETHEL ERP OS.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="http://localhost:5181" target="_blank" rel="noreferrer" className="nexus-btn-primary">
                Launch AETHEL ERP OS →
              </a>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
              alt="Quantum Core Architecture"
              style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '20px', border: '1px solid var(--nexus-border)' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
