'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { VEHICLES, VehicleItem } from '../../lib/vehicle-dataset';
import { Layers, ArrowLeft, X, Check, ShieldCheck, Zap } from 'lucide-react';

export default function VehicleComparePage() {
  const { compareList, toggleCompare, openTestDriveModal, openReservationModal } = useStore();

  const comparedVehicles = VEHICLES.filter((v) => compareList.includes(v.id));

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px 80px' }}>
      {/* Back to Inventory Matrix */}
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-text-dim)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px', fontWeight: '700' }}>
        <ArrowLeft size={16} /> Back to Vehicle Inventory Matrix
      </Link>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>AUTOMOTIVE SPECIFICATION MATRIX</div>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>Side-by-Side Vehicle Comparison Engine</h1>
        <p style={{ fontSize: '14px', color: 'var(--nexus-text-muted)' }}>Compare technical specifications, performance, fuel consumption, and 150-point inspection scores.</p>
      </div>

      {comparedVehicles.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#3B82F6' }}>
            <Layers size={28} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '8px' }}>No Vehicles Selected for Comparison</h3>
          <p style={{ fontSize: '14px', color: 'var(--nexus-text-muted)', marginBottom: '24px' }}>
            Browse the vehicle inventory matrix and click the "Compare" button on any vehicle card to add up to 4 models.
          </p>
          <Link href="/products" className="nexus-btn-primary" style={{ display: 'inline-flex' }}>
            Browse Vehicles Now
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${comparedVehicles.length}, 1fr)`, gap: '20px', minWidth: '800px' }}>
            {/* Column Header: Labels */}
            <div style={{ paddingTop: '220px', fontWeight: '900', color: 'var(--nexus-text-dim)', fontSize: '12px', textTransform: 'uppercase' }}>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Cash Price</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Est. Monthly</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Engine Type</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Power (HP)</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Torque (Nm)</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>0–100 km/h</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Fuel Type</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Range (km)</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Transmission</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Drivetrain</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Inspection Score</div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>Seating</div>
            </div>

            {/* Vehicle Comparison Columns */}
            {comparedVehicles.map((v: VehicleItem) => (
              <div key={v.id} className="glass-panel" style={{ borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                  <img src={v.heroImage} alt={v.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => toggleCompare(v.id)}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '800' }}>{v.make} • {v.year}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '14px' }}>{v.model}</h3>

                {/* Specs Data Cells */}
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--nexus-text)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  ${v.pricing.cashPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#10B981', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  ${v.pricing.estimatedMonthlyPayment}/mo
                </div>
                <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.engine.type}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--nexus-text)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.engine.powerHp} HP
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--nexus-text)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.engine.torqueNm} Nm
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#3B82F6', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.engine.zeroToHundredKm}s
                </div>
                <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.fuelEnergy.fuelType}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--nexus-text)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.fuelEnergy.rangeKm} km
                </div>
                <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.transmission.type} ({v.transmission.gears}-Spd)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.drivetrain.type}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '900', color: '#10B981', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.inspection.score}/100 VERIFIED
                </div>
                <div style={{ fontSize: '13px', color: 'var(--nexus-text)', padding: '12px 0', borderBottom: '1px solid var(--nexus-border)' }}>
                  {v.dimensions.seats} Seats
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                  <button
                    onClick={() => openReservationModal(v.id)}
                    className="nexus-btn-primary"
                    style={{ height: '40px', fontSize: '11px' }}
                  >
                    Reserve ($500)
                  </button>
                  <button
                    onClick={() => openTestDriveModal(v.id)}
                    className="nexus-btn-secondary"
                    style={{ height: '40px', fontSize: '11px' }}
                  >
                    Book Test Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
