'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { VEHICLES, BRANCHES } from '../../lib/vehicle-dataset';
import { Calendar, Clock, MapPin, X, CheckCircle2, Car } from 'lucide-react';

export const TestDriveModal: React.FC = () => {
  const { testDriveVehicleId, openTestDriveModal, bookTestDrive } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [branchId, setBranchId] = useState('br-central');
  const [preferredDate, setPreferredDate] = useState('2026-08-22');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:30 AM');
  const [driveType, setDriveType] = useState<'SHOWROOM' | 'HOME_DELIVERY'>('SHOWROOM');
  const [confirmed, setConfirmed] = useState(false);

  if (!testDriveVehicleId) return null;

  const vehicle = VEHICLES.find((v) => v.id === testDriveVehicleId) || VEHICLES[0];
  const selectedBranch = BRANCHES.find((b) => b.id === branchId) || BRANCHES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail) return;

    bookTestDrive({
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.trim})`,
      customerName,
      customerPhone,
      customerEmail,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      preferredDate,
      preferredTimeSlot,
      driveType,
      salespersonName: 'Assigned Senior Consultant',
      status: 'SCHEDULED'
    });

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      openTestDriveModal(null);
    }, 2500);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px', width: '500px', maxWidth: '100%', position: 'relative' }}>
        <button
          onClick={() => openTestDriveModal(null)}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--nexus-text-muted)', fontSize: '20px', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {confirmed ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#10B981' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '8px' }}>Test Drive Scheduled!</h3>
            <p style={{ fontSize: '13px', color: 'var(--nexus-text-muted)' }}>
              Your test drive for the <strong>{vehicle.make} {vehicle.model}</strong> at {selectedBranch.name} is confirmed for {preferredDate} at {preferredTimeSlot}.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <Car size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--nexus-text)', margin: 0 }}>Book VIP Test Drive</h3>
                <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800' }}>
                  {vehicle.year} {vehicle.make} {vehicle.model} • Stock #{vehicle.stockNumber}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Drive Location Selection */}
              <div>
                <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Select Dealership Branch</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>

              {/* Date & Time Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Time Slot</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    style={{ width: '100%', background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--nexus-text)', fontSize: '12px', fontWeight: '700' }}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Drive Type Radio */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setDriveType('SHOWROOM')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '800',
                    background: driveType === 'SHOWROOM' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-bg)',
                    border: driveType === 'SHOWROOM' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                    color: driveType === 'SHOWROOM' ? '#3B82F6' : 'var(--nexus-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Showroom Visit
                </button>
                <button
                  type="button"
                  onClick={() => setDriveType('HOME_DELIVERY')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '800',
                    background: driveType === 'HOME_DELIVERY' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-bg)',
                    border: driveType === 'HOME_DELIVERY' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                    color: driveType === 'HOME_DELIVERY' ? '#3B82F6' : 'var(--nexus-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Home / Office Delivery
                </button>
              </div>

              {/* Customer Contact Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{ background: 'var(--nexus-bg)', border: '1px solid var(--nexus-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--nexus-text)', fontSize: '12px', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="nexus-btn-primary" style={{ height: '48px', width: '100%', fontSize: '13px', marginTop: '8px' }}>
                Confirm VIP Test Drive Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
