'use client';

import React, { useState } from 'react';
import { X, Check, RefreshCw, Car, DollarSign, ArrowRight, Upload } from 'lucide-react';
import PredictiveSelect from '../common/PredictiveSelect';

interface VehicleTradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetVehicleName?: string;
}

const MAKE_OPTIONS = [
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz', badge: 'German' },
  { value: 'BMW', label: 'BMW', badge: 'German' },
  { value: 'Audi', label: 'Audi', badge: 'German' },
  { value: 'Toyota', label: 'Toyota', badge: 'Japanese' },
  { value: 'Land Rover', label: 'Land Rover', badge: 'British' },
  { value: 'Lexus', label: 'Lexus', badge: 'Japanese' }
];

const CONDITION_OPTIONS = [
  { value: 'Mint / Excellent', label: 'Mint / Excellent', badge: 'Full History' },
  { value: 'Good Condition', label: 'Good Condition', badge: 'Minor Wear' },
  { value: 'Fair', label: 'Fair', badge: 'Needs Service' }
];

export default function VehicleTradeInModal({
  isOpen,
  onClose,
  targetVehicleName = '2024 Mercedes-Benz S 580 4MATIC'
}: VehicleTradeInModalProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    tradeMake: 'Mercedes-Benz',
    tradeModel: 'E 300 Coupe',
    tradeYear: '2021',
    tradeMileage: '32000',
    tradeCondition: 'Mint / Excellent',
    expectedValue: '7500000',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setStep(1);
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-[#0d0d0d] border border-[#c9a84c]/30 rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
        >
          <X size={20} />
        </button>

        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c9a84c] uppercase tracking-widest">
            <RefreshCw size={16} /> Instant Trade-In Valuation Request
          </div>
          <h2 className="text-sm font-bold text-white mt-1">Trading towards: <span className="text-[#c9a84c]">{targetVehicleName}</span></h2>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <Check size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase">Valuation Request Submitted</h3>
            <p className="text-xs text-neutral-400">Our chief auto assessor will review your vehicle specs and issue a binding trade-in valuation within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Step 1: Your Current Vehicle Specs</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Make *</label>
                    <PredictiveSelect
                      options={MAKE_OPTIONS}
                      value={form.tradeMake}
                      onChange={(val) => setForm({ ...form, tradeMake: val })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Model *</label>
                    <input
                      type="text"
                      required
                      value={form.tradeModel}
                      onChange={(e) => setForm({ ...form, tradeModel: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Year</label>
                    <input
                      type="text"
                      value={form.tradeYear}
                      onChange={(e) => setForm({ ...form, tradeYear: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Mileage (KM)</label>
                    <input
                      type="number"
                      value={form.tradeMileage}
                      onChange={(e) => setForm({ ...form, tradeMileage: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Condition</label>
                    <PredictiveSelect
                      options={CONDITION_OPTIONS}
                      value={form.tradeCondition}
                      onChange={(val) => setForm({ ...form, tradeCondition: val })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Expected Trade-In Value (KES)</label>
                  <input
                    type="number"
                    value={form.expectedValue}
                    onChange={(e) => setForm({ ...form, expectedValue: e.target.value })}
                    placeholder="e.g. 7,500,000"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e5c158]"
                >
                  NEXT: CONTACT DETAILS <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Step 2: Client Contact Information</h4>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. David Croft"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      placeholder="david@example.com"
                      className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 border border-neutral-700 text-neutral-300 font-semibold rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90"
                  >
                    {loading ? 'Submitting...' : 'SUBMIT TRADE-IN DOSSIER'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
