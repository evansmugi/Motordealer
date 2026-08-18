'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CAMPAIGNS, PRODUCTS } from '../../lib/mock-dataset';
import { Tag, Zap, Clock, Copy, Check, ArrowRight } from 'lucide-react';

export default function CampaignsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const featuredProducts = PRODUCTS.filter(p => p.isFeatured).slice(0, 3);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' }}>
      {/* Hero Banner */}
      <div style={{
        borderRadius: '24px', padding: '48px', marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
            background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            <Zap size={14} /> Active Promotions
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#F8FAFC', marginBottom: '12px', lineHeight: '1.2' }}>
            Campaigns & Exclusive Deals
          </h1>
          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '560px', lineHeight: '1.6' }}>
            Unlock premium pricing on next-generation hardware. Apply promo codes at checkout to redeem your exclusive operator discount.
          </p>
        </div>
      </div>

      {/* Active Campaigns Grid */}
      <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', marginBottom: '20px' }}>Active Campaigns</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {CAMPAIGNS.filter(c => c.active).map(campaign => {
          const discountLabel = campaign.discountType === 'PERCENTAGE'
            ? `${campaign.discountValue}% OFF`
            : `$${campaign.discountValue} OFF`;
          const usagePercent = Math.min((campaign.usageCount / (campaign.budget / (campaign.discountType === 'PERCENTAGE' ? 100 : campaign.discountValue))) * 100, 95);

          return (
            <div key={campaign.id} className="glass-panel" style={{
              borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              {/* Accent glow */}
              <div style={{
                position: 'absolute', top: '0', right: '0', width: '120px', height: '120px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Discount Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '900',
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff',
                  marginBottom: '14px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}>
                  <Tag size={14} /> {discountLabel}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC', marginBottom: '6px' }}>
                  {campaign.name}
                </h3>

                <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>
                  {campaign.usageCount} operators have used this campaign
                </p>

                {/* Promo Code Copier */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    flex: 1, fontSize: '15px', fontWeight: '900', color: '#F8FAFC',
                    fontFamily: 'var(--font-mono)', letterSpacing: '2px'
                  }}>
                    {campaign.code}
                  </span>
                  <button onClick={() => handleCopy(campaign.code)} style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 12px', borderRadius: '8px',
                    background: copiedCode === campaign.code ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                    border: 'none', cursor: 'pointer',
                    fontSize: '11px', fontWeight: '800',
                    color: copiedCode === campaign.code ? '#10B981' : '#3B82F6'
                  }}>
                    {copiedCode === campaign.code ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>

                {/* Usage Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                    <span style={{ color: '#64748B', fontWeight: '700' }}>Budget Utilization</span>
                    <span style={{ color: '#F8FAFC', fontWeight: '800' }}>{Math.round(usagePercent)}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px', width: `${usagePercent}%`,
                      background: usagePercent > 75 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
                    Budget: ${campaign.budget.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Deals Section */}
      <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', marginBottom: '20px' }}>Featured Deals</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {featuredProducts.map(product => (
          <Link key={product.id} href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
            <div className="glass-panel" style={{
              borderRadius: '16px', overflow: 'hidden',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}>
              <div style={{
                height: '180px', backgroundImage: `url(${product.images[0]})`,
                backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
              }}>
                {product.compareAtPrice && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '900',
                    background: 'rgba(239, 68, 68, 0.9)', color: '#fff'
                  }}>
                    SAVE ${(product.compareAtPrice - product.price).toLocaleString()}
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>{product.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC' }}>${product.price.toLocaleString()}</span>
                  {product.compareAtPrice && (
                    <span style={{ fontSize: '14px', color: '#64748B', textDecoration: 'line-through' }}>
                      ${product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '12px', color: '#3B82F6', fontWeight: '700' }}>
                  Shop Now <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
