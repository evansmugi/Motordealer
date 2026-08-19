import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Car, Edit3, ArrowLeft, ShieldCheck, CheckCircle2, Award, Zap, 
  DollarSign, Gauge, Fuel, Wrench, ChevronRight, Share2, Printer, Lock, Check
} from 'lucide-react';
import CRMLayout from '../components/crm/CRMLayout';
import { VEHICLES } from '../data/mock-dataset.ts';
import { useCRMStore } from '../context/CRMStore';

export default function ViewListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminTheme = useCRMStore(state => state.adminTheme);
  const isLight = adminTheme === 'light';

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:1338/api/car-listings/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            const attr = json.data.attributes || json.data;
            setVehicle({
              id: String(json.data.id || id),
              title: attr.listing_title || `${attr.year || 2024} ${attr.make} ${attr.model}`,
              make: attr.make || 'Mercedes-Benz',
              model: attr.model || 'Luxury Vehicle',
              year: String(attr.year || 2024),
              price: attr.price ? Number(attr.price) : 24500000,
              costPrice: attr.cost_price ? Number(attr.cost_price) : 18000000,
              condition: attr.condition || 'Certified Pre-Owned',
              transmission: attr.transmission || '8-Speed Automatic',
              engine: attr.engine || '3.0L Inline-6 Turbo',
              fuel_type: attr.fuel_type || 'Petrol',
              mileage: attr.mileage || '45 KM',
              color: attr.color || 'Heritage Two-Tone',
              interior_color: attr.interior_color || 'Cognac Saddle Brown',
              offer_type: attr.offer_type || 'Featured',
              status: attr.currentStatus || 'Available',
              features: Array.isArray(attr.features) ? attr.features : ['Burmester 3D Sound', 'Panoramic Sunroof', '360 Camera', 'Heated Nappa Leather', 'Head-Up Display'],
              images: Array.isArray(attr.images) && attr.images.length > 0
                ? attr.images.map(img => typeof img === 'string' ? img : (img.url || ''))
                : ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop']
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Strapi fetch fallback:', e);
      }

      let found = VEHICLES.find(v => String(v.id) === String(id));
      if (!found && !isNaN(Number(id))) {
        const index = Math.abs(Number(id)) % VEHICLES.length;
        found = VEHICLES[index] || VEHICLES[0];
      }

      if (found) {
        setVehicle({
          id: found.id,
          title: `${found.year} ${found.make} ${found.model} ${found.trim || ''}`.trim(),
          make: found.make,
          model: found.model,
          year: String(found.year),
          price: found.pricing?.cashPrice || 24500000,
          costPrice: 18000000,
          condition: found.condition === 'NEW' ? 'Brand New' : found.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified Pre-Owned' : 'Foreign Used',
          transmission: typeof found.transmission === 'object' ? (found.transmission.type || 'Automatic') : (found.transmission || 'Automatic'),
          engine: typeof found.engine === 'object' ? (found.engine.type || 'V8 Turbo') : (found.engine || 'V8 Turbo'),
          fuel_type: typeof found.fuelEnergy === 'object' ? (found.fuelEnergy.fuelType || 'Petrol') : (found.fuel_type || 'Petrol'),
          mileage: `${found.history?.odometerKm || 45} KM`,
          color: found.colorExterior || 'Heritage Sand & Grayscale Two-Tone',
          interior_color: found.colorInterior || 'Cognac Saddle Brown',
          offer_type: 'Featured',
          status: 'Available',
          features: ['Burmester 3D Sound', 'Panoramic Sunroof', '360 Camera', 'Heated Nappa Leather', 'Head-Up Display', 'Adaptive Air Suspension'],
          images: Array.isArray(found.images) && found.images.length > 0
            ? found.images.map(img => typeof img === 'string' ? img : (img.url || ''))
            : [found.heroImage || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop']
        });
      }
      setLoading(false);
    }
    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <CRMLayout title="Loading Dossier | KnK Automotive">
        <div className={`p-12 text-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Loading vehicle specs...</div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout title={`Read-Only Dossier: ${vehicle?.title} | KnK Automotive`}>
      <div className="w-full space-y-6">
        
        {/* Header Action Bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/vehicles')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <ArrowLeft size={16} /> Back to Vehicles Registry
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border ${
                  isLight ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30'
                }`}>
                  <Lock size={12} /> Read-Only Dossier
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                  isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                }`}>
                  {vehicle?.status}
                </span>
              </div>
              <h1 className={`text-2xl font-black uppercase tracking-tight mt-1 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {vehicle?.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className={`px-4 py-2.5 border rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <Printer size={16} /> Print Specs
            </button>
            <button
              onClick={() => navigate(`/edit-listing/${vehicle?.id}`)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#c9a84c]/20"
            >
              <Edit3 size={16} /> Edit Vehicle Dossier
            </button>
          </div>
        </div>

        {/* Main Grid: Gallery & Primary Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`relative rounded-2xl overflow-hidden border aspect-[16/10] shadow-xl ${
              isLight ? 'bg-slate-200 border-slate-300' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <img
                src={vehicle?.images[0]}
                alt={vehicle?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#c9a84c] text-xs font-mono font-bold px-3 py-1 rounded-lg border border-[#c9a84c]/30">
                {vehicle?.year} • {vehicle?.make}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {vehicle?.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {vehicle.images.map((img, idx) => (
                  <div key={idx} className={`rounded-xl overflow-hidden border aspect-video shadow-sm ${
                    isLight ? 'border-slate-300 bg-slate-100' : 'border-neutral-800 bg-neutral-950'
                  }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Quick Telemetry Card */}
          <div className="space-y-6">
            <div className={`border rounded-2xl p-6 space-y-6 shadow-xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Retail Listing Price</span>
                <div className="text-3xl font-black text-[#c9a84c] mt-0.5">
                  KES {vehicle?.price ? Number(vehicle.price).toLocaleString() : '24,500,000'}
                </div>
                <div className={`text-xs mt-1 font-mono ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Cost Basis: KES {vehicle?.costPrice ? Number(vehicle.costPrice).toLocaleString() : '18,000,000'} • <span className="text-emerald-600 dark:text-emerald-400 font-bold">Duty Paid & Cleared</span>
                </div>
              </div>

              <div className={`space-y-3 pt-4 border-t ${isLight ? 'border-slate-200 text-xs text-slate-700' : 'border-neutral-900 text-xs text-neutral-300'}`}>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Make / Brand</span>
                  <span className="font-bold">{vehicle?.make}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Model Name</span>
                  <span className="font-bold">{vehicle?.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Year of Manufacture</span>
                  <span className="font-bold text-[#c9a84c]">{vehicle?.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Condition Rating</span>
                  <span className="font-bold">{vehicle?.condition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Odometer Mileage</span>
                  <span className="font-bold font-mono">{vehicle?.mileage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Exterior Finish</span>
                  <span className="font-bold">{vehicle?.color}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-500'}>Interior Upholstery</span>
                  <span className="font-bold">{vehicle?.interior_color}</span>
                </div>
              </div>

              <div className={`p-4 border rounded-xl flex items-center gap-3 ${
                isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 text-[#c9a84c] font-black flex items-center justify-center text-sm shrink-0">
                  99
                </div>
                <div>
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>150-Point Certified Inspection</div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-emerald-400 font-medium'}`}>Pass Verified • Zero Defects</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Performance & Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`border rounded-2xl p-6 space-y-4 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-3 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-[#c9a84c] border-neutral-800'
            }`}>
              <Zap size={16} /> Powertrain & Performance Specs
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className={`p-3 border rounded-xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212] border-neutral-800'}`}>
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Engine Configuration</span>
                <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{vehicle?.engine}</span>
              </div>
              <div className={`p-3 border rounded-xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212] border-neutral-800'}`}>
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Transmission</span>
                <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{vehicle?.transmission}</span>
              </div>
              <div className={`p-3 border rounded-xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212] border-neutral-800'}`}>
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Fuel & Range</span>
                <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{vehicle?.fuel_type}</span>
              </div>
              <div className={`p-3 border rounded-xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212] border-neutral-800'}`}>
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Drivetrain</span>
                <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>AWD / 4MATIC</span>
              </div>
            </div>
          </div>

          <div className={`border rounded-2xl p-6 space-y-4 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-3 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-[#c9a84c] border-neutral-800'
            }`}>
              <Award size={16} /> Factory Equipment & Special Features
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {vehicle?.features && vehicle.features.map((feat, idx) => (
                <span
                  key={idx}
                  className={`border text-xs font-medium px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                    isLight 
                      ? 'bg-slate-100 border-slate-300 text-slate-800' 
                      : 'bg-[#121212] border-neutral-800 text-neutral-200'
                  }`}
                >
                  <Check size={14} className="text-[#c9a84c]" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Video Tour Embed Section */}
        {vehicle?.video_url && getEmbedVideoUrl(vehicle.video_url) && (
          <div className={`border rounded-2xl p-6 space-y-4 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-3 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-[#c9a84c] border-neutral-800'
            }`}>
              <Video size={16} /> High-Definition Video Walkthrough Showcase
            </h3>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black shadow-md">
              <iframe
                src={getEmbedVideoUrl(vehicle.video_url)}
                title="Vehicle Video Tour"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

      </div>
    </CRMLayout>
  );
}
