'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES, PRODUCTS } from '../../lib/mock-dataset';
import { ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '8px' }}>
          Hardware Categories
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--nexus-text-muted)', maxWidth: '560px' }}>
          Browse our curated taxonomy of next-generation hardware systems. Each division represents a distinct frontier of engineering.
        </p>
      </div>

      {/* Category Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {CATEGORIES.map(category => {
          const categoryProducts = PRODUCTS.filter(p => p.category === category.slug);

          return (
            <div key={category.id} className="glass-panel" style={{
              borderRadius: '20px', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '360px 1fr',
              transition: 'border-color 0.3s ease'
            }}>
              {/* Category Image */}
              <div style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative', minHeight: '260px'
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, var(--nexus-surface) 100%)'
                }} />
                <div style={{
                  position: 'absolute', bottom: '24px', left: '24px', zIndex: 1
                }}>
                  <div style={{
                    display: 'inline-flex', padding: '4px 10px', borderRadius: '6px',
                    fontSize: '11px', fontWeight: '800', letterSpacing: '1px',
                    background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6',
                    textTransform: 'uppercase', marginBottom: '8px'
                  }}>
                    {category.itemCount} Products
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--nexus-text)' }}>{category.name}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', marginTop: '4px', maxWidth: '280px' }}>
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Category Products */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categoryProducts.length > 0 ? categoryProducts.map(product => (
                    <Link key={product.id} href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '12px 14px', borderRadius: '12px',
                        background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)',
                        transition: 'all 0.2s ease', cursor: 'pointer'
                      }}
                      >
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '10px', flexShrink: 0,
                          backgroundImage: `url(${product.images[0]})`,
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          border: '1px solid var(--nexus-border)'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--nexus-text)' }}>{product.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', marginTop: '2px' }}>{product.brand} · {product.sku}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--nexus-text)' }}>${product.price.toLocaleString()}</div>
                          {product.badge && (
                            <div style={{
                              fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px',
                              background: 'rgba(16, 185, 129, 0.15)', color: '#10B981',
                              marginTop: '4px', display: 'inline-block'
                            }}>{product.badge}</div>
                          )}
                        </div>
                        <ChevronRight size={16} color="var(--nexus-text-dim)" />
                      </div>
                    </Link>
                  )) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--nexus-text-dim)', fontSize: '13px' }}>
                      Coming soon — products in development.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
