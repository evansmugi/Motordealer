'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FinanceCalculatorProps {
  vehiclePrice: number;
  vehicleTitle?: string;
}

export const FinanceCalculatorWidget: React.FC<FinanceCalculatorProps> = ({ vehiclePrice, vehicleTitle = 'Vehicle' }) => {
  const { formatPrice } = useStore();
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
    setAppliedNotice(`Pre-approval request submitted for ${vehicleTitle}! Estimated Monthly: ${formatPrice(totalMonthly)}/mo.`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Widget Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Automotive Finance & Credit Estimator
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time monthly repayment breakdown & instant pre-approval.
          </p>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{appliedNotice}</span>
        </div>
      )}

      <form onSubmit={handleApplyPreApproval} className="space-y-4">
        {/* Deposit Percentage Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
            <span>Deposit Downpayment ({depositPercent}%)</span>
            <span className="text-[#c9a84c] font-mono text-sm">{formatPrice(depositAmount)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={depositPercent}
            onChange={(e) => setDepositPercent(Number(e.target.value))}
            className="w-full accent-[#c9a84c] bg-[#121212] rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Loan Term Selector Buttons */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-2">
            Loan Term Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[24, 36, 48, 60].map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setLoanTermMonths(months)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  loanTermMonths === months
                    ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#e5c158]'
                    : 'bg-[#121212] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {months} Mos ({months / 12} Yrs)
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate & Insurance Checkbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Interest Rate (APR %)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono font-bold"
            />
          </div>

          <div className="pb-1">
            <label className="flex items-center gap-2 text-xs text-neutral-300 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeInsurance}
                onChange={(e) => setIncludeInsurance(e.target.checked)}
                className="w-4 h-4 accent-[#c9a84c] rounded cursor-pointer"
              />
              Include GAP Insurance ({formatPrice(120)}/mo)
            </label>
          </div>
        </div>

        {/* Financial Repayment Output Box */}
        <div className="p-4 bg-[#121212] border border-[#c9a84c]/30 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              ESTIMATED MONTHLY PAYMENT
            </span>
            <div className="text-2xl font-black text-[#c9a84c] mt-0.5">
              {formatPrice(totalMonthly)}
              <span className="text-xs text-neutral-400 font-semibold">/mo</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 font-mono">
              Principal: {formatPrice(loanPrincipal)} • Total: {formatPrice(totalPayable)}
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#c9a84c]/20 flex items-center gap-2 cursor-pointer"
          >
            Apply Pre-Approval <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
