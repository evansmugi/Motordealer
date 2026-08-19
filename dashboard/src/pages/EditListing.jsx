import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Car, Plus, ArrowLeft, Trash2, Check, Upload, Image as ImageIcon, X, Sliders, Video, Sparkles, Zap } from 'lucide-react';
import CRMLayout from '../components/crm/CRMLayout';
import PredictiveSelect from '../components/common/PredictiveSelect';
import SuccessModal from '../components/common/SuccessModal';
import { VEHICLES } from '../data/mock-dataset';
import { getStoredBrands } from '../lib/brands';
import { getStoredVehicles, upsertStoredVehicle, getEmbedVideoUrl } from '../lib/vehicles';
import { useCRMStore } from '../context/CRMStore';

const CONDITION_OPTIONS = [
  { value: 'Brand New', label: 'Brand New (Zero KM)' },
  { value: 'Certified Pre-Owned', label: 'Certified Pre-Owned (Verified inspection)' },
  { value: 'Foreign Used', label: 'Foreign Used (Fresh Import)' },
  { value: 'Locally Used', label: 'Locally Used' }
];

const TRANSMISSION_OPTIONS = [
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Dual-Clutch (PDK/DCT)', label: 'Dual-Clutch (PDK/DCT)' }
];

const FUEL_OPTIONS = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid (PHEV/MHEV)', label: 'Hybrid (PHEV/MHEV)' },
  { value: 'Electric (EV)', label: 'Electric (EV)' }
];

const FEATURE_CATEGORIES = [
  {
    category: 'Comfort & Interior Luxury',
    items: [
      'Panoramic Sunroof',
      'Nappa Leather Seats',
      'Heated & Ventilated Front Seats',
      'Heated Rear Seats',
      'Massage Front Seats',
      'Power Memory Seats',
      'Ambient Lighting (64 Colors)',
      'Quad-Zone Automatic Climate Control',
      'Wireless Smartphone Charging',
      'Soft-Close Doors'
    ]
  },
  {
    category: 'Audio, Navigation & Technology',
    items: [
      'Burmester 3D Surround Sound',
      'Head-Up Display (HUD)',
      '360-Degree Surround View Camera',
      'Apple CarPlay & Android Auto',
      'Rear Seat Entertainment Screens',
      'Keyless Entry & Push Start',
      'Digital Rearview Mirror',
      '12.3" Digital Instrument Cluster'
    ]
  },
  {
    category: 'Safety & Driver Assistance',
    items: [
      'Adaptive Cruise Control (Distronic)',
      'Lane Keep Assist & Centering',
      'Blind Spot Monitoring',
      'Night Vision Assist',
      'Emergency Autonomous Braking',
      'Park Assist / Self-Parking',
      'Traffic Sign Recognition'
    ]
  },
  {
    category: 'Performance & Exterior Equipment',
    items: [
      'Adaptive Air Suspension',
      'Sport Exhaust System',
      'Carbon Ceramic Brakes',
      'All-Wheel Drive (AWD/4MATIC/xDrive)',
      'LED Matrix Laser Headlights',
      'Hands-Free Power Tailgate',
      'Towing Package / Tow Hitch',
      '21" AMG / M Sport Alloy Wheels'
    ]
  }
];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminTheme = useCRMStore(state => state.adminTheme);
  const isLight = adminTheme === 'light';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  // Dynamic Brands
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    setBrands(getStoredBrands());
  }, []);

  const makeOptions = brands.map(b => ({ value: b, label: b }));

  const [form, setForm] = useState({
    listing_title: '',
    tagline: '',
    price: '',
    make: 'Mercedes-Benz',
    model: '',
    condition: 'Brand New',
    year: '2024',
    transmission: 'Automatic',
    engine: 'V8 Turbo',
    fuel_type: 'Petrol',
    mileage: '45',
    color: 'Obsidian Black',
    interior_color: 'Black Nappa',
    offer_type: 'Featured',
    listing_description: '',
    status: 'Available',
    features: ['Panoramic Sunroof', 'Nappa Leather Seats', 'Burmester 3D Surround Sound', '360-Degree Surround View Camera'],
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    horsepower: '204 HP',
    torque: '500 Nm Torque',
    acceleration: '9.2s',
    top_speed: '180 km/h',
    drivetrain: '4WD',
    fuel_range: '1390 km'
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [customFeatureInput, setCustomFeatureInput] = useState('');

  useEffect(() => {
    async function loadVehicle() {
      setFetching(true);

      // Check persistent stored vehicles first
      const stored = getStoredVehicles();
      const localMatch = stored.find(v => String(v.id) === String(id));
      if (localMatch) {
        setForm({
          listing_title: localMatch.listing_title || `${localMatch.year || 2024} ${localMatch.make} ${localMatch.model}`,
          tagline: localMatch.tagline || '',
          price: String(localMatch.price || 24500000),
          make: localMatch.make || 'Mercedes-Benz',
          model: localMatch.model || '',
          condition: localMatch.condition || 'Brand New',
          year: String(localMatch.year || 2024),
          transmission: localMatch.transmission || 'Automatic',
          engine: localMatch.engine || 'V8 Turbo',
          fuel_type: localMatch.fuel_type || 'Petrol',
          mileage: String(localMatch.mileage || '45'),
          color: localMatch.color || 'Obsidian Black',
          interior_color: localMatch.interior_color || 'Black Nappa',
          offer_type: localMatch.offer_type || 'Featured',
          listing_description: localMatch.listing_description || '',
          status: localMatch.currentStatus || 'Available',
          features: Array.isArray(localMatch.features) ? localMatch.features : ['Panoramic Sunroof', 'Nappa Leather Seats'],
          images: Array.isArray(localMatch.images) && localMatch.images.length > 0
            ? localMatch.images.map(img => typeof img === 'string' ? img : (img.url || ''))
            : ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'],
          video_url: localMatch.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          horsepower: localMatch.horsepower || '204 HP',
          torque: localMatch.torque || '500 Nm Torque',
          acceleration: localMatch.acceleration || '9.2s',
          top_speed: localMatch.top_speed || '180 km/h',
          drivetrain: localMatch.drivetrain || '4WD',
          fuel_range: localMatch.fuel_range || '1390 km'
        });
        setFetching(false);
        return;
      }

      // Try Strapi endpoint
      try {
        const res = await fetch(`http://localhost:1338/api/car-listings/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            const attr = json.data.attributes || json.data;
            setForm({
              listing_title: attr.listing_title || `${attr.year || 2024} ${attr.make} ${attr.model}`,
              tagline: attr.tagline || '',
              price: String(attr.price || 24500000),
              make: attr.make || 'Mercedes-Benz',
              model: attr.model || '',
              condition: attr.condition || 'Brand New',
              year: String(attr.year || 2024),
              transmission: attr.transmission || 'Automatic',
              engine: attr.engine || 'V8 Turbo',
              fuel_type: attr.fuel_type || 'Petrol',
              mileage: String(attr.mileage || '45'),
              color: attr.color || 'Obsidian Black',
              interior_color: attr.interior_color || 'Black Nappa',
              offer_type: attr.offer_type || 'Featured',
              listing_description: attr.listing_description || '',
              status: attr.currentStatus || 'Available',
              features: Array.isArray(attr.features) ? attr.features : ['Burmester 3D Surround Sound', 'Panoramic Sunroof'],
              images: Array.isArray(attr.images) && attr.images.length > 0
                ? attr.images.map(img => typeof img === 'string' ? img : (img.url || ''))
                : ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'],
              video_url: attr.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              horsepower: attr.horsepower || '204 HP',
              torque: attr.torque || '500 Nm Torque',
              acceleration: attr.acceleration || '9.2s',
              top_speed: attr.top_speed || '180 km/h',
              drivetrain: attr.drivetrain || '4WD',
              fuel_range: attr.fuel_range || '1390 km'
            });
            setFetching(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Strapi fetch fallback:', e);
      }

      // Fallback mock match
      let match = VEHICLES.find(v => String(v.id) === String(id));
      if (!match && !isNaN(Number(id))) {
        const index = Math.abs(Number(id)) % VEHICLES.length;
        match = VEHICLES[index] || VEHICLES[0];
      }

      if (match) {
        setForm({
          listing_title: `${match.year} ${match.make} ${match.model} ${match.trim || ''}`.trim(),
          tagline: match.shortTagline || '',
          price: String(match.pricing?.cashPrice || 24500000),
          make: match.make,
          model: match.model,
          condition: match.condition === 'NEW' ? 'Brand New' : match.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified Pre-Owned' : 'Foreign Used',
          year: String(match.year),
          transmission: typeof match.transmission === 'object' ? (match.transmission.type || 'Automatic') : (match.transmission || 'Automatic'),
          engine: typeof match.engine === 'object' ? (match.engine.type || 'V8 Turbo') : (match.engine || 'V8 Turbo'),
          fuel_type: typeof match.fuelEnergy === 'object' ? (match.fuelEnergy.fuelType || 'Petrol') : (match.fuel_type || 'Petrol'),
          mileage: String(match.history?.odometerKm || 45),
          color: match.colorExterior || 'Obsidian Black',
          interior_color: match.colorInterior || 'Nappa Leather',
          offer_type: 'Featured',
          listing_description: 'High-spec luxury performance dossier.',
          status: 'Available',
          features: ['Panoramic Sunroof', 'Nappa Leather Seats', 'Burmester 3D Surround Sound', '360-Degree Surround View Camera'],
          images: Array.isArray(match.images) && match.images.length > 0
            ? match.images.map(img => typeof img === 'string' ? img : (img.url || ''))
            : [match.heroImage || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'],
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          horsepower: '204 HP',
          torque: '500 Nm Torque',
          acceleration: '9.2s',
          top_speed: '180 km/h',
          drivetrain: '4WD',
          fuel_range: '1390 km'
        });
      }
      setFetching(false);
    }

    loadVehicle();
  }, [id]);

  // Image Upload Handlers
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result;
        if (result) {
          setForm(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    const url = imageUrlInput.trim();
    if (!url) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const toggleFeature = (featureItem) => {
    setForm(prev => {
      const exists = prev.features.includes(featureItem);
      return {
        ...prev,
        features: exists
          ? prev.features.filter(f => f !== featureItem)
          : [...prev.features, featureItem]
      };
    });
  };

  const handleAddCustomFeature = (e) => {
    e.preventDefault();
    const trimmed = customFeatureInput.trim();
    if (!trimmed) return;
    if (!form.features.includes(trimmed)) {
      setForm(prev => ({
        ...prev,
        features: [...prev.features, trimmed]
      }));
    }
    setCustomFeatureInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedVehicle = {
        id: String(id || '101'),
        listing_title: form.listing_title,
        tagline: form.tagline,
        price: String(form.price),
        make: form.make,
        model: form.model,
        condition: form.condition,
        year: String(form.year),
        transmission: form.transmission,
        engine: form.engine,
        fuel_type: form.fuel_type,
        mileage: String(form.mileage),
        color: form.color,
        interior_color: form.interior_color,
        offer_type: form.isFeatured || form.offer_type === 'Featured' ? 'Featured' : (form.offer_type || 'For Sale'),
        isFeatured: Boolean(form.isFeatured || form.offer_type === 'Featured'),
        listing_description: form.listing_description,
        currentStatus: form.status || 'Available',
        features: form.features,
        images: form.images.map(url => typeof url === 'string' ? { url } : url),
        video_url: form.video_url,
        horsepower: form.horsepower,
        torque: form.torque,
        acceleration: form.acceleration,
        top_speed: form.top_speed,
        drivetrain: form.drivetrain,
        fuel_range: form.fuel_range
      };

      // 1. Update persistent local storage dataset
      upsertStoredVehicle(updatedVehicle);

      // 2. Also send to Strapi API
      await fetch(`http://localhost:1338/api/car-listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedVehicle })
      }).catch(() => null);

      setSuccess(true);
    } catch (err) {
      console.error('Failed to update vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <CRMLayout title="Loading Dossier | KnK Automotive">
        <div className={`p-16 text-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Loading vehicle specifications...</div>
      </CRMLayout>
    );
  }

  const embedVideoPreview = getEmbedVideoUrl(form.video_url);

  return (
    <CRMLayout title={`Edit Vehicle Listing #${id || '101'} | KnK Automotive`}>
      <div className="w-full space-y-6">
        
        {/* Header Action Bar */}
        <div className={`flex items-center justify-between border-b pb-5 ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
                isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className={`text-xl font-bold uppercase tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>Edit Vehicle Dossier #{id || '101'}</h1>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Edge-to-edge specification editor, picture uploader, video showcase & feature checklist
              </p>
            </div>
          </div>
        </div>

        {success && (
          <div className={`p-4 border rounded-xl text-sm flex items-center gap-2 font-bold ${
            isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
          }`}>
            <Check size={18} /> Listing updated successfully! Persistent database updated & syncing with storefront...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Dynamic Image Upload & Video Gallery Uploader */}
          <div className={`border rounded-2xl p-6 space-y-5 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-neutral-800'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#c9a84c] uppercase">
                <ImageIcon size={16} /> Dynamic Vehicle Media & Picture Gallery Uploader
              </div>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                {form.images.length} Pictures Uploaded
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 hover:border-[#c9a84c]' 
                  : 'bg-[#121212]/50 border-neutral-800 hover:border-[#c9a84c]'
              }`}>
                <Upload size={28} className="text-neutral-500 group-hover:text-[#c9a84c] transition-colors mb-2" />
                <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Click to Upload Pictures</span>
                <span className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Supports PNG, JPG, WEBP formats</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Add Web Image URL Input */}
              <div className={`border rounded-2xl p-6 flex flex-col justify-between space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212]/50 border-neutral-800'
              }`}>
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Add Image via Web URL</label>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Paste direct image URL from Unsplash or CDN</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                        : 'bg-[#181818] border-neutral-800 text-white focus:border-[#c9a84c]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-md"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnail Preview Grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                {form.images.map((imgUrl, idx) => {
                  const urlStr = typeof imgUrl === 'string' ? imgUrl : (imgUrl?.url || '');
                  return (
                    <div key={idx} className={`relative group rounded-xl overflow-hidden border aspect-video shadow-sm ${
                      isLight ? 'border-slate-300 bg-slate-100' : 'border-neutral-800 bg-neutral-950'
                    }`}>
                      <img src={urlStr} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-black/80 text-[#c9a84c] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#c9a84c]/30">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-rose-950/90 text-rose-400 border border-rose-500/50 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove picture"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DEDICATED VEHICLE VIDEO SHOWCASE / WALKTHROUGH SECTION */}
            <div className={`p-4 border rounded-2xl space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212]/70 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Video size={16} className="text-[#c9a84c]" /> Vehicle Video Showcase / Walkthrough URL (YouTube, Vimeo, MP4)
                </label>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Previewed on Storefront Showroom</span>
              </div>
              <input
                type="url"
                value={form.video_url || ''}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                className={`w-full border rounded-xl px-3.5 py-2 text-xs outline-none ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                    : 'bg-[#181818] border-neutral-800 text-white focus:border-[#c9a84c]'
                }`}
              />
              
              {/* Video Embed Admin Live Preview Box */}
              {form.video_url && embedVideoPreview && (
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-[#c9a84c] mb-1.5 font-bold flex items-center gap-1">
                    <Sparkles size={13} /> Live Store Video Embed Preview:
                  </div>
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black max-h-72 shadow-md">
                    <iframe
                      src={embedVideoPreview}
                      title="Video Walkthrough Preview"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 1: Overview */}
          <div className={`border rounded-2xl p-6 space-y-4 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-3 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-[#c9a84c] border-neutral-800'
            }`}>
              <Car size={16} /> Basic Vehicle Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Listing Title *</label>
                <input
                  type="text"
                  required
                  value={form.listing_title}
                  onChange={(e) => setForm({ ...form, listing_title: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Make *</label>
                <PredictiveSelect
                  options={makeOptions}
                  value={form.make}
                  onChange={(val) => setForm({ ...form, make: val })}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Model *</label>
                <input
                  type="text"
                  required
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Model Year *</label>
                <input
                  type="number"
                  required
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none font-mono ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Specs */}
          <div className={`border rounded-2xl p-6 space-y-5 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-3 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-[#c9a84c] border-neutral-800'
            }`}>
              Pricing, Status & Technical Specs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Price (KES) *</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none font-mono font-bold text-[#c9a84c] ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Mileage (KM)</label>
                <input
                  type="text"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none font-mono ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Inventory Status</label>
                <PredictiveSelect
                  options={[
                    { value: 'Available', label: 'Available (In Stock)' },
                    { value: 'Reserved', label: 'Reserved (Deposit Paid)' },
                    { value: 'Sold', label: 'Sold & Delivered' }
                  ]}
                  value={form.status}
                  onChange={(val) => setForm({ ...form, status: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Vehicle Condition</label>
                <PredictiveSelect
                  options={CONDITION_OPTIONS}
                  value={form.condition}
                  onChange={(val) => setForm({ ...form, condition: val })}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Transmission</label>
                <PredictiveSelect
                  options={TRANSMISSION_OPTIONS}
                  value={form.transmission}
                  onChange={(val) => setForm({ ...form, transmission: val })}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Fuel Type</label>
                <PredictiveSelect
                  options={FUEL_OPTIONS}
                  value={form.fuel_type}
                  onChange={(val) => setForm({ ...form, fuel_type: val })}
                />
              </div>
            </div>

            {/* Featured Showcase Listing Toggle */}
            <div className={`p-4 border rounded-xl flex items-center justify-between transition-colors mt-3 ${
              isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-[#c9a84c]/10 border-[#c9a84c]/30'
            }`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeaturedToggle"
                  checked={Boolean(form.isFeatured || form.offer_type === 'Featured')}
                  onChange={(e) => setForm({
                    ...form,
                    isFeatured: e.target.checked,
                    offer_type: e.target.checked ? 'Featured' : 'For Sale'
                  })}
                  className="w-4 h-4 accent-[#c9a84c] rounded cursor-pointer"
                />
                <div>
                  <label htmlFor="isFeaturedToggle" className={`block text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    <Sparkles size={14} className="text-[#c9a84c]" /> Mark as Featured Showcase Vehicle
                  </label>
                  <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                    Automatically displays this vehicle in the Featured Cars Showcase section on the Storefront Homepage.
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${
                Boolean(form.isFeatured || form.offer_type === 'Featured')
                  ? 'bg-[#c9a84c] text-black border-[#c9a84c]'
                  : 'bg-slate-900/50 text-slate-400 border-slate-700'
              }`}>
                {Boolean(form.isFeatured || form.offer_type === 'Featured') ? '★ Featured On Homepage' : 'Standard Inventory'}
              </span>
            </div>

            {/* Media 1 Exact Telemetry Cards Configuration */}
            <div className={`p-5 border rounded-2xl space-y-3 mt-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121212]/80 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between border-b pb-2.5">
                <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-[#c9a84c]'
                }`}>
                  <Zap size={16} /> Performance Telemetry Cards Configuration (Storefront Telemetry)
                </label>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Configures 4 Storefront Telemetry Cards
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Engine Output */}
                <div className={`p-3 border rounded-xl space-y-2 ${
                  isLight ? 'bg-white border-slate-300' : 'bg-[#0a0a0a] border-neutral-800'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Card 1: Engine Output</div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Horsepower (HP)</label>
                    <input
                      type="text"
                      value={form.horsepower || ''}
                      onChange={(e) => setForm({ ...form, horsepower: e.target.value })}
                      placeholder="e.g. 204 HP"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181818] border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Torque (Nm)</label>
                    <input
                      type="text"
                      value={form.torque || ''}
                      onChange={(e) => setForm({ ...form, torque: e.target.value })}
                      placeholder="e.g. 500 Nm Torque"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none text-blue-400 font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-blue-700' : 'bg-[#181818] border-neutral-800 text-blue-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Card 2: 0-100 KM/H */}
                <div className={`p-3 border rounded-xl space-y-2 ${
                  isLight ? 'bg-white border-slate-300' : 'bg-[#0a0a0a] border-neutral-800'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Card 2: 0–100 KM/H</div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>0-100 Time (Sec)</label>
                    <input
                      type="text"
                      value={form.acceleration || ''}
                      onChange={(e) => setForm({ ...form, acceleration: e.target.value })}
                      placeholder="e.g. 9.2s"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181818] border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Top Speed</label>
                    <input
                      type="text"
                      value={form.top_speed || ''}
                      onChange={(e) => setForm({ ...form, top_speed: e.target.value })}
                      placeholder="e.g. Top: 180 km/h"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none text-emerald-400 font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-emerald-700' : 'bg-[#181818] border-neutral-800 text-emerald-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Card 3: Transmission */}
                <div className={`p-3 border rounded-xl space-y-2 ${
                  isLight ? 'bg-white border-slate-300' : 'bg-[#0a0a0a] border-neutral-800'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Card 3: Transmission</div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Short Trans. Name</label>
                    <input
                      type="text"
                      value={form.transmission || ''}
                      onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                      placeholder="e.g. 8-Spd"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181818] border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Drivetrain</label>
                    <input
                      type="text"
                      value={form.drivetrain || ''}
                      onChange={(e) => setForm({ ...form, drivetrain: e.target.value })}
                      placeholder="e.g. 4WD / AWD / RWD"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none text-purple-400 font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-purple-700' : 'bg-[#181818] border-neutral-800 text-purple-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Card 4: Fuel & Range */}
                <div className={`p-3 border rounded-xl space-y-2 ${
                  isLight ? 'bg-white border-slate-300' : 'bg-[#0a0a0a] border-neutral-800'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Card 4: Fuel & Range</div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Max Range (KM)</label>
                    <input
                      type="text"
                      value={form.fuel_range || ''}
                      onChange={(e) => setForm({ ...form, fuel_range: e.target.value })}
                      placeholder="e.g. 1390 km"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181818] border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-500'}`}>Fuel Type</label>
                    <input
                      type="text"
                      value={form.fuel_type || ''}
                      onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                      placeholder="e.g. DIESEL / PETROL"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none text-amber-500 font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-amber-700' : 'bg-[#181818] border-neutral-800 text-amber-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Comprehensive Vehicle Features & Addons Checklist */}
          <div className={`border rounded-2xl p-6 space-y-5 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-neutral-800'
            }`}>
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-[#c9a84c]'
                }`}>
                  <Sliders size={16} /> Factory Equipment & Luxury Feature Checklist
                </h2>
                <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Select all applicable features, options, and packages installed on this vehicle.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#c9a84c]">
                {form.features.length} Features Selected
              </span>
            </div>

            {/* Custom Feature Add Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customFeatureInput}
                onChange={(e) => setCustomFeatureInput(e.target.value)}
                placeholder="Type custom feature or addon (e.g. Bespoke Rear Fridge)..."
                className={`flex-1 border rounded-xl px-3.5 py-2 text-xs outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                    : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                }`}
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-4 py-2 bg-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-md"
              >
                + Add Feature
              </button>
            </div>

            {/* Categorized Checkbox Grid */}
            <div className="space-y-6 pt-2">
              {FEATURE_CATEGORIES.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-3">
                  <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 font-mono ${
                    isLight ? 'text-slate-700 border-slate-200' : 'text-neutral-300 border-neutral-800/60'
                  }`}>
                    {cat.category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {cat.items.map((featItem) => {
                      const isChecked = form.features.includes(featItem);
                      return (
                        <label
                          key={featItem}
                          onClick={() => toggleFeature(featItem)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                            isChecked
                              ? isLight
                                ? 'bg-amber-50 border-[#c9a84c] text-slate-950 font-bold'
                                : 'bg-[#c9a84c]/15 border-[#c9a84c] text-white font-bold'
                              : isLight
                                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                                : 'bg-[#121212] border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                            isChecked 
                              ? 'bg-[#c9a84c] border-[#c9a84c] text-black' 
                              : isLight ? 'border-slate-300 bg-white' : 'border-neutral-600 bg-neutral-900'
                          }`}>
                            {isChecked && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className="text-xs truncate">{featItem}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/vehicles')}
              className={`px-4 py-2 border rounded-xl text-xs flex items-center gap-2 cursor-pointer ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Cancel & Return
            </button>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#c9a84c]/20 cursor-pointer"
              >
                {loading ? 'Saving...' : 'UPDATE DOSSIER'}
              </button>
            </div>
          </div>
        </form>

        <SuccessModal
          isOpen={success}
          onClose={() => setSuccess(false)}
          title="Vehicle Dossier Saved!"
          vehicleTitle={form.listing_title || `${form.year} ${form.make} ${form.model}`}
          message="Vehicle specifications, media gallery, and featured showcase status have been saved successfully and synchronized live with the storefront."
          primaryActionText="Return to Vehicle Inventory"
          onPrimaryAction={() => navigate('/admin/vehicles')}
          secondaryActionText="Continue Editing"
          onSecondaryAction={() => setSuccess(false)}
          isLight={isLight}
          autoCloseMs={5000}
        />
      </div>
    </CRMLayout>
  );
}
