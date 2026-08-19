import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Car, Upload, Plus, Check, ArrowLeft, DollarSign, Tag, Info, Video, Trash2 } from 'lucide-react';
import CRMLayout from '../components/crm/CRMLayout';
import PredictiveSelect from '../components/common/PredictiveSelect';

const MAKE_OPTIONS = [
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz', icon: Car, badge: 'German' },
  { value: 'BMW', label: 'BMW', icon: Car, badge: 'German' },
  { value: 'Audi', label: 'Audi', icon: Car, badge: 'German' },
  { value: 'Porsche', label: 'Porsche', icon: Car, badge: 'German' },
  { value: 'Land Rover', label: 'Land Rover', icon: Car, badge: 'British' },
  { value: 'Lexus', label: 'Lexus', icon: Car, badge: 'Japanese' }
];

const CONDITION_OPTIONS = [
  { value: 'Brand New', label: 'Brand New', badge: 'Zero KM' },
  { value: 'Certified Pre-Owned', label: 'Certified Pre-Owned', badge: 'Inspected' },
  { value: 'Foreign Used', label: 'Foreign Used', badge: 'Imported' }
];

const TRANSMISSION_OPTIONS = [
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Dual-Clutch (PDK/DSG)', label: 'Dual-Clutch (PDK/DSG)' }
];

const FUEL_OPTIONS = [
  { value: 'Petrol / Gasoline', label: 'Petrol / Gasoline' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid (PHEV)', label: 'Hybrid (PHEV)' },
  { value: 'Electric (EV)', label: 'Electric (EV)' }
];

const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available', badge: 'In Stock' },
  { value: 'Reserved', label: 'Reserved', badge: 'Hold Deposit' },
  { value: 'Sold', label: 'Sold', badge: 'Completed' }
];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    listing_title: '2024 Mercedes-Benz S 580 4MATIC Luxury Sedan',
    tagline: 'V8 Biturbo, Executive Rear Package, 3D Burmester Audio',
    price: '24500000',
    make: 'Mercedes-Benz',
    model: 'S 580 4MATIC',
    condition: 'Foreign Used',
    year: '2024',
    transmission: 'Automatic',
    engine: '4.0L V8 Biturbo with EQ Boost',
    fuel_type: 'Petrol / Gasoline',
    mileage: '8400',
    color: 'Obsidian Black Metallic',
    interior_color: 'Nappa Leather Exclusive Black',
    offer_type: 'Featured',
    listing_description: 'Immaculate flagship S-Class with full option specification. Single owner, garage kept, ceramic coated.',
    youtube_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'Available',
    features: ['Burmester 3D Sound', 'Panoramic Sunroof', 'Head-Up Display', '360 Camera', 'Rear Executive Seating']
  });

  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (ft) => {
    setForm({ ...form, features: form.features.filter(f => f !== ft) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/crm');
      }, 1200);
    }, 800);
  };

  return (
    <CRMLayout title={`Edit Vehicle Listing #${id || '101'} | KnK Automotive`}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="aq-btn-secondary flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-tight">Edit Vehicle Dossier #{id || '101'}</h1>
              <p className="text-xs text-neutral-400">Update specification details and inventory status</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <Check size={18} /> Listing successfully updated! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
              <Car size={16} /> Basic Vehicle Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={form.listing_title}
                  onChange={(e) => setForm({ ...form, listing_title: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Make *</label>
                <PredictiveSelect
                  options={MAKE_OPTIONS}
                  value={form.make}
                  onChange={(val) => setForm({ ...form, make: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Model Year *</label>
                <input
                  type="text"
                  required
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={16} /> Pricing, Status & Condition
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Price (KES)</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Mileage (KM)</label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Inventory Status</label>
                <PredictiveSelect
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={(val) => setForm({ ...form, status: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Vehicle Condition</label>
                <PredictiveSelect
                  options={CONDITION_OPTIONS}
                  value={form.condition}
                  onChange={(val) => setForm({ ...form, condition: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Transmission</label>
                <PredictiveSelect
                  options={TRANSMISSION_OPTIONS}
                  value={form.transmission}
                  onChange={(val) => setForm({ ...form, transmission: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Fuel Type</label>
                <PredictiveSelect
                  options={FUEL_OPTIONS}
                  value={form.fuel_type}
                  onChange={(val) => setForm({ ...form, fuel_type: val })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900/60 rounded-xl text-xs flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete Listing
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="aq-btn-secondary px-6 py-3 rounded-xl border border-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="aq-btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #e5c158 0%, #c9a84c 100%)',
                  boxShadow: '0 10px 25px -5px rgba(201, 168, 76, 0.4)',
                  padding: '12px 28px',
                  height: '48px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 950,
                  letterSpacing: '1px',
                  color: '#080808'
                }}
              >
                {loading ? 'Saving...' : 'UPDATE DOSSIER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </CRMLayout>
  );
}
