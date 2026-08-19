'use client';

import React, { useState } from 'react';
import { RefreshCw, ArrowRightLeft, CheckCircle2, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TradeInEstimatorWidget: React.FC<{ targetVehicleId?: string }> = ({ targetVehicleId = 'veh-001' }) => {
  const { submitTradeIn } = useStore();

  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('3 Series / M3');
  const [year, setYear] = useState(2020);
  const [mileageKm, setMileageKm] = useState(45000);
  const [conditionGrade, setConditionGrade] = useState<'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR'>('VERY_GOOD');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // Dynamic Valuation Algorithm
  const baseValue = year >= 2022 ? 38000 : year >= 2019 ? 28000 : 18000;
  const mileageDeduction = Math.min(10000, (mileageKm / 1000) * 150);
  const conditionMultiplier = conditionGrade === 'EXCELLENT' ? 1.15 : conditionGrade === 'VERY_GOOD' ? 1.0 : conditionGrade === 'GOOD' ? 0.88 : 0.75;

  const estimatedCredit = Math.max(5000, Math.round((baseValue - mileageDeduction) * conditionMultiplier));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail) return;

    submitTradeIn({
      customerName,
      customerPhone,
      customerEmail,
      make,
      model,
      year,
      mileageKm,
      conditionGrade,
      estimatedCreditValue: estimatedCredit,
      targetVehicleId,
      status: 'SUBMITTED'
    });

    setSubmittedNotice(`Valuation request submitted! Instant Trade-In Credit Estimate: $${estimatedCredit.toLocaleString()}.`);
    setTimeout(() => setSubmittedNotice(null), 5000);
  };

  return (
    <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
          <ArrowRightLeft size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)', margin: 0 }}>
            Instant Vehicle Trade-In Valuation Engine
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>
            Trade your current car for instant credit toward your next vehicle purchase.
          </div>
        </div>
      </div>

      {submittedNotice && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#10B981', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <CheckCircle2 size={18} /> {submittedNotice}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Make</label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
            >
              <option value="Toyota">Toyota</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
              <option value="Ford">Ford</option>
              <option value="Tesla">Tesla</option>
              <option value="Range Rover">Range Rover</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Model Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Current Odometer (KM)</label>
            <input
              type="number"
              value={mileageKm}
              onChange={(e) => setMileageKm(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Condition Grade</label>
            <select
              value={conditionGrade}
              onChange={(e) => setConditionGrade(e.target.value as any)}
              style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
            >
              <option value="EXCELLENT">Excellent (Mint condition, full records)</option>
              <option value="VERY_GOOD">Very Good (Minor wear, well maintained)</option>
              <option value="GOOD">Good (Normal wear, minor scuffs)</option>
              <option value="FAIR">Fair (Requires reconditioning)</option>
            </select>
          </div>
        </div>

        {/* Live Estimated Valuation Credit Box */}
        <div style={{ padding: '16px', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>ESTIMATED TRADE-IN CREDIT VALUE</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981' }}>
              ${estimatedCredit.toLocaleString()}
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--nexus-text-muted)', fontWeight: '700' }}>Subject to Physical Inspection</span>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input
            type="text"
            placeholder="Your Full Name *"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
          />
          <input
            type="email"
            placeholder="Email Address *"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
          />
        </div>

        <button type="submit" className="nexus-btn-primary" style={{ height: '44px', width: '100%', fontSize: '12px' }}>
          Submit Trade-In Valuation Request
        </button>
      </form>
    </div>
  );
};
