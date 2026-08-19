'use client';

import React from 'react';
import Link from 'next/link';
import { TradeInEstimatorWidget } from '../../components/automotive/TradeInEstimatorWidget';
import { ArrowRightLeft, ArrowLeft, ShieldCheck, CheckCircle2, Car } from 'lucide-react';

export default function TradeInPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px 80px' }}>
      {/* Back Link */}
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-text-dim)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px', fontWeight: '700' }}>
        <ArrowLeft size={16} /> Back to Vehicle Inventory Matrix
      </Link>

      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>INSTANT VEHICLE VALUATION</div>
        <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>Vehicle Trade-In & Assessment Desk</h1>
        <p style={{ fontSize: '14px', color: 'var(--nexus-text-muted)' }}>Get an instant trade-in valuation credit estimate for your current vehicle toward your purchase.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <TradeInEstimatorWidget targetVehicleId="veh-001" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '14px' }}>
              How AETHEL Motors Trade-In Works
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '900', fontSize: '12px' }}>
                  1
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--nexus-text)', fontSize: '13px' }}>Submit Car Details & Mileage</div>
                  <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>Enter your vehicle's make, model, year, odometer, and condition.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '900', fontSize: '12px' }}>
                  2
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--nexus-text)', fontSize: '13px' }}>Receive Instant Trade Credit Range</div>
                  <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>Our dynamic pricing algorithm calculates your trade-in credit allowance.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '900', fontSize: '12px' }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--nexus-text)', fontSize: '13px' }}>Physical 150-Point Inspection & Final Offer</div>
                  <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>Bring your car to any showroom branch or request home inspection.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
