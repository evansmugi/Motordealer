'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { PRODUCTS, type ProductItem } from '../../../lib/mock-dataset';
import { Star, ShoppingBag, Truck, ArrowLeft, Check, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
  const { addToCart, wishlist, toggleWishlist } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.color || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, undefined, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px' }}>
      {/* Back Link */}
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-text-dim)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Catalog Matrix
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Left Column: Image Gallery Showcase */}
        <div>
          <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', height: '440px', marginBottom: '16px', position: 'relative' }}>
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: activeImageIndex === i ? '2px solid #3B82F6' : '1px solid var(--nexus-border)',
                  background: 'var(--nexus-surface)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Specifications & Purchasing Panel */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {product.brand} • SKU: {product.sku}
            </span>
            <button
              onClick={() => toggleWishlist(product.id)}
              style={{ background: 'transparent', border: 'none', color: isWishlisted ? '#fb7185' : 'var(--nexus-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <Heart size={18} fill={isWishlisted ? '#fb7185' : 'none'} /> Wishlist
            </button>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '12px', lineHeight: '1.2' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981' }}>
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {product.compareAtPrice && (
              <div style={{ fontSize: '16px', color: 'var(--nexus-text-dim)', textDecoration: 'line-through' }}>
                ${product.compareAtPrice.toLocaleString()}
              </div>
            )}
            <div style={{ fontSize: '13px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
              <Star size={14} fill="#d97706" /> {product.rating} ({product.reviewsCount} verified reviews)
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--nexus-text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                SELECT VARIANT SPECIFICATION
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v.color)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      background: selectedVariant === v.color ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-bg)',
                      border: selectedVariant === v.color ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                      color: selectedVariant === v.color ? '#3B82F6' : 'var(--nexus-text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {v.color} ({v.option})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Delivery Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10b981', fontSize: '13px', marginBottom: '24px' }}>
            <Truck size={18} />
            <span>In-Stock ({product.stock} units) • Next-Day Express Air Dispatch Available</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--nexus-surface)', border: '1px solid var(--nexus-border)', borderRadius: '12px', padding: '0 12px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'transparent', border: 'none', color: 'var(--nexus-text)', fontSize: '18px', cursor: 'pointer', padding: '8px' }}>-</button>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--nexus-text)', padding: '0 12px' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'transparent', border: 'none', color: 'var(--nexus-text)', fontSize: '18px', cursor: 'pointer', padding: '8px' }}>+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="nexus-btn-primary"
              style={{ flex: 1, height: '52px' }}
            >
              {isAdded ? (
                <> <Check size={20} /> ADDED TO CART </>
              ) : (
                <> <ShoppingBag size={20} /> ADD TO CART (${(product.price * quantity).toLocaleString()}) </>
              )}
            </button>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--nexus-text)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Technical Specification Matrix
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--nexus-border)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--nexus-text-dim)' }}>{key}</span>
                  <span style={{ color: 'var(--nexus-text)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
