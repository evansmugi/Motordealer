'use client';

import React, { useState } from 'react';
import { VEHICLES, VehicleItem } from '../../lib/vehicle-dataset';
import { VehicleCard } from '../../components/automotive/VehicleCard';
import { TestDriveModal } from '../../components/automotive/TestDriveModal';
import { ReservationModal } from '../../components/automotive/ReservationModal';
import { SearchModal } from '../../components/storefront/SearchModal';
import { Filter, SlidersHorizontal, Car, Search } from 'lucide-react';

export default function ProductsPage() {
  const [selectedMake, setSelectedMake] = useState('ALL');
  const [selectedBody, setSelectedBody] = useState('ALL');
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  let filtered = VEHICLES.filter((v: VehicleItem) => {
    const matchMake = selectedMake === 'ALL' || v.make === selectedMake;
    const matchBody = selectedBody === 'ALL' || v.bodyType === selectedBody;
    const matchCondition = selectedCondition === 'ALL' || v.condition === selectedCondition;
    const matchPrice = v.pricing.cashPrice <= maxPrice;
    const matchSearch = `${v.make} ${v.model} ${v.trim} ${v.vin}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMake && matchBody && matchCondition && matchPrice && matchSearch;
  });

  if (sortBy === 'price-low') filtered.sort((a, b) => a.pricing.cashPrice - b.pricing.cashPrice);
  if (sortBy === 'price-high') filtered.sort((a, b) => b.pricing.cashPrice - a.pricing.cashPrice);
  if (sortBy === 'power') filtered.sort((a, b) => b.engine.powerHp - a.engine.powerHp);

  const makesList = Array.from(new Set(VEHICLES.map(v => v.make)));

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>DEALERSHIP CATALOG MATRIX</div>
        <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>Vehicle Inventory Matrix</h1>
        <p style={{ fontSize: '14px', color: 'var(--nexus-text-muted)' }}>Multi-axis discovery for new, certified pre-owned, high-performance, and electric vehicles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Filter Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '20px' }}>
              <Filter size={18} color="#3B82F6" /> INVENTORY FILTERS
            </div>

            {/* Keyword Search */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Search Make, Model, VIN</label>
              <input
                type="text"
                placeholder="e.g. Prado, M5, Plaid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
              />
            </div>

            {/* Manufacturer Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Manufacturer (Make)</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
              >
                <option value="ALL">All Manufacturers</option>
                {makesList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Body Type Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Body Classification</label>
              <select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
                style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
              >
                <option value="ALL">All Body Types</option>
                <option value="SUV">SUV & 4x4 Off-Road</option>
                <option value="SEDAN">Luxury Saloon & Executive</option>
                <option value="EV">Electric & Plug-in Hybrid</option>
                <option value="PICKUP">Pickup & Commercial</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Vehicle Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
              >
                <option value="ALL">All Conditions</option>
                <option value="NEW">Brand New Vehicles</option>
                <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned (CPO)</option>
              </select>
            </div>

            {/* Price Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
                <span>Max Cash Price</span>
                <span style={{ color: '#3B82F6' }}>${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="200000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3B82F6' }}
              />
            </div>
          </div>
        </aside>

        {/* Vehicle Grid & Sorting Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: 'var(--nexus-text-muted)' }}>
              Showing <strong style={{ color: 'var(--nexus-text)' }}>{filtered.length}</strong> matching vehicles
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--nexus-text-dim)' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: 'var(--nexus-surface)', border: '1px solid var(--nexus-border)', color: 'var(--nexus-text)', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="power">Highest Engine Output (HP)</option>
              </select>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {filtered.map((vehicle: VehicleItem) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>

      <TestDriveModal />
      <ReservationModal />
      <SearchModal />
    </div>
  );
}
