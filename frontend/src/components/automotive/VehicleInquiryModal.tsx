'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, User, Phone, Mail, Sparkles, Send, Sun, Moon, Lock } from 'lucide-react';
import { sendCrmLead } from '../../lib/crmLeadHelper';

interface VehicleInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle?: string;
  vehiclePrice?: string;
  vehicleImage?: string;
}

export default function VehicleInquiryModal({
  isOpen,
  onClose,
  vehicleTitle = '2024 Mercedes-Benz S 580 4MATIC',
  vehiclePrice = 'KES 24,500,000',
  vehicleImage = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
}: VehicleInquiryModalProps) {
  const [modalTheme, setModalTheme] = useState<'dark' | 'light'>('dark');
  const isLight = modalTheme === 'light';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: 'James Mwangi',
    phone: '+254 712 345 678',
    email: 'james@domain.com',
    paymentPreference: 'Cash Purchase',
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
          client_email: form.email,
          appointment_type: 'Get Best Quote',
          vehicle_title: vehicleTitle,
          vehicle_price: vehiclePrice,
          payment_preference: form.paymentPreference,
          notes: form.notes || `Best Quote request for ${vehicleTitle}`,
          publishedAt: new Date().toISOString()
        }
      };
      await fetch('http://localhost:1338/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi inquiry API warning:', err));

      // Feed lead directly into Strapi CRM Leads database & trigger Admin Live Notification
      await sendCrmLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        source: 'Get Best Quote Modal',
        notes: `Quote inquiry for ${vehicleTitle} (${vehiclePrice}) with payment preference: ${form.paymentPreference}`,
        intentScore: 80,
        intentTier: 'HIGH',
        targetVehicle: vehicleTitle
      });
    } catch (err) {
      console.error('Failed to post inquiry:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 relative border transition-all ${
        isLight
          ? 'bg-slate-50 border-amber-500/60 text-slate-900 shadow-slate-400/50'
          : 'bg-[#090d16] border-[#c9a84c]/40 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
      }`}>
        {/* Top Header Bar */}
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-[#1e2638]'
        }`}>
          <div>
            <div className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest ${
              isLight ? 'text-amber-800' : 'text-[#c9a84c]'
            }`}>
              <Sparkles size={14} className={isLight ? 'text-amber-800' : 'text-[#c9a84c]'} /> VEHICLE DIRECT TELEMETRY
            </div>
            <h2 className={`text-lg font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Get Best Price Quote
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Toggle Theme"
              onClick={() => setModalTheme(isLight ? 'dark' : 'light')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'text-neutral-400 hover:text-[#c9a84c] hover:bg-[#121622] border-transparent'
              }`}
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              type="button"
              title="Close Modal"
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-400 hover:text-white hover:bg-[#121622]'
              }`}
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
            <h3 className={`text-base font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Quote Request Submitted
            </h3>
            <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Your quote inquiry for <strong className={isLight ? 'text-slate-900' : 'text-white'}>{vehicleTitle}</strong> has been transmitted to KnK VIP Sales Desk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Preview Card */}
            <div className={`border rounded-2xl p-3 flex items-center gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#121622] border-[#1e2638]'
            }`}>
              <img src={vehicleImage} alt={vehicleTitle} className={`w-16 h-12 rounded-xl object-cover border ${
                isLight ? 'border-slate-200' : 'border-[#1e2638]'
              }`} />
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-black uppercase tracking-wide truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{vehicleTitle}</h4>
                <div className={`text-[11px] font-extrabold mt-0.5 ${
                  isLight ? 'text-amber-800' : 'text-[#c9a84c]'
                }`}>{vehiclePrice}</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}>FULL NAME *</label>
                <div className="relative">
                  <User size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-amber-600'
                        : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}>PHONE NUMBER *</label>
                <div className="relative">
                  <Phone size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-amber-600'
                        : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}>EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full border rounded-xl pl-9 pr-8 py-2.5 text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-amber-600'
                        : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                    }`}
                  />
                  <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}>PAYMENT METHOD</label>
                <select
                  value={form.paymentPreference}
                  onChange={(e) => setForm({ ...form, paymentPreference: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none appearance-none font-semibold ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-600'
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                >
                  <option value="Cash Purchase">Cash Purchase</option>
                  <option value="Bank Financing">Bank Financing</option>
                  <option value="Trade-In + Top Up">Trade-In + Top Up</option>
                  <option value="Corporate Asset Lease">Corporate Lease</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                isLight ? 'text-slate-700' : 'text-neutral-400'
              }`}>ADDITIONAL NOTES / FINANCING TERM</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Mention expected deposit amount, lease duration, or target price..."
                className={`w-full border rounded-xl p-3 text-xs outline-none resize-none ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-medium'
                    : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 font-extrabold rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:opacity-95 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black hover:opacity-90 shadow-[#c9a84c]/20'
              }`}
            >
              <Send size={14} />
              <span>{loading ? 'Processing Quote...' : 'REQUEST OFFICIAL QUOTE'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
