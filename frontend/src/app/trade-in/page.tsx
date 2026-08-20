'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { sendCrmLead } from '../../lib/crmLeadHelper';
import {
  Car, ArrowLeft, Sparkles, User, Phone, Mail, Camera, Eye, EyeOff,
  Upload, Check, Send, CheckCircle2, ShieldCheck, ArrowRightLeft,
  ChevronDown, Search, X, Calculator, Filter
} from 'lucide-react';

const RECOMMENDED_ANGLES = [
  { label: 'Front 3/4', icon: '🚘' },
  { label: 'Rear 3/4', icon: '🚗' },
  { label: 'Interior', icon: '💺' },
  { label: 'Odometer', icon: '⏲️' },
  { label: 'Engine', icon: '⚙️' },
  { label: 'Wheels', icon: '🛞' }
];

const DEFAULT_CAR_FALLBACK = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&auto=format&fit=crop';

export default function TradeInPage() {
  const { vehicles } = useStore();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShotAdvice, setShowShotAdvice] = useState(true);

  // Available showroom vehicles list for Target Vehicle selection
  const availableVehicles = vehicles && vehicles.length > 0 ? vehicles : [
    {
      id: '1',
      year: 2025,
      make: 'Toyota',
      model: 'Land Cruiser Prado',
      listing_title: '2025 TOYOTA LAND CRUISER PRADO',
      price: 8850000,
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop'],
      fuel: 'Diesel',
      transmission: 'Automatic'
    },
    {
      id: '2',
      year: 2024,
      make: 'Mercedes-Benz',
      model: 'AMG G 63',
      listing_title: '2024 MERCEDES-BENZ AMG G 63',
      price: 34500000,
      images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&auto=format&fit=crop'],
      fuel: 'Petrol',
      transmission: 'Automatic'
    },
    {
      id: '3',
      year: 2024,
      make: 'Porsche',
      model: 'Cayenne Turbo E-Hybrid',
      listing_title: '2024 PORSCHE CAYENNE TURBO E-HYBRID',
      price: 28000000,
      images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop'],
      fuel: 'Hybrid',
      transmission: 'PDK'
    }
  ];

  // Predictive Target Vehicle State
  const [selectedVehicleObj, setSelectedVehicleObj] = useState<any>(availableVehicles[0]);
  const [selectedTargetVehicle, setSelectedTargetVehicle] = useState<string>(
    (availableVehicles[0] as any)?.listing_title || `${availableVehicles[0]?.year || 2024} ${availableVehicles[0]?.make || ''} ${availableVehicles[0]?.model || ''}`.trim()
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [predictiveQuery, setPredictiveQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter vehicles predictively based on user query
  const filteredTargetVehicles = availableVehicles.filter((v: any) => {
    const title = (v.listing_title || `${v.year || ''} ${v.make || ''} ${v.model || ''}`).toLowerCase();
    const query = predictiveQuery.toLowerCase().trim();
    return !query || title.includes(query) || (v.make && v.make.toLowerCase().includes(query)) || (v.model && v.model.toLowerCase().includes(query));
  });

  const [form, setForm] = useState({
    clientName: 'John Kamau',
    clientPhone: '+254 712 345 678',
    clientEmail: 'john@example.com',
    tradeMake: 'Toyota',
    tradeModel: 'Land Cruiser Prado TX L',
    tradeYear: '2019',
    tradeMileage: '65,000 km',
    regNumber: 'KDD 123X',
    tradeCondition: 'Very Good (Minor Wear)',
    expectedValue: '4,500,000',
    notes: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
          notes: form.notes || `Dedicated Trade-In request for ${selectedTargetVehicle}`,
          photo_count: uploadedFiles.length,
          publishedAt: new Date().toISOString()
        }
      };

      await fetch('http://localhost:1338/api/trade-in-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi trade-in API warning:', err));

      // Synchronize lead directly with Strapi CRM Leads database & Admin Live Notifications
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
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans pb-20">
      
      {/* Top Header Banner & Navigation */}
      <div className="max-w-7xl mx-auto pt-8 px-6">
        <Link
          href="/vehicle"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Vehicle Showroom
        </Link>

        {/* Page Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-900 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 flex items-center gap-1.5">
                <ArrowRightLeft size={12} />
                INSTANT VEHICLE APPRAISAL PORTAL
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE APPRAISERS ONLINE
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
              Vehicle Trade-In & Assessment Desk
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 max-w-2xl mt-1">
              Submit your vehicle details, mileage, and condition for an instant trade-in credit allowance toward any vehicle in our showroom.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto mt-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Dedicated Trade-In Form (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">

            {submitted ? (
              <div className="bg-[#0c1220] border-2 border-emerald-500/50 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={44} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-extrabold uppercase text-emerald-400 tracking-widest">
                    APPRAISAL DOSSIER SUBMITTED
                  </span>
                  <h2 className="text-2xl font-black uppercase text-white">
                    Trade-In Valuation Logged Successfully
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
                    Your trade-in appraisal request for <strong className="text-white">{form.tradeYear} {form.tradeMake} {form.tradeModel}</strong> trading towards <strong className="text-[#c9a84c]">{selectedTargetVehicle}</strong> has been transmitted directly to our Senior Valuation Desk.
                  </p>
                </div>

                <div className="bg-[#050810] border border-neutral-800 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 text-xs font-mono">
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500 uppercase">Appraisal Reference:</span>
                    <span className="text-[#c9a84c] font-bold">KNK-TI-{(Math.random() * 8999 + 1000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500 uppercase">Client Name:</span>
                    <span className="text-white font-bold">{form.clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500 uppercase">Target Vehicle:</span>
                    <span className="text-white font-bold">{selectedTargetVehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase">Estimated Valuation:</span>
                    <span className="text-emerald-400 font-bold">KES {form.expectedValue}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-[#c9a84c] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e5c158] transition-all"
                >
                  Submit Another Trade-In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECTION 1: PREDICTIVE CUSTOM VEHICLE SELECTOR WITH COVER THUMBNAILS */}
                <div className="bg-[#0c1220] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl relative" ref={dropdownRef}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-extrabold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={16} />
                      <span>1. SELECT SHOWROOM TARGET VEHICLE (PREDICTIVE SEARCH)</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {availableVehicles.length} Vehicles In Stock
                    </span>
                  </div>

                  {/* Trigger Card: Displays currently selected vehicle with Thumbnail */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-[#050810] border-2 border-white/15 hover:border-[#c9a84c] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-inner group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Vehicle Cover Picture Thumbnail on Left */}
                      <img
                        src={selectedVehicleObj?.images?.[0] || selectedVehicleObj?.cover_image || DEFAULT_CAR_FALLBACK}
                        alt={selectedTargetVehicle}
                        className="w-16 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold uppercase text-white truncate group-hover:text-[#c9a84c] transition-colors">
                          {selectedTargetVehicle}
                        </div>
                        <div className="text-[11px] font-mono font-bold text-[#c9a84c] mt-0.5">
                          {selectedVehicleObj?.pricing?.cashPrice
                            ? `KES ${Number(selectedVehicleObj.pricing.cashPrice).toLocaleString()}`
                            : (selectedVehicleObj?.price ? `KES ${Number(selectedVehicleObj.price).toLocaleString()}` : 'SHOWROOM STOCK')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 group-hover:text-white transition-colors hidden sm:inline">
                        {isDropdownOpen ? 'CLOSE SEARCH' : 'CHANGE CAR'}
                      </span>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#c9a84c] text-[#c9a84c]">
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Floating Predictive Dropdown Panel */}
                  {isDropdownOpen && (
                    <div className="absolute left-6 right-6 top-full mt-2 bg-[#070b16] border-2 border-[#c9a84c]/60 rounded-3xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      
                      {/* Predictive Search Input Field */}
                      <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9a84c]" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type make or model... (e.g. Prado, AMG, Porsche, Mercedes, BMW)"
                          value={predictiveQuery}
                          onChange={(e) => setPredictiveQuery(e.target.value)}
                          className="w-full bg-[#03050a] border border-[#c9a84c]/40 text-white placeholder:text-neutral-500 text-xs font-mono font-bold rounded-2xl pl-10 pr-9 py-3 outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
                        />
                        {predictiveQuery && (
                          <button
                            type="button"
                            onClick={() => setPredictiveQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-400 px-1">
                        <span>MATCHING VEHICLES ({filteredTargetVehicles.length})</span>
                        <span className="text-[#c9a84c]">SELECT ANY VEHICLE FOR APPRAISAL</span>
                      </div>

                      {/* Scrollable Vehicle List with Thumbnails */}
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1 crm-scroll">
                        {filteredTargetVehicles.length === 0 ? (
                          <div className="p-8 text-center text-xs font-mono text-neutral-400">
                            No vehicles matching "<span className="text-white">{predictiveQuery}</span>" found in stock.
                          </div>
                        ) : (
                          filteredTargetVehicles.map((v: any, index: number) => {
                            const title = v.listing_title || `${v.year || 2024} ${v.make || ''} ${v.model || ''}`.trim();
                            const priceStr = v.pricing?.cashPrice
                              ? `KES ${Number(v.pricing.cashPrice).toLocaleString()}`
                              : (v.price ? `KES ${Number(v.price).toLocaleString()}` : 'AVAILABLE FOR SALE');
                            const isSelected = selectedTargetVehicle === title;
                            const coverImg = v.images?.[0] || v.cover_image || DEFAULT_CAR_FALLBACK;

                            return (
                              <div
                                key={v.id || index}
                                onClick={() => {
                                  setSelectedVehicleObj(v);
                                  setSelectedTargetVehicle(title);
                                  setIsDropdownOpen(false);
                                  setPredictiveQuery('');
                                }}
                                className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-[#c9a84c]/25 via-[#e5c158]/15 to-[#c9a84c]/10 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/10'
                                    : 'bg-[#050810] border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {/* COVER PIC THUMBNAIL ON THE LEFT */}
                                  <img
                                    src={coverImg}
                                    alt={title}
                                    className="w-16 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow-sm"
                                  />
                                  <div className="min-w-0">
                                    <div className={`text-xs font-extrabold uppercase truncate ${isSelected ? 'text-[#c9a84c]' : 'text-white'}`}>
                                      {title}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[11px] font-mono font-bold text-[#c9a84c]">{priceStr}</span>
                                      {v.fuel && (
                                        <span className="text-[9px] font-mono uppercase bg-white/10 text-neutral-300 px-1.5 py-0.5 rounded-md">
                                          {v.fuel}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="w-7 h-7 rounded-full bg-[#c9a84c] text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                                    <Check size={14} />
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: YOUR CONTACT INFORMATION */}
                <div className="bg-[#0c1220] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="text-xs font-mono font-extrabold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                    <User size={16} />
                    <span>2. YOUR CONTACT INFORMATION</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Kamau"
                          value={form.clientName}
                          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                          className="w-full bg-[#050810] border border-white/15 text-white rounded-xl pl-9 pr-3 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="tel"
                          required
                          placeholder="+254 7XX XXX XXX"
                          value={form.clientPhone}
                          onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                          className="w-full bg-[#050810] border border-white/15 text-white rounded-xl pl-9 pr-3 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={form.clientEmail}
                          onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                          className="w-full bg-[#050810] border border-white/15 text-white rounded-xl pl-9 pr-3 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: YOUR CURRENT VEHICLE DETAILS */}
                <div className="bg-[#0c1220] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="text-xs font-mono font-extrabold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                    <Car size={16} />
                    <span>3. YOUR CURRENT VEHICLE DETAILS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Make *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Toyota"
                        value={form.tradeMake}
                        onChange={(e) => setForm({ ...form, tradeMake: e.target.value })}
                        className="w-full bg-[#050810] border border-white/15 text-white rounded-xl px-3.5 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Model *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Prado TX L"
                        value={form.tradeModel}
                        onChange={(e) => setForm({ ...form, tradeModel: e.target.value })}
                        className="w-full bg-[#050810] border border-white/15 text-white rounded-xl px-3.5 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Year
                      </label>
                      <input
                        type="text"
                        placeholder="2019"
                        value={form.tradeYear}
                        onChange={(e) => setForm({ ...form, tradeYear: e.target.value })}
                        className="w-full bg-[#050810] border border-white/15 text-white rounded-xl px-3.5 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Current Mileage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 65,000 km"
                        value={form.tradeMileage}
                        onChange={(e) => setForm({ ...form, tradeMileage: e.target.value })}
                        className="w-full bg-[#050810] border border-white/15 text-white rounded-xl px-3.5 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Registration No. (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. KDD 123X"
                        value={form.regNumber}
                        onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                        className="w-full bg-[#050810] border border-white/15 text-white rounded-xl px-3.5 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Vehicle Condition Grade
                      </label>
                      <div className="relative">
                        <select
                          value={form.tradeCondition}
                          onChange={(e) => setForm({ ...form, tradeCondition: e.target.value })}
                          className="w-full bg-[#050810] border border-white/15 text-white rounded-xl px-3.5 py-3 text-xs font-mono font-semibold outline-none appearance-none cursor-pointer focus:border-[#c9a84c] transition-all"
                        >
                          <option value="Very Good (Minor Wear)">Very Good (Minor Wear)</option>
                          <option value="Excellent (Like New)">Excellent (Like New)</option>
                          <option value="Good Condition">Good Condition</option>
                          <option value="Fair">Fair</option>
                          <option value="Needs Work">Needs Work</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                        Expected Trade Value (KES)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 4,500,000"
                        value={form.expectedValue}
                        onChange={(e) => setForm({ ...form, expectedValue: e.target.value })}
                        className="w-full bg-[#050810] border border-white/15 text-[#c9a84c] font-bold rounded-xl px-3.5 py-3 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider mb-1.5">
                      Additional Vehicle Notes / Modifications / Service Records
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention custom modifications, accident history, service records, or extra features..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full bg-[#050810] border border-white/15 text-white rounded-xl p-3.5 text-xs font-mono outline-none resize-none focus:border-[#c9a84c] transition-all"
                    />
                  </div>
                </div>

                {/* SECTION 4: UPLOAD VEHICLE PHOTOS */}
                <div className="bg-[#0c1220] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-extrabold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                      <Camera size={16} />
                      <span>4. UPLOAD VEHICLE PHOTOS ({uploadedFiles.length} ATTACHED)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowShotAdvice(!showShotAdvice)}
                      className="text-[10px] font-mono font-bold text-neutral-400 hover:text-[#c9a84c] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {showShotAdvice ? <EyeOff size={12} /> : <Eye size={12} />}
                      <span>{showShotAdvice ? 'Hide Shot Advice' : 'Show Shot Advice'}</span>
                    </button>
                  </div>

                  {/* Recommended Photo Angles Grid */}
                  {showShotAdvice && (
                    <div className="bg-[#050810] border border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="text-[10px] font-mono font-bold text-[#c9a84c] uppercase tracking-wider">
                        RECOMMENDED PHOTO ANGLES FOR FASTEST APPRAISAL
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {RECOMMENDED_ANGLES.map((angle) => (
                          <div
                            key={angle.label}
                            className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center"
                          >
                            <div className="text-lg">{angle.icon}</div>
                            <div className="text-[10px] font-mono font-bold text-neutral-300 mt-1 truncate">
                              {angle.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Drag & Drop Upload Zone */}
                  <label className="w-full bg-[#050810] border-2 border-dashed border-white/20 hover:border-[#c9a84c] hover:bg-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="p-3.5 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40">
                      <Upload size={24} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Click or drop vehicle photos for instant appraisal
                      </p>
                      <p className="text-[10px] font-mono text-neutral-500">
                        Supports JPG, PNG, WEBP (Up to 10 photos recommended)
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                        {uploadedFiles.map((file, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Check size={12} />
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </label>
                </div>

                {/* Submit Trade-In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#c9a84c] via-[#e5c158] to-[#c9a84c] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#c9a84c]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={18} />
                  <span>{loading ? 'TRANSMITTING TRADE-IN APPRAISAL...' : 'SUBMIT TRADE-IN FOR INSTANT APPRAISAL'}</span>
                </button>

              </form>
            )}

          </div>

          {/* Right Column: How Trade-In Works & Assurance Panel (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">

            {/* How KnK Trade-In Works Card */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-4">
                <div className="p-2 rounded-xl bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40">
                  <Calculator size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#c9a84c] uppercase">HOW IT WORKS</div>
                  <h3 className="text-sm font-black uppercase text-white">KnK Trade-In Process</h3>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">Submit Vehicle Details & Photos</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      Enter your current vehicle make, model, year, odometer, and upload photos for appraisal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">Receive Instant Credit Allowance</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      Our dynamic valuation pricing algorithm calculates your guaranteed trade-in credit allowance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">150-Point Physical Inspection</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      Bring your car to our Nairobi showroom branch or request home inspection to finalize trade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KnK Valuation Guarantees Panel */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <ShieldCheck size={18} className="text-[#c9a84c]" />
                <span>Trade-In Guarantees</span>
              </div>

              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Fair Market Value Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Logbook & Ownership Transfer Assistance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Multi-Currency Credit Settlement (KES / USD)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Same-Day Inspection & Showroom Handover</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
