'use client';

import React from 'react';
import Link from 'next/link';
import { VehicleItem } from '../../lib/vehicle-dataset';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Fuel, Gauge, Sliders, Calendar, ArrowRight, Layers, CheckCircle2, Bookmark } from 'lucide-react';

export const VehicleCard: React.FC<{ vehicle: VehicleItem }> = ({ vehicle }) => {
  const { wishlist, toggleWishlist, compareList, toggleCompare, openTestDriveModal, openReservationModal } = useStore();

  const isWishlisted = wishlist.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);

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
    >
      {/* Top Media Preview Header */}
      <div style={{ position: 'relative', height: '240px', background: 'var(--nexus-surface)', overflow: 'hidden' }}>
        <Link href={`/product/${vehicle.id}`} style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>
          <img
            src={vehicle.heroImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          />
        </Link>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: 'linear-gradient(to top, var(--nexus-surface), transparent)' }}></div>

        {/* Condition & Stock Badges */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 5, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#3B82F6', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {vehicle.condition.replace('_', ' ')}
          </span>
          <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10B981', fontSize: '10px', fontWeight: '800' }}>
            {vehicle.inspection.score}/100 VERIFIED
          </span>
        </div>

        {/* Wishlist & Compare Buttons */}
        <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 5, display: 'flex', gap: '8px' }}>
          <button
            onClick={() => toggleCompare(vehicle.id)}
            title={isCompared ? 'Remove from Compare Matrix' : 'Add to Compare Matrix'}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: isCompared ? '#3B82F6' : 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Layers size={13} /> {isCompared ? 'Compared' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Vehicle Identity & Technical Summary */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {vehicle.make} • {vehicle.year} • {vehicle.bodyType}
            </span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
              {vehicle.branchName}
            </span>
          </div>

          <Link href={`/product/${vehicle.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '4px', lineHeight: '1.2' }}>
              {vehicle.make} {vehicle.model}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', fontWeight: '600', marginBottom: '14px' }}>
              {vehicle.trim}
            </div>
          </Link>

          {/* Quick Technical Spec Grid Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px', background: 'var(--nexus-bg)', padding: '10px', borderRadius: '10px', border: '1px solid var(--nexus-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--nexus-text-muted)' }}>
              <Gauge size={14} color="#3B82F6" />
              <span>{vehicle.engine.powerHp} HP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--nexus-text-muted)' }}>
              <Fuel size={14} color="#10B981" />
              <span>{vehicle.fuelEnergy.fuelType}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--nexus-text-muted)' }}>
              <Sliders size={14} color="#8B5CF6" />
              <span>{vehicle.drivetrain.type}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Call-to-Actions */}
        <div style={{ paddingTop: '14px', borderTop: '1px solid var(--nexus-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>CASH PRICE</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--nexus-text)' }}>
                ${vehicle.pricing.cashPrice.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '800' }}>EST. FINANCE</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--nexus-text-muted)' }}>
                ${vehicle.pricing.estimatedMonthlyPayment}/mo
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => openTestDriveModal(vehicle.id)}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'var(--nexus-bg)',
                border: '1px solid var(--nexus-border)',
                color: 'var(--nexus-text)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Test Drive
            </button>

            <button
              onClick={() => openReservationModal(vehicle.id)}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              Reserve ($500)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
