'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { VEHICLES, VehicleItem } from '../../../lib/vehicle-dataset';
import { Vehicle360Viewer } from '../../../components/automotive/Vehicle360Viewer';
import { FinanceCalculatorWidget } from '../../../components/automotive/FinanceCalculatorWidget';
import { TradeInEstimatorWidget } from '../../../components/automotive/TradeInEstimatorWidget';
import { TestDriveModal } from '../../../components/automotive/TestDriveModal';
import { ReservationModal } from '../../../components/automotive/ReservationModal';
import { Star, ShieldCheck, Truck, ArrowLeft, Heart, Layers, Gauge, Fuel, Sliders, Calendar, Lock, Car, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VehicleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const vehicle = VEHICLES.find(v => v.id === slug || v.stockNumber.toLowerCase() === slug?.toLowerCase()) || VEHICLES[0];
  const { wishlist, toggleWishlist, compareList, toggleCompare, openTestDriveModal, openReservationModal } = useStore();

  const [activeTab, setActiveTab] = useState<'360' | 'GALLERY'>('360');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isWishlisted = wishlist.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px 80px' }}>
      {/* Back to Inventory Matrix */}
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-text-dim)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px', fontWeight: '700' }}>
        <ArrowLeft size={16} /> Back to Vehicle Inventory Matrix
      </Link>

      {/* Main Grid: Left Gallery/360 + Right Purchase/Reservation Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'start' }}>
        {/* Left Column: Media Showcase (360 Spin + HD Photo Gallery) */}
        <div>
          {/* Switcher Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={() => setActiveTab('360')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '900',
                background: activeTab === '360' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-surface)',
                border: activeTab === '360' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                color: activeTab === '360' ? '#3B82F6' : 'var(--nexus-text-muted)',
                cursor: 'pointer'
              }}
            >
              360° Exterior Spin Simulator
            </button>
            <button
              onClick={() => setActiveTab('GALLERY')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '900',
                background: activeTab === 'GALLERY' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-surface)',
                border: activeTab === 'GALLERY' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                color: activeTab === 'GALLERY' ? '#3B82F6' : 'var(--nexus-text-muted)',
                cursor: 'pointer'
              }}
            >
              HD Photo Showcase ({vehicle.images.length})
            </button>
          </div>

          {activeTab === '360' ? (
            <Vehicle360Viewer frames={vehicle.frames360} vehicleTitle={`${vehicle.make} ${vehicle.model}`} />
          ) : (
            <div>
              <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', height: '420px', marginBottom: '16px' }}>
                <img
                  src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                  alt={vehicle.model}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {vehicle.images.map((img, i) => (
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
          )}

          {/* Key Specifications Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '28px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>ENGINE OUTPUT</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.engine.powerHp} HP</div>
              <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '700' }}>{vehicle.engine.torqueNm} Nm Torque</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>0–100 KM/H</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.engine.zeroToHundredKm}s</div>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>Top: {vehicle.engine.topSpeedKm} km/h</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>TRANSMISSION</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.transmission.gears}-Spd</div>
              <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '700' }}>{vehicle.drivetrain.type}</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>FUEL & RANGE</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.fuelEnergy.rangeKm} km</div>
              <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700' }}>{vehicle.fuelEnergy.fuelType}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Purchasing, Reservation Lock & Specs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {vehicle.make} • VIN: {vehicle.vin}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleCompare(vehicle.id)}
                style={{ background: 'transparent', border: 'none', color: isCompared ? '#3B82F6' : 'var(--nexus-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}
              >
                <Layers size={16} /> {isCompared ? 'In Compare' : 'Compare'}
              </button>
              <button
                onClick={() => toggleWishlist(vehicle.id)}
                style={{ background: 'transparent', border: 'none', color: isWishlisted ? '#fb7185' : 'var(--nexus-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}
              >
                <Heart size={16} fill={isWishlisted ? '#fb7185' : 'none'} /> Wishlist
              </button>
            </div>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '4px', lineHeight: '1.2' }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <div style={{ fontSize: '14px', color: 'var(--nexus-text-muted)', fontWeight: '700', marginBottom: '20px' }}>
            {vehicle.trim}
          </div>

          {/* Price Box */}
          <div style={{ padding: '20px', background: 'var(--nexus-surface)', border: '1px solid var(--nexus-border)', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>CASH PRICE (DUTY PAID)</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', margin: '2px 0' }}>
                  ${vehicle.pricing.cashPrice.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '900', textTransform: 'uppercase' }}>ESTIMATED FINANCE</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#10B981' }}>
                  ${vehicle.pricing.estimatedMonthlyPayment}<span style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => openReservationModal(vehicle.id)}
              className="nexus-btn-primary"
              style={{ height: '52px', fontSize: '13px', fontWeight: '900' }}
            >
              <Lock size={18} /> Reserve Vehicle ($500)
            </button>

            <button
              onClick={() => openTestDriveModal(vehicle.id)}
              className="nexus-btn-secondary"
              style={{ height: '52px', fontSize: '13px', fontWeight: '800' }}
            >
              <Car size={18} /> Book Test Drive
            </button>
          </div>

          {/* 150-Point Certified Inspection Badge */}
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '900', color: '#10B981' }}>
                <ShieldCheck size={18} />
                <span>150-Point Certified Inspection Score</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#10B981' }}>
                {vehicle.inspection.score}/100
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', margin: 0 }}>
              {vehicle.inspection.notes} Inspected by <strong>{vehicle.inspection.inspectorName}</strong> on {vehicle.inspection.inspectionDate}.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Finance & Trade-In Widgets Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '48px' }}>
        <FinanceCalculatorWidget vehiclePrice={vehicle.pricing.cashPrice} vehicleTitle={`${vehicle.make} ${vehicle.model}`} />
        <TradeInEstimatorWidget targetVehicleId={vehicle.id} />
      </div>

      {/* Automotive Modals */}
      <TestDriveModal />
      <ReservationModal />
    </div>
  );
}
