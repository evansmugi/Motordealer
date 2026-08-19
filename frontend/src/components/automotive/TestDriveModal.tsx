'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { VEHICLES, BRANCHES } from '../../lib/vehicle-dataset';
import { X, CheckCircle2, User, Phone, Mail, MapPin, Calendar, Sparkles, Send, Sun, Lock } from 'lucide-react';
import { sendCrmLead } from '../../lib/crmLeadHelper';

export const TestDriveModal: React.FC = () => {
  const { vehicles, testDriveVehicleId, openTestDriveModal, bookTestDrive } = useStore();

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
          appointment_type: 'Request Test Drive',
          notes: requests || `Test Drive telemetry booking for ${vehicleTitle}`,
          publishedAt: new Date().toISOString()
        }
      };
      await fetch('http://localhost:1338/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Strapi test drive API warning:', err));

      // Feed lead directly into Strapi CRM Leads database
      await sendCrmLead({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        source: 'Request Test Drive Modal',
        notes: `Test Drive telemetry booking for ${vehicleTitle} at ${location}`,
        intentScore: 90,
        intentTier: 'HOT'
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
      <div className="w-full max-w-lg bg-[#090d16] border border-[#c9a84c]/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#c9a84c] uppercase tracking-widest">
              <Sparkles size={14} className="text-[#c9a84c]" /> VEHICLE DIRECT TELEMETRY
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Request Test Drive</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-neutral-400 hover:text-[#c9a84c] p-1.5 rounded-full hover:bg-[#121622] transition-colors">
              <Sun size={16} />
            </button>
            <button
              onClick={() => openTestDriveModal(null)}
              className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-[#121622] transition-colors"
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
            <h3 className="text-base font-bold text-white uppercase tracking-wide">Telemetry Inquiry Submitted</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Your test drive viewing for <strong className="text-white">{vehicleTitle}</strong> has been logged in KnK CRM. An advisor will reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Preview Card (Media 1 replica) */}
            <div className="bg-[#121622] border border-[#1e2638] rounded-2xl p-3 flex items-center gap-3">
              <img src={vehicleImage} alt={vehicleTitle} className="w-16 h-12 rounded-xl object-cover border border-[#1e2638]" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{vehicleTitle}</h4>
                <div className="text-[11px] font-extrabold text-[#c9a84c] mt-0.5">{vehiclePriceFormatted}</div>
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
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
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
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-8 py-2.5 text-xs text-white outline-none"
                  />
                  <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Delivery Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none appearance-none"
                  >
                    <option value="Nairobi Showroom [HQ]">Nairobi Showroom [HQ]</option>
                    <option value="Mombasa Showroom">Mombasa Showroom</option>
                    <option value="Home / Office Delivery">Home / Office Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">PREFERRED VIEWING DATE *</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#121622] border border-[#1e2638] focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">SPECIFIC REQUESTS / CUSTOM SPECS</label>
              <textarea
                rows={2}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
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
              <span>{loading ? 'Transmitting Telemetry...' : 'SUBMIT TELEMETRY INQUIRY'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
