'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle2, DollarSign, ShieldCheck, Car } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import PredictiveSelect from '../common/PredictiveSelect';

const MAKE_OPTIONS = [
  { value: 'Toyota', label: 'Toyota' },
  { value: 'BMW', label: 'BMW' },
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
  { value: 'Audi', label: 'Audi' },
  { value: 'Ford', label: 'Ford' },
  { value: 'Tesla', label: 'Tesla' },
  { value: 'Range Rover', label: 'Range Rover' },
  { value: 'Porsche', label: 'Porsche' },
  { value: 'Lexus', label: 'Lexus' },
  { value: 'Land Cruiser', label: 'Land Cruiser' }
];

const CONDITION_OPTIONS = [
  { value: 'EXCELLENT', label: 'Excellent (Mint condition, full records)', badge: '+15% Credit' },
  { value: 'VERY_GOOD', label: 'Very Good (Minor wear, well maintained)', badge: 'Standard' },
  { value: 'GOOD', label: 'Good (Normal wear, minor scuffs)', badge: '-12% Credit' },
  { value: 'FAIR', label: 'Fair (Requires reconditioning)', badge: '-25% Credit' }
];

export const TradeInEstimatorWidget: React.FC<{ targetVehicleId?: string }> = ({ targetVehicleId = 'veh-001' }) => {
  const { submitTradeIn, formatPrice } = useStore();

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

    setSubmittedNotice(`Trade-in valuation request submitted! Instant estimated credit: ${formatPrice(estimatedCredit)}.`);
    setTimeout(() => setSubmittedNotice(null), 6000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Widget Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
          <ArrowRightLeft size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Instant Vehicle Trade-In Valuation Engine
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Trade your current car for instant credit toward your next vehicle purchase.
          </p>
        </div>
      </div>

      {submittedNotice && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{submittedNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Make, Model, Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Vehicle Make</label>
            <PredictiveSelect
              options={MAKE_OPTIONS}
              value={make}
              onChange={(val) => setMake(val || 'Toyota')}
              placeholder="Select Make"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Model Name</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. 3 Series / M3"
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Model Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              placeholder="2020"
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
            />
          </div>
        </div>

        {/* Row 2: Odometer & Condition Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Current Odometer (KM)</label>
            <input
              type="number"
              value={mileageKm}
              onChange={(e) => setMileageKm(Number(e.target.value))}
              placeholder="45000"
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Condition Grade</label>
            <PredictiveSelect
              options={CONDITION_OPTIONS}
              value={conditionGrade}
              onChange={(val) => setConditionGrade((val as any) || 'VERY_GOOD')}
              placeholder="Select Condition"
            />
          </div>
        </div>

        {/* Dynamic Estimated Trade-In Valuation Credit Banner */}
        <div className="p-4 bg-[#121212] border border-[#c9a84c]/30 rounded-xl flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              ESTIMATED TRADE-IN CREDIT VALUE
            </span>
            <div className="text-2xl font-black text-[#c9a84c] mt-0.5">
              {formatPrice(estimatedCredit)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <ShieldCheck size={16} className="text-[#c9a84c]" />
            <span>Subject to Physical Inspection</span>
          </div>
        </div>

        {/* Customer Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+254 700 000 000"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 outline-none"
            />
          </div>
        </div>

        {/* Action Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#c9a84c]/20 cursor-pointer"
        >
          Submit Trade-In Valuation Request
        </button>
      </form>
    </div>
  );
};
