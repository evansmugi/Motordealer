'use client';

import React, { useState } from 'react';
import { ProductCard } from '../../components/storefront/ProductCard';
import { PRODUCTS, CATEGORIES, type ProductItem, type CategoryItem } from '../../lib/mock-dataset';
import { Filter, SlidersHorizontal, Grid, List, Search } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  let filtered = PRODUCTS.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchPrice = p.price <= maxPrice;
    const matchStock = !onlyInStock || p.stock > 0;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchPrice && matchStock && matchSearch;
  });

  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>HARDWARE DIRECTORY</div>
        <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#F8FAFC', margin: '4px 0' }}>Catalog & Multi-Axis Discovery</h1>
        <p style={{ fontSize: '14px', color: '#94A3B8' }}>Filter through bio-neural headsets, cryo quantum cores, and autonomous swarm robotics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
        {/* Filter Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px' }}>
              <Filter size={16} color="#3B82F6" /> FILTER DIVISIONS
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Keyword Search</label>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', outline: 'none' }}
              />
            </div>

            {/* Category Radio Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  style={{ textAlign: 'left', background: 'transparent', border: 'none', color: selectedCategory === 'ALL' ? '#3B82F6' : '#94A3B8', fontSize: '13px', fontWeight: selectedCategory === 'ALL' ? '800' : '500', cursor: 'pointer' }}
                >
                  • All Categories
                </button>
                {CATEGORIES.map((c: CategoryItem) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    style={{ textAlign: 'left', background: 'transparent', border: 'none', color: selectedCategory === c.slug ? '#3B82F6' : '#94A3B8', fontSize: '13px', fontWeight: selectedCategory === c.slug ? '800' : '500', cursor: 'pointer' }}
                  >
                    • {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Max Price</span>
                <span style={{ color: '#3B82F6' }}>${maxPrice.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3B82F6' }}
              />
            </div>

            {/* In Stock Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                style={{ accentColor: '#3B82F6' }}
              />
              In-Stock Units Only
            </label>
          </div>
        </aside>

        {/* Main Product Grid Container */}
        <div>
          {/* Sorting Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              Showing <strong style={{ color: '#F8FAFC' }}>{filtered.length}</strong> matching hardware items
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: '#0E1017', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {filtered.map((product: ProductItem) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
