'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, Check, ShieldCheck, Calendar, Video, ArrowLeft, Lock, ShoppingBag, Key, MessageCircle, RefreshCw, Zap } from 'lucide-react';
import VehicleInquiryModal from '../../../components/automotive/VehicleInquiryModal';
import VehicleTradeInModal from '../../../components/automotive/VehicleTradeInModal';
import ReservationModal from '../../../components/automotive/ReservationModal';
import { TestDriveModal } from '../../../components/automotive/TestDriveModal';
import { useStore } from '../../../context/StoreContext';
import { getStoredVehicles, getEmbedVideoUrl } from '../../../lib/vehicles';

export default function VehicleDossierPage() {
  const { id } = useParams();
  const { openTestDriveModal, formatPrice } = useStore();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const [vehicle, setVehicle] = useState<any>({
    id: String(id || '1'),
    title: '2024 Mercedes-Benz S 580 4MATIC Luxury Sedan',
    tagline: 'V8 Biturbo, Rear Executive Seating Package, Burmester 3D Surround',
    price: formatPrice(24500000),
    make: 'Mercedes-Benz',
    model: 'S 580 4MATIC',
    year: '2024',
    condition: 'Foreign Used',
    transmission: '8-Spd Automatic',
    engine: '4.0L V8 Biturbo (496 HP)',
    fuel: 'Petrol',
    mileage: '45 KM',
    color: 'Obsidian Black Metallic',
    interior: 'Exclusive Nappa Leather Sienna Brown',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop'
    ],
    features: [
      'Burmester High-End 3D Surround System',
      'Rear Executive Lounge Seating with Calf Massage',
      'MBUX High-End Rear Seat Entertainment',
      'Panoramic Sliding Glass Sunroof',
      'Head-Up Display with Augmented Reality Navigation',
      '360-Degree Surround View Camera Package',
      'AIRMATIC Air Suspension with Adaptive Damping'
    ]
  });

  const [activeImage, setActiveImage] = useState<string>(vehicle.images[0]);
  const [activeMediaTab, setActiveMediaTab] = useState<'GALLERY' | 'VIDEO'>('GALLERY');

  useEffect(() => {
    const stored = getStoredVehicles();
    const match = stored.find(v => String(v.id) === String(id));
    if (match) {
      const rawNum = Number(String(match.price).replace(/[^0-9.]/g, '')) || 24500000;
      const formattedPrice = formatPrice(rawNum);

      const imgs = Array.isArray(match.images) && match.images.length > 0
        ? match.images.map(i => typeof i === 'string' ? i : (i.url || ''))
        : vehicle.images;

      const loadedVeh = {
        id: String(match.id),
        title: match.listing_title || `${match.year} ${match.make} ${match.model}`,
        tagline: match.tagline || 'High-Specification Flagship Dossier',
        price: formattedPrice,
        make: match.make,
        model: match.model,
        year: match.year,
        condition: match.condition || 'Foreign Used',
        transmission: match.transmission || 'Automatic',
        engine: match.engine || 'V8 Biturbo',
        fuel: match.fuel_type || 'Petrol',
        mileage: match.mileage || '45 KM',
        color: match.color || 'Obsidian Black',
        interior: match.interior_color || 'Nappa Leather',
        youtubeUrl: match.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        horsepower: (match as any).horsepower || '204 HP',
        torque: (match as any).torque || '500 Nm Torque',
        acceleration: (match as any).acceleration || '9.2s',
        top_speed: (match as any).top_speed || '180 km/h',
        drivetrain: (match as any).drivetrain || '4WD',
        fuel_range: (match as any).fuel_range || '1390 km',
        fuel_type: (match.fuel_type || 'DIESEL').toUpperCase(),
        images: imgs,
        features: Array.isArray(match.features) && match.features.length > 0 ? match.features : vehicle.features
      };

      setVehicle(loadedVeh);
      setActiveImage(imgs[0]);
    }
  }, [id]);

  const embedVideoUrl = getEmbedVideoUrl(vehicle.youtubeUrl || vehicle.video_url);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto py-10 px-6 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setActiveMediaTab('GALLERY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                  activeMediaTab === 'GALLERY' ? 'bg-[#c9a84c] text-black' : 'bg-[#121212] text-neutral-400 border border-neutral-800'
                }`}
              >
                HD Photo Gallery
              </button>
              <button
                onClick={() => setActiveMediaTab('VIDEO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase flex items-center gap-1.5 transition-all ${
                  activeMediaTab === 'VIDEO' ? 'bg-[#c9a84c] text-black' : 'bg-[#121212] text-neutral-400 border border-neutral-800'
                }`}
              >
                <Video size={14} /> HD Video Walkthrough
              </button>
            </div>

            {activeMediaTab === 'VIDEO' ? (
              <div className="rounded-3xl overflow-hidden border border-[#c9a84c]/30 shadow-2xl h-[420px] bg-black">
                <iframe
                  src={embedVideoUrl || ''}
                  title="Vehicle Video Walkthrough"
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="rounded-3xl overflow-hidden border border-[#c9a84c]/30 shadow-2xl h-[420px]">
                <img src={activeImage} alt={vehicle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {vehicle.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(img);
                    setActiveMediaTab('GALLERY');
                  }}
                  className={`h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img && activeMediaTab === 'GALLERY' ? 'border-[#c9a84c] scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Media 2 DIRECT CRM ACTIONS Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div>
                <span className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] px-2.5 py-1 rounded-md font-bold uppercase">
                  {vehicle.condition}
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-2">{vehicle.title}</h1>
                <p className="text-xs text-neutral-400 mt-1">{vehicle.tagline}</p>
              </div>

              <div className="p-4 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Offer Price</span>
                  <div className="text-2xl font-black text-[#c9a84c]">{vehicle.price}</div>
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={16} /> Duty Paid
                </span>
              </div>

              {/* MEDIA 2 EXACT REPLICA: DIRECT CRM ACTIONS */}
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">DIRECT CRM ACTIONS</div>

                {/* Top 3 Action Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Action 1: Request Test Drive */}
                  <button
                    onClick={() => openTestDriveModal(vehicle.id)}
                    className="p-3.5 bg-[#0a0a0a] border border-neutral-800 hover:border-[#c9a84c] rounded-2xl text-left transition-all group flex flex-col justify-between h-28"
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
                    className="p-3.5 bg-[#0a0a0a] border-2 border-[#c9a84c] rounded-2xl text-left transition-all group flex flex-col justify-between h-28 shadow-lg shadow-[#c9a84c]/10"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-extrabold text-[#c9a84c] uppercase tracking-wider mb-1">
                        <span>ACTION 2</span>
                        <ShoppingBag size={14} />
                      </div>
                      <div className="text-xs font-black text-[#e5c158] leading-tight">
                        Get Best Quote
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-400">Custom location pricing</div>
                  </button>

                  {/* Action 3: Import / Reserve */}
                  <button
                    onClick={() => setIsReservationOpen(true)}
                    className="p-3.5 bg-[#0a0a0a] border border-neutral-800 hover:border-[#c9a84c] rounded-2xl text-left transition-all group flex flex-col justify-between h-28"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-extrabold text-[#c9a84c] uppercase tracking-wider mb-1">
                        <span>ACTION 3</span>
                        <Key size={14} />
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
                    href={`https://wa.me/254700000000?text=Hello%20KnK%20Automotive,%20I%20am%20interested%20in%20the%20${encodeURIComponent(vehicle.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle size={16} /> WHATSAPP DIRECT
                  </a>

                  <button
                    onClick={() => setIsTradeInOpen(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#3d3113] to-[#261f0a] border border-[#c9a84c]/60 hover:border-[#c9a84c] text-[#e5c158] font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Car size={16} className="text-[#c9a84c]" /> TRADE-IN YOUR CURRENT VEHICLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MEDIA 1 EXACT REPLICA: 4 HIGH-CONTRAST PERFORMANCE TELEMETRY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Telemetry Card 1: Engine Output */}
          <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">ENGINE OUTPUT</span>
            <div>
              <div className="text-2xl font-black text-white">{vehicle.horsepower}</div>
              <div className="text-xs font-bold text-blue-400 mt-0.5">{vehicle.torque}</div>
            </div>
          </div>

          {/* Telemetry Card 2: 0-100 KM/H Acceleration */}
          <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">0–100 KM/H</span>
            <div>
              <div className="text-2xl font-black text-white">{vehicle.acceleration}</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">Top: {vehicle.top_speed}</div>
            </div>
          </div>

          {/* Telemetry Card 3: Transmission */}
          <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">TRANSMISSION</span>
            <div>
              <div className="text-2xl font-black text-white">{vehicle.transmission}</div>
              <div className="text-xs font-bold text-purple-400 mt-0.5">{vehicle.drivetrain}</div>
            </div>
          </div>

          {/* Telemetry Card 4: Fuel & Range */}
          <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex flex-col justify-between h-32 shadow-xl hover:border-[#c9a84c] transition-all">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">FUEL & RANGE</span>
            <div>
              <div className="text-2xl font-black text-white">{vehicle.fuel_range}</div>
              <div className="text-xs font-black text-amber-500 tracking-wider mt-0.5 uppercase">{vehicle.fuel_type}</div>
            </div>
          </div>
        </div>

        {/* Vehicle Specs Grid */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
            <Car size={18} /> Official Vehicle Specification Matrix
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div className="p-4 bg-[#121212] border border-neutral-900 rounded-2xl">
              <span className="text-neutral-500 uppercase block mb-1">Make / Model</span>
              <span className="font-bold text-white text-sm">{vehicle.make}</span>
            </div>

            <div className="p-4 bg-[#121212] border border-neutral-900 rounded-2xl">
              <span className="text-neutral-500 uppercase block mb-1">Engine</span>
              <span className="font-bold text-white text-sm">{vehicle.engine}</span>
            </div>

            <div className="p-4 bg-[#121212] border border-neutral-900 rounded-2xl">
              <span className="text-neutral-500 uppercase block mb-1">Mileage</span>
              <span className="font-bold text-white text-sm">{vehicle.mileage}</span>
            </div>

            <div className="p-4 bg-[#121212] border border-neutral-900 rounded-2xl">
              <span className="text-neutral-500 uppercase block mb-1">Exterior Color</span>
              <span className="font-bold text-white text-sm">{vehicle.color}</span>
            </div>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 space-y-4">
          <h3 className="text-sm font-bold text-[#c9a84c] uppercase tracking-wider">High-Specification Equipment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
            {vehicle.features.map((ft: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#121212] border border-neutral-900 rounded-xl">
                <Check size={16} className="text-[#c9a84c]" />
                <span>{ft}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tour Embed */}
        {embedVideoUrl && (
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 space-y-4">
            <h3 className="text-sm font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
              <Video size={18} /> High-Definition Video Walkthrough
            </h3>
            <div className="w-full h-96 bg-black rounded-2xl overflow-hidden border border-neutral-800">
              <iframe
                src={embedVideoUrl}
                title="Vehicle Video Tour"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Media 1 Telemetry Replica Modals */}
      <VehicleInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicleTitle={vehicle.title}
        vehiclePrice={vehicle.price}
        vehicleImage={activeImage}
      />
      <VehicleTradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        targetVehicleName={vehicle.title}
        targetVehiclePrice={vehicle.price}
        targetVehicleImage={activeImage}
      />
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        vehicleTitle={vehicle.title}
        vehiclePrice={vehicle.price}
        vehicleImage={activeImage}
      />
      <TestDriveModal />
    </div>
  );
}
