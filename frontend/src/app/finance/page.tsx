'use client';

import React from 'react';
import Link from 'next/link';
import { FinanceCalculatorWidget } from '../../components/automotive/FinanceCalculatorWidget';
import { useStore } from '../../context/StoreContext';
import { VEHICLES } from '../../lib/vehicle-dataset';
import { Calculator, ArrowLeft, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export default function FinancePage() {
  const { vehicles } = useStore();
  const featuredVehicle = vehicles[0] || VEHICLES[0];

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px 80px' }}>
      {/* Back Link */}
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-text-dim)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px', fontWeight: '700' }}>
        <ArrowLeft size={16} /> Back to Vehicle Inventory Matrix
      </Link>

      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>AUTOMOTIVE FINANCIAL SERVICES</div>
        <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>Vehicle Financing & Pre-Approval Portal</h1>
        <p style={{ fontSize: '14px', color: 'var(--nexus-text-muted)' }}>Flexible auto loans, sub-10 minute pre-approval rates, and transparent interest calculations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <FinanceCalculatorWidget vehiclePrice={featuredVehicle.pricing.cashPrice} vehicleTitle={`${featuredVehicle.make} ${featuredVehicle.model}`} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '14px' }}>
              Why Finance Your Vehicle with AETHEL Motors?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--nexus-text)', fontSize: '13px' }}>Sub-10 Minute Digital Pre-Approval</div>
                  <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>Get pre-approved without impacting your credit score.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--nexus-text)', fontSize: '13px' }}>Fixed Low APR Interest Rates</div>
                  <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>Competitive rates starting from 9.5% APR across all premier lenders.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--nexus-text)', fontSize: '13px' }}>Balloon & Flexible Term Options</div>
                  <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>Tailor loan terms from 24 to 72 months with optional residual balloon payments.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
