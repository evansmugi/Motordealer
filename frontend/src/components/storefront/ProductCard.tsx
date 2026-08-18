'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { type ProductItem } from '../../lib/mock-dataset';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

export const ProductCard: React.FC<{ product: ProductItem }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.color || '');
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease'
      }}
      onMouseEnter={() => product.images.length > 1 && setCurrentImageIndex(1)}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      {/* Badge Overlay */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', gap: '8px' }}>
        {product.badge && (
          <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#3B82F6', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          background: isWishlisted ? 'rgba(244, 63, 94, 0.2)' : 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isWishlisted ? '#fb7185' : '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Heart size={18} fill={isWishlisted ? '#fb7185' : 'none'} />
      </button>

      {/* Image Media Showcase */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', position: 'relative', display: 'block', height: '260px', overflow: 'hidden', background: 'var(--nexus-surface)' }}>
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, var(--nexus-surface), transparent)' }}></div>
      </Link>

      {/* Card Body Details */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {product.brand}
            </span>
            <span style={{ fontSize: '11px', color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
              <Star size={12} fill="#D97706" /> {product.rating}
            </span>
          </div>

          <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--nexus-text)', marginBottom: '8px', lineHeight: '1.3' }}>
              {product.name}
            </h3>
          </Link>

          <p style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
            {product.shortDescription}
          </p>

          {/* Variant Selector Pills */}
          {product.variants.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {product.variants.map((v: { color: string; option: string; stock: number; priceModifier: number }, i: number) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(v.color); }}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    background: selectedVariant === v.color ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-bg)',
                    border: selectedVariant === v.color ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                    color: selectedVariant === v.color ? '#3B82F6' : 'var(--nexus-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {v.color}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--nexus-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)' }}>
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {product.compareAtPrice && (
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', textDecoration: 'line-through' }}>
                ${product.compareAtPrice.toLocaleString()}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleQuickView}
              style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px', color: 'var(--nexus-text-muted)', cursor: 'pointer' }}
              title="Quick View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={handleAddToCart}
              style={{
                background: isAdded ? '#10B981' : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {isAdded ? (
                <> <Check size={16} /> Added </>
              ) : (
                <> <ShoppingBag size={16} /> Add to Cart </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
