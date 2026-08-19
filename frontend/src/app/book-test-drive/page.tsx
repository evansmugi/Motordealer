'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Check, Car, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import ModernDatePicker from '../../components/common/ModernDatePicker';
import StyledTimePicker from '../../components/common/StyledTimePicker';
import PredictiveSelect from '../../components/common/PredictiveSelect';

const VEHICLE_OPTIONS = [
  { value: '2024 Mercedes-Benz S 580 4MATIC', label: '2024 Mercedes-Benz S 580 4MATIC', badge: 'Flagship' },
  { value: '2024 Porsche Cayenne Turbo E-Hybrid', label: '2024 Porsche Cayenne Turbo E-Hybrid', badge: 'Performance' },
  { value: '2023 Range Rover Autobiography LWB', label: '2023 Range Rover Autobiography LWB', badge: 'Luxury SUV' },
  { value: '2024 BMW M8 Competition Gran Coupe', label: '2024 BMW M8 Competition Gran Coupe', badge: 'Coupe' }
];

export default function BookTestDrivePage() {
  const [date, setDate] = useState('2026-08-22');
  const [time, setTime] = useState('10:00 AM');
  const [selectedVehicle, setSelectedVehicle] = useState('2024 Mercedes-Benz S 580 4MATIC');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 800);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/vehicle" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase">
            <ArrowLeft size={16} /> Back to Showroom
          </Link>
          <span className="text-sm font-bold text-[#c9a84c] uppercase">Showroom Appointment Scheduler</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">VIP Showroom Viewing</span>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Schedule Private Viewing & Test Drive</h1>
          <p className="text-xs text-neutral-400">Select your preferred date and time slot for a private concierge appointment.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl space-y-6">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <Check size={24} />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Appointment Confirmed</h3>
              <p className="text-xs text-neutral-400">
                Your viewing for <span className="text-[#c9a84c] font-bold">{selectedVehicle}</span> on <span className="text-white font-bold">{date} at {time}</span> has been scheduled.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Target Vehicle Dossier *</label>
                <PredictiveSelect
                  options={VEHICLE_OPTIONS}
                  value={selectedVehicle}
                  onChange={setSelectedVehicle}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Appointment Date *</label>
                  <ModernDatePicker
                    value={date}
                    onChange={setDate}
                    placeholder="Select viewing date"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Time Slot *</label>
                  <StyledTimePicker
                    value={time}
                    onChange={setTime}
                    placeholder="Select viewing time"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-900 pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sir James Harrison"
                    className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="james@example.com"
                      className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                {loading ? 'Scheduling...' : 'CONFIRM SHOWROOM APPOINTMENT'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
