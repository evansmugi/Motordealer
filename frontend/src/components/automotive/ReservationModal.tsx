'use client';

import React, { useState } from 'react';
import { X, Check, Lock, ShieldCheck, CreditCard, DollarSign } from 'lucide-react';
import PredictiveSelect from '../common/PredictiveSelect';

interface ReservationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  vehicleTitle?: string;
  vehiclePrice?: string;
}

const PAYMENT_METHODS = [
  { value: 'M-Pesa Express / Paybill', label: 'M-Pesa Express / Paybill', badge: 'Instant' },
  { value: 'Bank Wire Transfer (RTGS)', label: 'Bank Wire Transfer (RTGS)', badge: 'Verified' },
  { value: 'Credit Card / Visa', label: 'Credit Card / Visa' }
];

export function ReservationModal({
  isOpen,
  onClose,
  vehicleTitle = '2024 Mercedes-Benz S 580 4MATIC',
  vehiclePrice = 'KES 24,500,000'
}: ReservationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    depositAmount: '500000',
    paymentMethod: 'M-Pesa Express / Paybill'
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
        onClose?.();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#0d0d0d] border border-[#c9a84c]/30 rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
        >
          <X size={20} />
        </button>

        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c9a84c] uppercase tracking-widest">
            <Lock size={16} /> Instant Deposit & Vehicle Lock
          </div>
          <h2 className="text-base font-extrabold text-white mt-1">{vehicleTitle}</h2>
          <p className="text-xs text-neutral-400">Locking vehicle against other buyers for 72 hours</p>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <Check size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase">Vehicle Holding Reserved</h3>
            <p className="text-xs text-neutral-400">Your deposit holding instruction has been logged. Payment prompt pushed to {form.phone}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Executive Partner"
                className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">M-Pesa / Mobile Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+254 700 000 000"
                className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Deposit Amount (KES)</label>
              <input
                type="number"
                value={form.depositAmount}
                onChange={(e) => setForm({ ...form, depositAmount: e.target.value })}
                className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Payment Method</label>
              <PredictiveSelect
                options={PAYMENT_METHODS}
                value={form.paymentMethod}
                onChange={(val) => setForm({ ...form, paymentMethod: val })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              {loading ? 'Processing...' : 'CONFIRM RESERVATION DEPOSIT'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReservationModal;
