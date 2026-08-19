'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, User, Phone, Mail, Sparkles, Send, Sun, Lock, RefreshCw, Car } from 'lucide-react';
import PredictiveSelect from '../common/PredictiveSelect';
import { sendCrmLead } from '../../lib/crmLeadHelper';

interface VehicleTradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetVehicleName?: string;
  targetVehiclePrice?: string;
  targetVehicleImage?: string;
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
  targetVehicleName = '2024 Mercedes-Benz S 580 4MATIC',
  targetVehiclePrice = 'KES 24,500,000',
  targetVehicleImage = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
}: VehicleTradeInModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clientName: 'James Mwangi',
    clientPhone: '+254 712 345 678',
    clientEmail: 'james@domain.com',
    tradeMake: 'Mercedes-Benz',
    tradeModel: 'E 300 Coupe',
    tradeYear: '2021',
    tradeMileage: '32000',
    tradeCondition: 'Mint / Excellent',
    expectedValue: '7500000',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        data: {
          client_name: form.clientName,
          client_phone: form.clientPhone,
          client_email: form.clientEmail,
          trade_make: form.tradeMake,
          trade_model: form.tradeModel,
          trade_year: form.tradeYear,
          trade_mileage: String(form.tradeMileage),
          trade_condition: form.tradeCondition,
          expected_value: String(form.expectedValue),
          target_vehicle: targetVehicleName,
          notes: form.notes || `Trade-in request for ${targetVehicleName}`,
          publishedAt: new Date().toISOString()
        }
      };
      await fetch('http://localhost:1338/api/trade-in-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi trade-in API warning:', err));

      // Feed lead directly into Strapi CRM Leads database
      await sendCrmLead({
        name: form.clientName,
        phone: form.clientPhone,
        email: form.clientEmail,
        source: 'Trade-In Vehicle Assessment Modal',
        notes: `Trade-in assessment requested: ${form.tradeYear} ${form.tradeMake} ${form.tradeModel} (${form.tradeMileage} KM) trading towards ${targetVehicleName}`,
        intentScore: 85,
        intentTier: 'HOT'
      });
    } catch (err) {
      console.error('Failed to post trade-in request:', err);
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
      <div className="w-full max-w-lg bg-[#090d16] border border-[#c9a84c]/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#c9a84c] uppercase tracking-widest">
              <Sparkles size={14} className="text-[#c9a84c]" /> VEHICLE DIRECT TELEMETRY
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Trade-In Vehicle Assessment</h2>
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
            <h3 className="text-base font-bold text-white uppercase tracking-wide">Trade-In Telemetry Transmitted</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Our chief master assessor will review your <strong className="text-white">{form.tradeYear} {form.tradeMake} {form.tradeModel}</strong> specs and issue a binding valuation within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Vehicle Preview Card (Media 1 Replica) */}
            <div className="bg-[#121622] border border-[#1e2638] rounded-2xl p-3 flex items-center gap-3">
              <img src={targetVehicleImage} alt={targetVehicleName} className="w-16 h-12 rounded-xl object-cover border border-[#1e2638]" />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-[#c9a84c] font-bold uppercase tracking-wider">Trading towards target:</div>
                <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{targetVehicleName}</h4>
                <div className="text-[11px] font-extrabold text-[#c9a84c]">{targetVehiclePrice}</div>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">FULL NAME *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
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
                    value={form.clientPhone}
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                    className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Current Vehicle Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">TRADE MAKE *</label>
                <PredictiveSelect
                  options={MAKE_OPTIONS}
                  value={form.tradeMake}
                  onChange={(val) => setForm({ ...form, tradeMake: val })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">MODEL *</label>
                <input
                  type="text"
                  required
                  value={form.tradeModel}
                  onChange={(e) => setForm({ ...form, tradeModel: e.target.value })}
                  className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">YEAR / KM</label>
                <input
                  type="text"
                  value={`${form.tradeYear} • ${form.tradeMileage} KM`}
                  onChange={(e) => setForm({ ...form, tradeYear: e.target.value })}
                  className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">EXPECTED TRADE-IN VALUE (KES)</label>
              <input
                type="number"
                value={form.expectedValue}
                onChange={(e) => setForm({ ...form, expectedValue: e.target.value })}
                placeholder="e.g. 7,500,000"
                className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            {/* Media 1 Gold Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold rounded-full text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20"
            >
              <Send size={14} />
              <span>{loading ? 'Submitting Assessment...' : 'SUBMIT TRADE-IN TELEMETRY'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
