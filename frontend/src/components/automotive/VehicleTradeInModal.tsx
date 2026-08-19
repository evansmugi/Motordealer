'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X, CheckCircle2, User, Phone, Mail, Sparkles, Send, Sun, Moon,
  Car, Upload, Camera, Eye, EyeOff, ChevronDown, Check, AlertCircle, ShieldCheck
} from 'lucide-react';
import { sendCrmLead } from '../../lib/crmLeadHelper';

interface VehicleTradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetVehicleName?: string;
  targetVehiclePrice?: string;
  targetVehicleImage?: string;
}

const RECOMMENDED_ANGLES = [
  { label: 'Front 3/4', icon: '🚘' },
  { label: 'Rear 3/4', icon: '🚗' },
  { label: 'Interior', icon: '💺' },
  { label: 'Odometer', icon: '⏲️' },
  { label: 'Engine', icon: '⚙️' },
  { label: 'Wheels', icon: '🛞' }
];

export default function VehicleTradeInModal({
  isOpen,
  onClose,
  targetVehicleName = '2024 Mercedes-Benz S 580 4MATIC',
  targetVehiclePrice = 'KES 24,500,000',
  targetVehicleImage = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
}: VehicleTradeInModalProps) {
  const { vehicles } = useStore();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isLight = theme === 'light';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShotAdvice, setShowShotAdvice] = useState(true);

  // Showroom vehicles list for Section 1 selector
  const availableVehicles = vehicles && vehicles.length > 0 ? vehicles : [
    { id: '1', year: 2024, make: 'Mercedes-Benz', model: 'S 580 4MATIC', pricing: { cashPrice: '24500000' } },
    { id: '2', year: 2024, make: 'Porsche', model: 'Cayenne Turbo E-Hybrid', pricing: { cashPrice: '28000000' } },
    { id: '3', year: 2023, make: 'Range Rover', model: 'Autobiography LWB', pricing: { cashPrice: '32500000' } }
  ];

  const [selectedTargetVehicle, setSelectedTargetVehicle] = useState(targetVehicleName);

  const [form, setForm] = useState({
    clientName: 'John Kamau',
    clientPhone: '+254 712 345 678',
    clientEmail: 'john@example.com',
    tradeMake: 'Toyota',
    tradeModel: 'Prado TX L',
    tradeYear: '2019',
    tradeMileage: '65,000 km',
    regNumber: 'KDD 123X',
    tradeCondition: 'Very Good (Minor Wear)',
    expectedValue: '4,500,000',
    notes: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

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
          trade_mileage: form.tradeMileage,
          registration_number: form.regNumber,
          trade_condition: form.tradeCondition,
          expected_value: form.expectedValue,
          target_vehicle: selectedTargetVehicle,
          notes: form.notes || `Trade-in request for ${selectedTargetVehicle}`,
          photo_count: uploadedFiles.length,
          publishedAt: new Date().toISOString()
        }
      };

      await fetch('http://localhost:1338/api/trade-in-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi trade-in API warning:', err));

      // Feed lead directly into Strapi CRM Leads database & trigger Admin Live Notification
      await sendCrmLead({
        name: form.clientName,
        phone: form.clientPhone,
        email: form.clientEmail,
        source: 'Trade-In Vehicle Assessment Portal',
        notes: `Trade-in requested: ${form.tradeYear} ${form.tradeMake} ${form.tradeModel} (${form.tradeMileage}, ${form.tradeCondition}) trading for ${selectedTargetVehicle}. Reg: ${form.regNumber}`,
        intentScore: 90,
        intentTier: 'HOT',
        tradeVehicle: `${form.tradeYear} ${form.tradeMake} ${form.tradeModel}`,
        targetVehicle: selectedTargetVehicle,
        expectedValue: form.expectedValue
      });
    } catch (err) {
      console.error('Failed to post trade-in request:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans overflow-y-auto crm-scroll">
      <div className={`w-full max-w-4xl rounded-3xl p-6 shadow-2xl transition-all relative border-2 my-auto ${
        isLight
          ? 'bg-slate-50 border-amber-500/60 text-slate-900 shadow-slate-400/50'
          : 'bg-[#070b14] border-[#c9a84c]/60 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
      }`}>

        {/* Modal Header Bar */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40'
            }`}>
              <Car size={22} />
            </div>
            <div>
              <div className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${
                isLight ? 'text-amber-800' : 'text-[#c9a84c]'
              }`}>
                KNK AUTOMOTIVE SHOWROOM TRADE-IN PORTAL
              </div>
              <h2 className={`text-lg sm:text-xl font-serif font-bold mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Trade In Your Vehicle for Showroom Stock
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isLight
                  ? 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200'
                  : 'bg-white/10 border-white/20 text-[#c9a84c] hover:bg-white/20'
              }`}
            >
              {isLight ? <Moon size={14} /> : <Sun size={14} />}
              <span>{isLight ? 'DARK THEME' : 'LIGHT THEME'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className={`text-xl font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Trade-In Appraisal Logged Successfully
            </h3>
            <p className={`text-xs max-w-md mx-auto font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Your appraisal request for <strong className={isLight ? 'text-slate-900' : 'text-white'}>{form.tradeYear} {form.tradeMake} {form.tradeModel}</strong> trading towards <strong className={isLight ? 'text-slate-900' : 'text-white'}>{selectedTargetVehicle}</strong> has been transmitted to KnK Senior Valuation Team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            
            {/* SECTION 1: SELECT SHOWROOM TARGET VEHICLE */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c1220] border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-amber-800' : 'text-[#c9a84c]'
                }`}>
                  <Sparkles size={14} />
                  <span>1. SELECT SHOWROOM TARGET VEHICLE (STOCK INVENTORY)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  {availableVehicles.length} Vehicles in Stock
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedTargetVehicle}
                  onChange={(e) => setSelectedTargetVehicle(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none appearance-none cursor-pointer transition-all ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-600'
                      : 'bg-[#050810] border-white/15 text-white focus:border-[#c9a84c]'
                  }`}
                >
                  {availableVehicles.map((v: any, i: number) => {
                    const title = v.listing_title || `${v.year || 2024} ${v.make || ''} ${v.model || ''}`.trim();
                    const priceStr = v.pricing?.cashPrice ? `KES ${Number(v.pricing.cashPrice).toLocaleString()}` : (v.price ? `KES ${Number(v.price).toLocaleString()}` : 'AVAILABLE FOR SALE');
                    return (
                      <option key={v.id || i} value={title}>
                        {title.toUpperCase()} — {priceStr}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown size={16} className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isLight ? 'text-slate-500' : 'text-[#c9a84c]'
                }`} />
              </div>
            </div>

            {/* SECTION 2: YOUR CONTACT INFORMATION */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c1220] border-white/10'
            }`}>
              <div className={`text-xs font-mono font-extrabold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                isLight ? 'text-amber-800' : 'text-[#c9a84c]'
              }`}>
                <User size={14} />
                <span>2. YOUR CONTACT INFORMATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Full Name *</label>
                  <div className="relative">
                    <User size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Kamau"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono outline-none ${
                        isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                          : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Phone Number *</label>
                  <div className="relative">
                    <Phone size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                    <input
                      type="tel"
                      required
                      placeholder="+254 7XX XXX XXX"
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                      className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono outline-none ${
                        isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                          : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Email Address</label>
                  <div className="relative">
                    <Mail size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono outline-none ${
                        isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                          : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: YOUR CURRENT VEHICLE DETAILS */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c1220] border-white/10'
            }`}>
              <div className={`text-xs font-mono font-extrabold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                isLight ? 'text-amber-800' : 'text-[#c9a84c]'
              }`}>
                <Car size={14} />
                <span>3. YOUR CURRENT VEHICLE DETAILS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota"
                    value={form.tradeMake}
                    onChange={(e) => setForm({ ...form, tradeMake: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                        : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prado TX L"
                    value={form.tradeModel}
                    onChange={(e) => setForm({ ...form, tradeModel: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                        : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Manufacture Year</label>
                  <input
                    type="text"
                    placeholder="2019"
                    value={form.tradeYear}
                    onChange={(e) => setForm({ ...form, tradeYear: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                        : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Current Mileage</label>
                  <input
                    type="text"
                    placeholder="e.g. 65,000 km"
                    value={form.tradeMileage}
                    onChange={(e) => setForm({ ...form, tradeMileage: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                        : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Registration No. (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. KDD 123X"
                    value={form.regNumber}
                    onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-semibold'
                        : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Vehicle Condition</label>
                  <div className="relative">
                    <select
                      value={form.tradeCondition}
                      onChange={(e) => setForm({ ...form, tradeCondition: e.target.value })}
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono font-semibold outline-none appearance-none cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-600'
                          : 'bg-[#050810] border-white/15 text-white focus:border-[#c9a84c]'
                      }`}
                    >
                      <option value="Very Good (Minor Wear)">Very Good (Minor Wear)</option>
                      <option value="Excellent (Like New)">Excellent (Like New)</option>
                      <option value="Good Condition">Good Condition</option>
                      <option value="Fair">Fair</option>
                      <option value="Needs Work">Needs Work</option>
                    </select>
                    <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isLight ? 'text-slate-500' : 'text-neutral-400'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    isLight ? 'text-slate-700' : 'text-neutral-400'
                  }`}>Expected Trade Value (KES)</label>
                  <input
                    type="text"
                    placeholder="e.g. 4,500,000"
                    value={form.expectedValue}
                    onChange={(e) => setForm({ ...form, expectedValue: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono font-bold outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600'
                        : 'bg-[#050810] border-white/15 text-[#c9a84c] placeholder:text-neutral-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${
                  isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}>Additional vehicle details / comments</label>
                <textarea
                  rows={2}
                  placeholder="Mention custom modifications, accident history, service records, or extra features..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={`w-full border rounded-xl p-3 text-xs font-mono outline-none resize-none ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600'
                      : 'bg-[#050810] border-white/15 text-white placeholder:text-neutral-600 focus:border-[#c9a84c]'
                  }`}
                />
              </div>
            </div>

            {/* SECTION 4: UPLOAD VEHICLE PHOTOS */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c1220] border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-amber-800' : 'text-[#c9a84c]'
                }`}>
                  <Camera size={14} />
                  <span>4. UPLOAD VEHICLE PHOTOS ({uploadedFiles.length} ATTACHED)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowShotAdvice(!showShotAdvice)}
                  className={`text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-amber-800' : 'text-neutral-400 hover:text-[#c9a84c]'
                  }`}
                >
                  {showShotAdvice ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showShotAdvice ? 'Hide Shot Advice' : 'Show Shot Advice'}</span>
                </button>
              </div>

              {/* Recommended Photo Angles Grid */}
              {showShotAdvice && (
                <div className={`p-3 rounded-xl border mb-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#050810] border-white/10'
                }`}>
                  <div className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ${
                    isLight ? 'text-amber-900' : 'text-[#c9a84c]'
                  }`}>
                    RECOMMENDED PHOTO ANGLES FOR FASTEST APPRAISAL
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {RECOMMENDED_ANGLES.map((angle) => (
                      <div
                        key={angle.label}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-white/5 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="text-base">{angle.icon}</div>
                        <div className="text-[10px] font-mono font-bold mt-1 truncate">{angle.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drag & Drop Upload Zone */}
              <label className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-300 hover:border-amber-600 hover:bg-amber-50/50 text-slate-800'
                  : 'bg-[#050810] border-white/20 hover:border-[#c9a84c] hover:bg-white/5 text-slate-200'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className={`p-3 rounded-full border ${
                  isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40'
                }`}>
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider">
                    Click or drop vehicle photos for instant appraisal
                  </p>
                  <p className={`text-[10px] font-mono mt-0.5 ${
                    isLight ? 'text-slate-500' : 'text-neutral-500'
                  }`}>
                    Supports JPG, PNG, WEBP (Up to 10 photos recommended)
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                    {uploadedFiles.map((file, i) => (
                      <span key={i} className="px-2 py-1 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check size={10} />
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:opacity-95 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-[#c9a84c] via-amber-500 to-amber-600 text-slate-950 hover:opacity-95 shadow-[#c9a84c]/30'
              }`}
            >
              <Send size={16} />
              <span>{loading ? 'TRANSMITTING TRADE-IN APPRAISAL...' : 'SUBMIT TRADE-IN FOR APPRAISAL'}</span>
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
