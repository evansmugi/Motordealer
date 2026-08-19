'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, Check, ShieldCheck, DollarSign, RefreshCw, Calendar, Video, ArrowLeft, Lock } from 'lucide-react';
import VehicleInquiryModal from '../../../components/automotive/VehicleInquiryModal';
import VehicleTradeInModal from '../../../components/automotive/VehicleTradeInModal';
import ReservationModal from '../../../components/automotive/ReservationModal';

export default function VehicleDossierPage() {
  const { id } = useParams();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const vehicle = {
    id: id || '1',
    title: '2024 Mercedes-Benz S 580 4MATIC Luxury Sedan',
    tagline: 'V8 Biturbo, Rear Executive Seating Package, Burmester 3D Surround',
    price: 'KES 24,500,000',
    make: 'Mercedes-Benz',
    model: 'S 580 4MATIC',
    year: '2024',
    condition: 'Foreign Used',
    transmission: '9G-TRONIC Automatic',
    engine: '4.0L V8 Biturbo with EQ Boost (496 HP)',
    fuel: 'Petrol',
    mileage: '8,400 KM',
    color: 'Obsidian Black Metallic',
    interior: 'Exclusive Nappa Leather Black',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop'
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
  };

  const [activeImage, setActiveImage] = useState(vehicle.images[0]);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/vehicle" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase">
            <ArrowLeft size={16} /> Back to Showroom
          </Link>
          <span className="text-sm font-bold text-[#c9a84c] uppercase">KnK Dossier #{id || '101'}</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-10 px-6 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl overflow-hidden border border-[#c9a84c]/30 shadow-2xl h-[420px]">
              <img src={activeImage} alt={vehicle.title} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-[#c9a84c] scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & CTA Column */}
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-[#c9a84c]/20"
                >
                  INQUIRE / GET PRICE QUOTE
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsTradeInOpen(true)}
                    className="py-3 bg-neutral-900 border border-neutral-800 hover:border-[#c9a84c] text-neutral-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} className="text-[#c9a84c]" /> TRADE-IN
                  </button>

                  <button
                    onClick={() => setIsReservationOpen(true)}
                    className="py-3 bg-neutral-900 border border-neutral-800 hover:border-[#c9a84c] text-neutral-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Lock size={14} className="text-[#c9a84c]" /> RESERVE DEPOSIT
                  </button>
                </div>

                <Link
                  href="/book-test-drive"
                  className="w-full py-3 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 text-center"
                >
                  <Calendar size={14} className="text-[#c9a84c]" /> BOOK SHOWROOM VIEWING
                </Link>
              </div>
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
            {vehicle.features.map((ft, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#121212] border border-neutral-900 rounded-xl">
                <Check size={16} className="text-[#c9a84c]" />
                <span>{ft}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tour Embed */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 space-y-4">
          <h3 className="text-sm font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
            <Video size={18} /> High-Definition Video Walkthrough
          </h3>
          <div className="w-full h-96 bg-black rounded-2xl overflow-hidden border border-neutral-800">
            <iframe
              src={vehicle.youtubeUrl}
              title="Vehicle Video Tour"
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <VehicleInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicleTitle={vehicle.title}
        vehiclePrice={vehicle.price}
      />
      <VehicleTradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        targetVehicleName={vehicle.title}
      />
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        vehicleTitle={vehicle.title}
        vehiclePrice={vehicle.price}
      />
    </div>
  );
}
