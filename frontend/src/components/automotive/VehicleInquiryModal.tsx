'use client';

import React, { useState } from 'react';
import { X, Check, Car, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import PredictiveSelect from '../common/PredictiveSelect';

interface VehicleInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle?: string;
  vehiclePrice?: string;
}

const FINANCING_OPTIONS = [
  { value: 'Cash Purchase', label: 'Cash Purchase', badge: 'Fast Track' },
  { value: 'Bank Financing', label: 'Bank Financing', badge: 'Pre-Approved' },
  { value: 'Trade-In + Top Up', label: 'Trade-In + Top Up', badge: 'Popular' },
  { value: 'Asset Lease', label: 'Corporate Asset Lease' }
];

export default function VehicleInquiryModal({
  isOpen,
  onClose,
  vehicleTitle = '2024 Mercedes-Benz S 580 4MATIC',
  vehiclePrice = 'KES 24,500,000'
}: VehicleInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    paymentPreference: 'Cash Purchase',
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
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-[#0d0d0d] border border-[#c9a84c]/30 rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
        >
          <X size={20} />
        </button>

        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c9a84c] uppercase tracking-widest">
            <Car size={16} /> Instant Price & Dossier Quote
          </div>
          <h2 className="text-lg font-extrabold text-white mt-1">{vehicleTitle}</h2>
          <p className="text-xs text-neutral-400">Offered at <span className="text-[#c9a84c] font-bold">{vehiclePrice}</span></p>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <Check size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase">Inquiry Received</h3>
            <p className="text-xs text-neutral-400">An executive sales advisor has been notified and will contact you via WhatsApp / Phone.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Name *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Lord Alexander Vance"
                  className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Phone / WhatsApp *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alexander@vance.co"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Payment Preference</label>
              <PredictiveSelect
                options={FINANCING_OPTIONS}
                value={form.paymentPreference}
                onChange={(val) => setForm({ ...form, paymentPreference: val })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Additional Client Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Specific trade-in details or viewing schedule requests..."
                className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              {loading ? 'Submitting...' : 'SUBMIT VIP INQUIRY'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
