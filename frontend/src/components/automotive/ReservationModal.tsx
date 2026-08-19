'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, User, Phone, Mail, Sparkles, Send, Sun, Lock } from 'lucide-react';
import PredictiveSelect from '../common/PredictiveSelect';
import { sendCrmLead } from '../../lib/crmLeadHelper';

interface ReservationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  vehicleTitle?: string;
  vehiclePrice?: string;
  vehicleImage?: string;
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
  vehiclePrice = 'KES 24,500,000',
  vehicleImage = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
}: ReservationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: 'James Mwangi',
    phone: '+254 712 345 678',
    email: 'james@domain.com',
    depositAmount: '500000',
    paymentMethod: 'M-Pesa Express / Paybill',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        data: {
          client_name: form.name,
          client_phone: form.phone,
          client_email: form.email || `${form.phone.replace(/[^0-9]/g, '')}@motordealer.co.ke`,
          vehicle_title: vehicleTitle,
          deposit_amount: String(form.depositAmount),
          payment_method: form.paymentMethod,
          appointment_type: 'Import / Reserve',
          notes: form.notes || `Vehicle Deposit Holding of KES ${Number(form.depositAmount).toLocaleString()} via ${form.paymentMethod} for ${vehicleTitle}`,
          publishedAt: new Date().toISOString()
        }
      };
      await fetch('http://localhost:1338/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi reservation API warning:', err));

      // Feed lead directly into Strapi CRM Leads database
      await sendCrmLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        source: 'Import / Reserve Deposit Modal',
        notes: `Deposit reservation of KES ${Number(form.depositAmount).toLocaleString()} via ${form.paymentMethod} for ${vehicleTitle}`,
        intentScore: 95,
        intentTier: 'HOT'
      });
    } catch (err) {
      console.error('Failed to post reservation:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose?.();
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-[#090d16] border border-[#c9a84c]/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#c9a84c] uppercase tracking-widest">
              <Sparkles size={14} className="text-[#c9a84c]" /> VEHICLE DIRECT TELEMETRY
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Import / Bespoke Vehicle Reservation</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-neutral-400 hover:text-[#c9a84c] p-1.5 rounded-full hover:bg-[#121622] transition-colors">
              <Sun size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-[#121622] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">Reservation Telemetry Logged</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Holding deposit request of KES {Number(form.depositAmount).toLocaleString()} for <strong className="text-white">{vehicleTitle}</strong> has been received.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Preview Card (Media 1 Replica) */}
            <div className="bg-[#121622] border border-[#1e2638] rounded-2xl p-3 flex items-center gap-3">
              <img src={vehicleImage} alt={vehicleTitle} className="w-16 h-12 rounded-xl object-cover border border-[#1e2638]" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{vehicleTitle}</h4>
                <div className="text-[11px] font-extrabold text-[#c9a84c]">{vehiclePrice}</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">FULL NAME *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">PHONE NUMBER *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-8 py-2.5 text-xs text-white outline-none"
                  />
                  <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">DEPOSIT AMOUNT (KES)</label>
                <input
                  type="number"
                  value={form.depositAmount}
                  onChange={(e) => setForm({ ...form, depositAmount: e.target.value })}
                  className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">PAYMENT CHANNEL</label>
              <PredictiveSelect
                options={PAYMENT_METHODS}
                value={form.paymentMethod}
                onChange={(val) => setForm({ ...form, paymentMethod: val })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">SPECIFIC REQUESTS / CUSTOM SPECS</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Mention trade-in valuation, custom options, or financing requirements..."
                className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl p-3 text-xs text-white outline-none resize-none"
              />
            </div>

            {/* Media 1 Gold Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold rounded-full text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20"
            >
              <Send size={14} />
              <span>{loading ? 'Transmitting Reservation...' : 'SUBMIT TELEMETRY INQUIRY'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default ReservationModal;
