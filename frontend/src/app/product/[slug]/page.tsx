'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { VEHICLES, VehicleItem } from '../../../lib/vehicle-dataset';
import { Vehicle360Viewer } from '../../../components/automotive/Vehicle360Viewer';
import { FinanceCalculatorWidget } from '../../../components/automotive/FinanceCalculatorWidget';
import { TradeInEstimatorWidget } from '../../../components/automotive/TradeInEstimatorWidget';
import { TestDriveModal } from '../../../components/automotive/TestDriveModal';
import { ReservationModal } from '../../../components/automotive/ReservationModal';
import VehicleInquiryModal from '../../../components/automotive/VehicleInquiryModal';
import VehicleTradeInModal from '../../../components/automotive/VehicleTradeInModal';
import { Star, ShieldCheck, Truck, ArrowLeft, Heart, Layers, Gauge, Fuel, Sliders, Calendar, Lock, Car, CheckCircle2, Video } from 'lucide-react';
import Link from 'next/link';
import { getEmbedVideoUrl } from '../../../lib/vehicles';

export default function VehicleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { vehicles, wishlist, toggleWishlist, compareList, toggleCompare, openTestDriveModal, openReservationModal } = useStore();

  const vehicle = vehicles.find(v => v.id === slug || v.stockNumber.toLowerCase() === slug?.toLowerCase()) || vehicles[0] || VEHICLES[0];

  const [activeTab, setActiveTab] = useState<'360' | 'VIDEO' | 'GALLERY'>('360');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);

  const isWishlisted = wishlist.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);

  const videoWalkthroughUrl = (vehicle as any).video_url || (vehicle as any).youtubeUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const embedUrl = getEmbedVideoUrl(videoWalkthroughUrl);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 40px 80px' }}>
      {/* Back to Inventory Matrix */}
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-text-dim)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px', fontWeight: '700' }}>
        <ArrowLeft size={16} /> Back to Vehicle Inventory Matrix
      </Link>

      {/* Main Grid: Left Gallery/360/Video + Right Purchase/Reservation Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'start' }}>
        {/* Left Column: Media Showcase (360 Spin + HD Video Showcase + HD Photo Gallery) */}
        <div>
          {/* Switcher Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={() => setActiveTab('360')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '900',
                background: activeTab === '360' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-surface)',
                border: activeTab === '360' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                color: activeTab === '360' ? '#3B82F6' : 'var(--nexus-text-muted)',
                cursor: 'pointer'
              }}
            >
              360° Exterior Spin Simulator
            </button>
            <button
              onClick={() => setActiveTab('VIDEO')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '900',
                background: activeTab === 'VIDEO' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-surface)',
                border: activeTab === 'VIDEO' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                color: activeTab === 'VIDEO' ? '#3B82F6' : 'var(--nexus-text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Video size={14} /> HD Video Showcase
            </button>
            <button
              onClick={() => setActiveTab('GALLERY')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '900',
                background: activeTab === 'GALLERY' ? 'rgba(59, 130, 246, 0.2)' : 'var(--nexus-surface)',
                border: activeTab === 'GALLERY' ? '1px solid #3B82F6' : '1px solid var(--nexus-border)',
                color: activeTab === 'GALLERY' ? '#3B82F6' : 'var(--nexus-text-muted)',
                cursor: 'pointer'
              }}
            >
              HD Photo Showcase ({vehicle.images.length})
            </button>
          </div>

          {activeTab === '360' ? (
            <Vehicle360Viewer frames={vehicle.frames360} vehicleTitle={`${vehicle.make} ${vehicle.model}`} />
          ) : activeTab === 'VIDEO' ? (
            <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', height: '420px', marginBottom: '16px', background: '#000' }}>
              <iframe
                src={embedUrl || ''}
                title={`${vehicle.make} ${vehicle.model} Walkthrough Video`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div>
              <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', height: '420px', marginBottom: '16px' }}>
                <img
                  src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                  alt={vehicle.model}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: activeImageIndex === i ? '2px solid #3B82F6' : '1px solid var(--nexus-border)',
                      background: 'var(--nexus-surface)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '28px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>ENGINE OUTPUT</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.engine.powerHp} HP</div>
              <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '700' }}>{vehicle.engine.torqueNm} Nm Torque</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>0–100 KM/H</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.engine.zeroToHundredKm}s</div>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>Top: {vehicle.engine.topSpeedKm} km/h</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>TRANSMISSION</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.transmission.gears}-Spd</div>
              <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '700' }}>{vehicle.drivetrain.type}</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800' }}>FUEL & RANGE</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', margin: '4px 0' }}>{vehicle.fuelEnergy.rangeKm} km</div>
              <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700' }}>{vehicle.fuelEnergy.fuelType}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Purchasing, Reservation Lock & Specs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {vehicle.make} • VIN: {vehicle.vin}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleCompare(vehicle.id)}
                style={{ background: 'transparent', border: 'none', color: isCompared ? '#3B82F6' : 'var(--nexus-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}
              >
                <Layers size={16} /> {isCompared ? 'In Compare' : 'Compare'}
              </button>
              <button
                onClick={() => toggleWishlist(vehicle.id)}
                style={{ background: 'transparent', border: 'none', color: isWishlisted ? '#fb7185' : 'var(--nexus-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}
              >
                <Heart size={16} fill={isWishlisted ? '#fb7185' : 'none'} /> Wishlist
              </button>
            </div>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '4px', lineHeight: '1.2' }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <div style={{ fontSize: '14px', color: 'var(--nexus-text-muted)', fontWeight: '700', marginBottom: '20px' }}>
            {vehicle.trim}
          </div>

          {/* Price Box */}
          <div style={{ padding: '20px', background: 'var(--nexus-surface)', border: '1px solid var(--nexus-border)', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>CASH PRICE (DUTY PAID)</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', margin: '2px 0' }}>
                  ${vehicle.pricing.cashPrice.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '900', textTransform: 'uppercase' }}>ESTIMATED FINANCE</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#10B981' }}>
                  ${vehicle.pricing.estimatedMonthlyPayment}<span style={{ fontSize: '12px', color: 'var(--nexus-text-muted)' }}>/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIA 2 EXACT REPLICA: DIRECT CRM ACTIONS */}
          <div className="space-y-4 pt-2 mb-6">
            <div className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">DIRECT CRM ACTIONS</div>

            {/* Top 3 Action Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Action 1: Request Test Drive */}
              <button
                onClick={() => openTestDriveModal(vehicle.id)}
                className="p-3.5 bg-[#0a0a0a] border border-neutral-800 hover:border-[#c9a84c] rounded-2xl text-left transition-all group flex flex-col justify-between h-28 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] font-extrabold text-[#c9a84c] uppercase tracking-wider mb-1">
                    <span>ACTION 1</span>
                    <Calendar size={14} />
                  </div>
                  <div className="text-xs font-black text-white group-hover:text-[#c9a84c] transition-colors leading-tight">
                    Request Test Drive
                  </div>
                </div>
                <div className="text-[10px] text-neutral-400">Pre-fill schedule viewing</div>
              </button>

              {/* Action 2: Get Best Quote */}
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="p-3.5 bg-[#0a0a0a] border-2 border-[#c9a84c] rounded-2xl text-left transition-all group flex flex-col justify-between h-28 shadow-lg shadow-[#c9a84c]/10 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] font-extrabold text-[#c9a84c] uppercase tracking-wider mb-1">
                    <span>ACTION 2</span>
                    <Sliders size={14} />
                  </div>
                  <div className="text-xs font-black text-[#e5c158] leading-tight">
                    Get Best Quote
                  </div>
                </div>
                <div className="text-[10px] text-neutral-400">Custom location pricing</div>
              </button>

              {/* Action 3: Import / Reserve */}
              <button
                onClick={() => openReservationModal(vehicle.id)}
                className="p-3.5 bg-[#0a0a0a] border border-neutral-800 hover:border-[#c9a84c] rounded-2xl text-left transition-all group flex flex-col justify-between h-28 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] font-extrabold text-[#c9a84c] uppercase tracking-wider mb-1">
                    <span>ACTION 3</span>
                    <Car size={14} />
                  </div>
                  <div className="text-xs font-black text-white group-hover:text-[#c9a84c] transition-colors leading-tight">
                    Import / Reserve
                  </div>
                </div>
                <div className="text-[10px] text-neutral-400">Bespoke luxury specs</div>
              </button>
            </div>

            {/* Bottom 2 Large Full-width Buttons */}
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/254700000000?text=Hello%20KnK%20Automotive,%20I%20am%20interested%20in%20the%20${encodeURIComponent(vehicle.make + ' ' + vehicle.model)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all no-underline"
              >
                <Truck size={16} /> WHATSAPP DIRECT
              </a>

              <button
                onClick={() => setIsTradeInOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-[#3d3113] to-[#261f0a] border border-[#c9a84c]/60 hover:border-[#c9a84c] text-[#e5c158] font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Car size={16} className="text-[#c9a84c]" /> TRADE-IN YOUR CURRENT VEHICLE
              </button>
            </div>
          </div>

          {/* 150-Point Certified Inspection Badge */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-black text-emerald-400">
                <ShieldCheck size={18} />
                <span>150-Point Certified Inspection Score</span>
              </div>
              <span className="text-lg font-black text-emerald-400">
                {vehicle.inspection.score}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA 1 EXACT REPLICA: 4 HIGH-CONTRAST PERFORMANCE TELEMETRY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* Telemetry Card 1: Engine Output */}
        <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">ENGINE OUTPUT</span>
          <div>
            <div className="text-2xl font-black text-white">{(vehicle as any).horsepower || `${vehicle.engine?.powerHp || 204} HP`}</div>
            <div className="text-xs font-bold text-blue-400 mt-0.5">{(vehicle as any).torque || `${vehicle.engine?.torqueNm || 500} Nm Torque`}</div>
          </div>
        </div>

        {/* Telemetry Card 2: 0-100 KM/H Acceleration */}
        <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">0–100 KM/H</span>
          <div>
            <div className="text-2xl font-black text-white">{(vehicle as any).acceleration || `${vehicle.engine?.zeroToHundredKm || 9.2}s`}</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">Top: {(vehicle as any).top_speed || `${vehicle.engine?.topSpeedKm || 180} km/h`}</div>
          </div>
        </div>

        {/* Telemetry Card 3: Transmission */}
        <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">TRANSMISSION</span>
          <div>
            <div className="text-2xl font-black text-white">
              {typeof (vehicle as any).transmission === 'string' 
                ? (vehicle as any).transmission 
                : (vehicle.transmission?.type || '8-Spd')}
            </div>
            <div className="text-xs font-bold text-purple-400 mt-0.5">
              {typeof (vehicle as any).drivetrain === 'string'
                ? (vehicle as any).drivetrain
                : (vehicle.drivetrain?.type || '4WD')}
            </div>
          </div>
        </div>

        {/* Telemetry Card 4: Fuel & Range */}
        <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">FUEL & RANGE</span>
          <div>
            <div className="text-2xl font-black text-white">{(vehicle as any).fuel_range || `${vehicle.fuelEnergy?.rangeKm || 1390} km`}</div>
            <div className="text-xs font-black text-amber-500 tracking-wider mt-0.5 uppercase">{vehicle.fuelEnergy?.fuelType || 'DIESEL'}</div>
          </div>
        </div>
      </div>

      {/* DYNAMICALLY GENERATED HIGH-SPECIFICATION EQUIPMENT CHECKLIST */}
      {vehicle.features && vehicle.features.length > 0 && (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 space-y-4 mt-8">
          <h3 className="text-sm font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
            <Sliders size={18} /> High-Specification Equipment & Options Checklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-neutral-300">
            {(Array.isArray(vehicle.features) ? (
              typeof vehicle.features[0] === 'string'
                ? vehicle.features
                : vehicle.features.flatMap((f: any) => f.items || [])
            ) : []).map((ft: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#121212] border border-neutral-900 rounded-xl">
                <CheckCircle2 size={16} className="text-[#c9a84c] shrink-0" />
                <span>{ft}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO WALKTHROUGH PLAYER */}
      {(vehicle as any).video_url && getEmbedVideoUrl((vehicle as any).video_url) && (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 space-y-4 mt-8">
          <h3 className="text-sm font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
            <Video size={18} /> High-Definition Video Walkthrough
          </h3>
          <div className="w-full h-96 bg-black rounded-2xl overflow-hidden border border-neutral-800">
            <iframe
              src={getEmbedVideoUrl((vehicle as any).video_url) || ''}
              title="Vehicle Video Tour"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Dynamic Finance & Trade-In Widgets Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '48px' }}>
        <FinanceCalculatorWidget vehiclePrice={vehicle.pricing.cashPrice} vehicleTitle={`${vehicle.make} ${vehicle.model}`} />
        <TradeInEstimatorWidget targetVehicleId={vehicle.id} />
      </div>

      {/* Automotive Modals */}
      <TestDriveModal />
      <ReservationModal />
      <VehicleInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        vehiclePrice={vehicle.pricing?.cashPrice ? `KES ${Number(vehicle.pricing.cashPrice).toLocaleString()}` : 'KES 24,500,000'}
        vehicleImage={vehicle.images?.[0]}
      />
      <VehicleTradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        targetVehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        targetVehiclePrice={vehicle.pricing?.cashPrice ? `KES ${Number(vehicle.pricing.cashPrice).toLocaleString()}` : 'KES 24,500,000'}
        targetVehicleImage={vehicle.images?.[0]}
      />
    </div>
  );
}
