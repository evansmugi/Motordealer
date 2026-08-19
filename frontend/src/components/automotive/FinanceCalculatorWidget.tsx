'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface FinanceCalculatorProps {
  vehiclePrice: number;
  vehicleTitle?: string;
}

export const FinanceCalculatorWidget: React.FC<FinanceCalculatorProps> = ({ vehiclePrice, vehicleTitle = 'Vehicle' }) => {
  const [depositPercent, setDepositPercent] = useState<number>(15);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(11.5);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Financial Loan Calculations
  const depositAmount = (vehiclePrice * depositPercent) / 100;
  const loanPrincipal = Math.max(0, vehiclePrice - depositAmount);
  const monthlyInterestRate = interestRate / 12 / 100;
  
  const monthlyPayment = loanPrincipal > 0
    ? (loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
    : 0;

  const insuranceMonthly = includeInsurance ? 120 : 0;
  const totalMonthly = monthlyPayment + insuranceMonthly;
  const totalPayable = totalMonthly * loanTermMonths + depositAmount;

  const handleApplyPreApproval = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedNotice(`Pre-approval request submitted for ${vehicleTitle}! Estimated Monthly: $${Math.round(totalMonthly)}/mo.`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  return (
    <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
          <Calculator size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)', margin: 0 }}>
            Automotive Finance & Credit Estimator
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>
            Real-time monthly repayment breakdown & instant pre-approval.
          </div>
        </div>
      </div>

      {appliedNotice && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#10B981', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <CheckCircle2 size={18} /> {appliedNotice}
        </div>
      )}

      <form onSubmit={handleApplyPreApproval} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Deposit Percentage Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: 'var(--nexus-text)', marginBottom: '8px' }}>
            <span>Deposit Downpayment ({depositPercent}%)</span>
            <span style={{ color: '#3B82F6' }}>${depositAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={depositPercent}
            onChange={(e) => setDepositPercent(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3B82F6' }}
          />
        </div>

        {/* Loan Term Selector Buttons */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--nexus-text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Loan Term Duration
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[24, 36, 48, 60].map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setLoanTermMonths(months)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '800',
                  background: loanTermMonths === months ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-bg)',
                  border: loanTermMonths === months ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                  color: loanTermMonths === months ? '#3B82F6' : 'var(--nexus-text-muted)',
                  cursor: 'pointer'
                }}
              >
                {months} Mos ({months / 12} Yrs)
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate & Insurance Checkbox */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Interest Rate (APR %)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '13px', fontWeight: '800', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--nexus-text-muted)', cursor: 'pointer', fontWeight: '700' }}>
              <input
                type="checkbox"
                checked={includeInsurance}
                onChange={(e) => setIncludeInsurance(e.target.checked)}
                style={{ accentColor: '#3B82F6' }}
              />
              Include GAP Insurance ($120/mo)
            </label>
          </div>
        </div>

        {/* Financial Repayment Output Box */}
        <div style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>ESTIMATED MONTHLY PAYMENT</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#10B981', margin: '4px 0' }}>
              ${Math.round(totalMonthly).toLocaleString()}
              <span style={{ fontSize: '14px', color: 'var(--nexus-text-muted)', fontWeight: '600' }}>/mo</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)' }}>
              Principal Amount: ${Math.round(loanPrincipal).toLocaleString()} • Total Loan Cost: ${Math.round(totalPayable).toLocaleString()}
            </div>
          </div>

          <button
            type="submit"
            className="nexus-btn-primary"
            style={{ height: '48px', padding: '0 24px', fontSize: '12px' }}
          >
            Apply Pre-Approval <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
