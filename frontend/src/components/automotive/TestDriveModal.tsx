'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { VEHICLES } from '../../lib/vehicle-dataset';
import { X, CheckCircle2, User, Phone, Mail, MapPin, Sparkles, Send, Sun, Moon, Lock } from 'lucide-react';
import { sendCrmLead } from '../../lib/crmLeadHelper';
import { LuxuryDatePicker } from '../common/LuxuryDatePicker';

export const TestDriveModal: React.FC = () => {
  const { vehicles, testDriveVehicleId, openTestDriveModal, bookTestDrive } = useStore();

  const [modalTheme, setModalTheme] = useState<'dark' | 'light'>('dark');
  const isLight = modalTheme === 'light';

  const [customerName, setCustomerName] = useState('James Mwangi');
  const [customerPhone, setCustomerPhone] = useState('+254 712 345 678');
  const [customerEmail, setCustomerEmail] = useState('james@domain.com');
  const [location, setLocation] = useState('Nairobi Showroom [HQ]');
  const [preferredDate, setPreferredDate] = useState('2026-08-22');
  const [requests, setRequests] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!testDriveVehicleId) return null;

  const vehicle = (vehicles.length > 0 ? vehicles : VEHICLES).find((v) => v.id === testDriveVehicleId) || vehicles[0] || VEHICLES[0];
  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`.trim();
  const vehiclePriceFormatted = vehicle.pricing?.cashPrice
    ? `KES ${Number(vehicle.pricing.cashPrice).toLocaleString()}`
    : ((vehicle as any).price || 'KES 24,500,000');
  const vehicleImage = vehicle.heroImage || (vehicle.images && vehicle.images[0]) || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setLoading(true);
    bookTestDrive({
      vehicleId: vehicle.id,
      vehicleName: vehicleTitle,
      customerName,
      customerPhone,
      customerEmail,
      branchId: 'nairobi-hq',
      branchName: location,
      preferredDate,
      preferredTimeSlot: '10:30 AM',
      driveType: location.includes('Home') ? 'HOME_DELIVERY' : 'SHOWROOM',
      salespersonName: 'Senior Concierge Advisor',
      status: 'SCHEDULED'
    });

    try {
      const payload = {
        data: {
          client_name: customerName,
          client_phone: customerPhone,
          client_email: customerEmail,
          vehicle_title: vehicleTitle,
          appointment_date: preferredDate,
          time_slot: '10:30 AM',
          branch_name: location,
          notes: requests || `Test drive booking request for ${vehicleTitle}`,
          publishedAt: new Date().toISOString()
        }
      };

      await fetch('http://localhost:1338/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi appointment API warning:', err));

      // Feed lead directly into Strapi CRM Leads database & trigger Admin Live Notification
      await sendCrmLead({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        source: 'Request Test Drive Modal',
        notes: `Test drive requested for ${vehicleTitle} on ${preferredDate} at ${location}. Specs note: ${requests}`,
        intentScore: 90,
        intentTier: 'HOT',
        targetVehicle: vehicleTitle
      });
    } catch (err) {
      console.error('Failed to post test drive booking:', err);
    } finally {
      setLoading(false);
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        openTestDriveModal(null);
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
              Request Test Drive
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalTheme(isLight ? 'dark' : 'light')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'text-neutral-400 hover:text-[#c9a84c] hover:bg-[#121622] border-transparent'
              }`}
              title="Toggle Modal Theme"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              type="button"
              onClick={() => openTestDriveModal(null)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-400 hover:text-white hover:bg-[#121622]'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {confirmed ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h3 className={`text-base font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Telemetry Inquiry Submitted
            </h3>
            <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Your test drive viewing for <strong className={isLight ? 'text-slate-900' : 'text-white'}>{vehicleTitle}</strong> has been logged in KnK CRM. An advisor will reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Preview Card (Media 1 replica) */}
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
                }`}>{vehiclePriceFormatted}</div>
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
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-amber-600'
                        : 'bg-[#121622] border-[#1e2638] text-white focus:border-[#c9a84c]'
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
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-amber-600'
                        : 'bg-[#121622] border-[#1e2638] text-white focus:border-[#c9a84c]'
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
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-8 py-2.5 text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-amber-600'
                        : 'bg-[#121622] border-[#1e2638] text-white focus:border-[#c9a84c]'
                    }`}
                  />
                  <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}>Delivery Location</label>
                <div className="relative">
                  <MapPin size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none appearance-none font-semibold ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-600'
                        : 'bg-[#121622] border-[#1e2638] text-white focus:border-[#c9a84c]'
                    }`}
                  >
                    <option value="Nairobi Showroom [HQ]">Nairobi Showroom [HQ]</option>
                    <option value="Mombasa Showroom">Mombasa Showroom</option>
                    <option value="Home / Office Delivery">Home / Office Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            <LuxuryDatePicker
              value={preferredDate}
              onChange={(dateStr) => setPreferredDate(dateStr)}
              label="PREFERRED VIEWING DATE *"
              placeholder="08/22/2026"
              theme={modalTheme}
            />

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                isLight ? 'text-slate-700' : 'text-neutral-400'
              }`}>SPECIFIC REQUESTS / CUSTOM SPECS</label>
              <textarea
                rows={2}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="Mention trade-in valuation, custom options, or financing requirements..."
                className={`w-full border rounded-xl p-3 text-xs outline-none resize-none ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-600 font-medium'
                    : 'bg-[#121622] border-[#1e2638] text-white focus:border-[#c9a84c]'
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
              <span>{loading ? 'Transmitting Telemetry...' : 'SUBMIT TELEMETRY INQUIRY'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
