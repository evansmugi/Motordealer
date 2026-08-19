import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Car, Plus, Eye, Pencil, Trash2, Search, Filter, ShieldCheck, 
  TrendingUp, Layers, CheckCircle2, AlertTriangle, ArrowUpRight, DollarSign,
  Tag, Award, Sparkles, X, PlusCircle, Check, ArrowLeft, Star
} from 'lucide-react';
import CRMLayout from '../components/crm/CRMLayout';
import PredictiveSelect from '../components/common/PredictiveSelect';
import UniversalPagination from '../components/common/UniversalPagination';
import ActionTooltip from '../components/common/ActionTooltip';
import ActionConfirmModal from '../components/common/ActionConfirmModal';
import SuccessModal from '../components/common/SuccessModal';
import { VEHICLES } from '../data/mock-dataset';
import { getStoredBrands, saveStoredBrands } from '../lib/brands';
import { getStoredVehicles, upsertStoredVehicle } from '../lib/vehicles';
import { useCRMStore } from '../context/CRMStore';

const STOREFRONT_MASTER_VEHICLES = (VEHICLES || []).map(v => ({
  id: v.id,
  listing_title: `${v.year || 2024} ${v.make || ''} ${v.model || ''} ${v.trim ? v.trim : ''}`.trim(),
  make: v.make || 'Mercedes-Benz',
  model: v.model || 'Luxury Model',
  year: String(v.year || '2024'),
  price: String(v.pricing?.cashPrice || v.price || 24500000),
  condition: v.condition === 'NEW' ? 'Brand New' : v.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified Pre-Owned' : 'Foreign Used',
  transmission: typeof v.transmission === 'object' ? (v.transmission.type || 'Automatic') : (v.transmission || 'Automatic'),
  engine: typeof v.engine === 'object' ? (v.engine.type || '3.0L Turbo') : (v.engine || 'V8 Biturbo'),
  fuel_type: typeof v.fuelEnergy === 'object' ? (v.fuelEnergy.fuelType || 'Petrol') : (v.fuel_type || 'Petrol'),
  mileage: v.history?.odometerKm ? `${v.history.odometerKm} KM` : (v.mileage || '45 KM'),
  color: v.colorExterior || 'Obsidian Black',
  interior_color: v.colorInterior || 'Nappa Leather',
  offer_type: (v.badges && v.badges.includes('FEATURED')) || v.isFeatured ? 'Featured' : 'For Sale',
  currentStatus: 'Available',
  images: Array.isArray(v.images) && v.images.length > 0
    ? v.images.map(img => typeof img === 'string' ? { url: img } : img)
    : [{ url: v.heroImage || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' }]
}));

export default function VehicleManagement() {
  const navigate = useNavigate();
  const adminTheme = useCRMStore(state => state.adminTheme);
  const isLight = adminTheme === 'light';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfferType, setSelectedOfferType] = useState('All');
  const [selectedMake, setSelectedMake] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehiclePage, setVehiclePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Dynamic Brand Management State
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [brandSuccessNotice, setBrandSuccessNotice] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  useEffect(() => {
    setBrands(getStoredBrands());
  }, []);

  async function fetchListings() {
    setLoading(true);
    let strapiList = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('http://localhost:1338/api/car-listings?pagination[limit]=100', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          strapiList = json.data.map(item => {
            const attr = item.attributes || item;
            const isF = Boolean(attr.isFeatured || attr.offer_type === 'Featured' || (attr.badges && attr.badges.includes('FEATURED')));
            return {
              id: String(item.id || attr.id),
              listing_title: attr.listing_title || `${attr.year || ''} ${attr.make || ''} ${attr.model || ''}`,
              make: attr.make || 'Mercedes-Benz',
              model: attr.model || '',
              year: String(attr.year || '2024'),
              price: String(attr.price || '24500000'),
              condition: attr.condition || 'Foreign Used',
              transmission: attr.transmission || 'Automatic',
              engine: attr.engine || 'V8 Turbo',
              fuel_type: attr.fuel_type || 'Petrol',
              mileage: attr.mileage || '4,500 KM',
              color: attr.color || 'Black',
              interior_color: attr.interior_color || 'Black',
              offer_type: isF ? 'Featured' : (attr.offer_type || 'For Sale'),
              isFeatured: isF,
              currentStatus: attr.currentStatus || 'Available',
              features: Array.isArray(attr.features) ? attr.features : ['Panoramic Sunroof'],
              images: Array.isArray(attr.images) && attr.images.length > 0
                ? attr.images.map(img => typeof img === 'string' ? { url: img } : img)
                : [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' }],
              video_url: attr.video_url || ''
            };
          });
        }
      }
    } catch (e) {
      console.warn('Strapi fetch fallback:', e);
    } finally {
      const persistentLocal = getStoredVehicles();
      const merged = [...strapiList];
      
      persistentLocal.forEach(pItem => {
        const existingIdx = merged.findIndex(m => String(m.id) === String(pItem.id));
        const isF = Boolean(pItem.isFeatured || pItem.offer_type === 'Featured');
        const normalized = { ...pItem, isFeatured: isF, offer_type: isF ? 'Featured' : (pItem.offer_type || 'For Sale') };
        if (existingIdx >= 0) {
          merged[existingIdx] = { ...merged[existingIdx], ...normalized };
        } else {
          merged.push(normalized);
        }
      });

      STOREFRONT_MASTER_VEHICLES.forEach(masterItem => {
        if (!merged.some(m => String(m.id) === String(masterItem.id))) {
          const isF = masterItem.id === 'veh-001' || masterItem.offer_type === 'Featured';
          merged.push({
            ...masterItem,
            isFeatured: isF,
            offer_type: isF ? 'Featured' : (masterItem.offer_type || 'For Sale')
          });
        }
      });

      setListings(merged);
      setLoading(false);
    }
  }

  const toggleFeaturedStatus = (listing) => {
    const currentlyFeatured = Boolean(listing.isFeatured || listing.offer_type === 'Featured');
    const nextFeatured = !currentlyFeatured;
    const updated = {
      ...listing,
      isFeatured: nextFeatured,
      offer_type: nextFeatured ? 'Featured' : 'For Sale'
    };

    setListings(prev => prev.map(item => String(item.id) === String(listing.id) ? updated : item));
    upsertStoredVehicle(updated);

    setSuccessNotice({
      title: nextFeatured ? "Marked as Featured Vehicle!" : "Updated to Standard Inventory!",
      vehicleTitle: listing.listing_title,
      message: nextFeatured
        ? "This vehicle is now flagged as Featured and automatically displays in the Featured Cars section on the Storefront Homepage."
        : "This vehicle has been updated to Standard Inventory status and synchronized with the backend database."
    });

    fetch(`http://localhost:1338/api/car-listings/${listing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { isFeatured: nextFeatured, offer_type: nextFeatured ? 'Featured' : 'For Sale' } })
    }).catch(() => null);
  };

  useEffect(() => {
    fetchListings();

    const handleUpdate = () => {
      fetchListings();
    };
    window.addEventListener('knk_vehicles_updated', handleUpdate);
    return () => window.removeEventListener('knk_vehicles_updated', handleUpdate);
  }, []);

  const makeOptions = useMemo(() => {
    return ['All', ...brands];
  }, [brands]);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if (selectedOfferType && selectedOfferType !== 'All' && selectedOfferType !== 'Select option...') {
        if (selectedOfferType === 'Featured') {
          const isF = Boolean(item.isFeatured || item.offer_type === 'Featured' || (Array.isArray(item.badges) && item.badges.includes('FEATURED')));
          if (!isF) return false;
        } else if (item.offer_type !== selectedOfferType) {
          return false;
        }
      }
      if (selectedMake && selectedMake !== 'All' && selectedMake !== 'Select option...' && item.make !== selectedMake) return false;
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const titleMatch = (item.listing_title || '').toLowerCase().includes(query);
        const makeMatch = (item.make || '').toLowerCase().includes(query);
        const modelMatch = (item.model || '').toLowerCase().includes(query);
        return titleMatch || makeMatch || modelMatch;
      }
      return true;
    });
  }, [listings, selectedOfferType, selectedMake, searchTerm]);

  const handleDeleteListing = async () => {
    if (!confirmDelete) return;
    try {
      deleteStoredVehicle(String(confirmDelete.id));
      await fetch(`http://localhost:1338/api/car-listings/${confirmDelete.id}`, { method: 'DELETE' }).catch(() => null);
      setListings(prev => prev.filter(item => String(item.id) !== String(confirmDelete.id)));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    const trimmed = newBrandName.trim();
    if (!trimmed) return;
    if (brands.some(b => b.toLowerCase() === trimmed.toLowerCase())) {
      setBrandSuccessNotice(`Brand "${trimmed}" already exists.`);
      setTimeout(() => setBrandSuccessNotice(null), 3000);
      return;
    }
    const updated = [...brands, trimmed];
    setBrands(updated);
    saveStoredBrands(updated);
    setNewBrandName('');
    setBrandSuccessNotice(`Brand "${trimmed}" added successfully! Syncing with storefront...`);
    setTimeout(() => setBrandSuccessNotice(null), 4000);
  };

  const handleDeleteBrand = (brandToDelete) => {
    const updated = brands.filter(b => b !== brandToDelete);
    setBrands(updated);
    saveStoredBrands(updated);
    setBrandSuccessNotice(`Brand "${brandToDelete}" deleted.`);
    setTimeout(() => setBrandSuccessNotice(null), 3000);
  };

  const coverImage = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const first = item.images[0];
      return typeof first === 'string' ? first : (first?.url || '');
    }
    return '';
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return price || 'KES 24,500,000';
    return `KES ${num.toLocaleString()}`;
  };

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;

  return (
    <CRMLayout title="Vehicle Inventory Management | KnK Automotive">
      <div className="w-full space-y-6">
        
        {/* Module Header & Actions */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <div className="flex items-center gap-4">
            <Link
              to="/crm"
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
              title="Return to Main Admin Dashboard"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#c9a84c] uppercase tracking-wider">
                <Car size={16} /> Dedicated Vehicles Management Module
              </div>
              <h1 className={`text-2xl font-black uppercase tracking-tight mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Vehicle Inventory Registry
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/add-listing"
              className="px-5 py-2.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#c9a84c]/20"
            >
              <Plus size={16} /> Add Vehicle Listing
            </Link>
          </div>
        </div>

        {/* Telemetry KPI Cards Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div>
              <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Total Inventory</span>
              <div className={`text-2xl font-black mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{listings.length} Vehicles</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 text-[#c9a84c] flex items-center justify-center font-bold">
              <Car size={20} />
            </div>
          </div>

          <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div>
              <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Available For Sale</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {listings.filter(l => l.currentStatus === 'Available').length || listings.length}
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-950/50 text-emerald-400'
            }`}>
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div>
              <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Managed Brands</span>
              <div className="text-2xl font-black text-[#c9a84c] mt-0.5">
                {brands.length} Brands
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 text-[#c9a84c] flex items-center justify-center font-bold">
              <Tag size={20} />
            </div>
          </div>

          <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div>
              <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Storefront Real-Time Sync</span>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 size={14} /> Active & Synchronized
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-950/50 text-emerald-400'
            }`}>
              <Layers size={20} />
            </div>
          </div>
        </div>

        {/* Edge-To-Edge Vehicle Inventory Table Container */}
        <div className={`border rounded-2xl overflow-hidden shadow-xl w-full transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
        }`}>
          <div className={`px-6 py-4 border-b flex items-center justify-between flex-wrap gap-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div>
              <h2 className={`text-lg font-bold uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Active Vehicle Inventory
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Displaying {filteredListings.length} Vehicles • Auto-updates storefront showroom
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search input */}
              <div className="relative w-64">
                <Search size={14} className={`absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search title, make, model..."
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-[#c9a84c]' 
                      : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              {/* Offer Type */}
              <div className="w-44">
                <PredictiveSelect
                  label="Offer Type"
                  value={selectedOfferType}
                  onChange={setSelectedOfferType}
                  options={[
                    { value: 'All', label: 'All Offers' },
                    { value: 'Featured', label: 'Featured Inventory' },
                    { value: 'For Sale', label: 'For Sale' },
                    { value: 'For Hire', label: 'For Hire' },
                    { value: 'Lease', label: 'Lease' },
                  ]}
                />
              </div>

              {/* Vehicle Make */}
              <div className="w-44">
                <PredictiveSelect
                  label="Vehicle Make"
                  value={selectedMake}
                  onChange={setSelectedMake}
                  options={makeOptions.map(m => ({ value: m, label: m === 'All' ? 'All Makes' : m }))}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`p-16 text-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-[#c9a84c] rounded-full animate-spin mx-auto mb-2" />
              Loading vehicle inventory...
            </div>
          ) : filteredListings.length === 0 ? (
            <div className={`p-16 text-center text-sm ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              No vehicles found matching the selected filters.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#121212] border-neutral-800 text-neutral-400'
                  }`}>
                    <th className="py-3.5 px-6">Photo</th>
                    <th className="py-3.5 px-6">Title</th>
                    <th className="py-3.5 px-6">Make / Year</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Condition</th>
                    <th className="py-3.5 px-6">Type</th>
                    <th className="py-3.5 px-6">Featured</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${
                  isLight ? 'divide-slate-200' : 'divide-neutral-900'
                }`}>
                  {filteredListings.slice((vehiclePage - 1) * itemsPerPage, vehiclePage * itemsPerPage).map(listing => {
                    const isF = Boolean(listing.isFeatured || listing.offer_type === 'Featured');
                    return (
                      <tr key={listing.id} className={`transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-[#121212]'
                      }`}>
                        <td className="py-3.5 px-6">
                          {coverImage(listing) ? (
                            <img className="w-16 h-11 object-cover rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm" src={coverImage(listing)} alt="" />
                          ) : (
                            <div className={`w-16 h-11 border rounded-lg flex items-center justify-center text-[9px] uppercase font-mono ${
                              isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                            }`}>
                              No Img
                            </div>
                          )}
                        </td>
                        <td className={`py-3.5 px-6 font-bold text-sm ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {listing.listing_title}
                        </td>
                        <td className={`py-3.5 px-6 ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                          {listing.make} • <span className="text-[#c9a84c] font-bold">{listing.year}</span>
                        </td>
                        <td className="py-3.5 px-6 font-extrabold text-[#c9a84c] text-sm">
                          {formatPrice(listing.price)}
                        </td>
                        <td className={`py-3.5 px-6 ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                          {listing.condition}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`border text-[10px] font-bold px-2.5 py-1 rounded-md uppercase ${
                            isLight 
                              ? 'bg-amber-50 text-amber-900 border-amber-300' 
                              : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                          }`}>
                            {listing.offer_type || 'For Sale'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <button
                            type="button"
                            onClick={() => toggleFeaturedStatus(listing)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                              isF
                                ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/60 shadow-md hover:bg-[#c9a84c]/30'
                                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                            }`}
                            title="Toggle Storefront Homepage Featured Status"
                          >
                            <Star size={13} className={isF ? 'text-[#c9a84c]' : 'text-slate-500'} fill={isF ? '#c9a84c' : 'none'} />
                            <span>{isF ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <ActionTooltip text="Preview Dedicated Un-Editable Vehicle Dossier">
                            <button
                              onClick={() => navigate(`/view-listing/${listing.id}`)}
                              className={`p-2 rounded-lg transition-all cursor-pointer ${
                                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                              }`}
                            >
                              <Eye size={16} />
                            </button>
                          </ActionTooltip>
                          <ActionTooltip text="Edit Vehicle Specs & Pricing">
                            <button
                              onClick={() => navigate(`/edit-listing/${listing.id}`)}
                              className={`p-2 rounded-lg transition-all cursor-pointer ${
                                isLight ? 'text-amber-700 hover:bg-amber-100' : 'text-neutral-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10'
                              }`}
                            >
                              <Pencil size={16} />
                            </button>
                          </ActionTooltip>
                          <ActionTooltip text="Permanently Delete Vehicle">
                            <button
                              onClick={() => setConfirmDelete(listing)}
                              className={`p-2 rounded-lg transition-all cursor-pointer ${
                                isLight ? 'text-rose-600 hover:bg-rose-100' : 'text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40'
                              }`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </ActionTooltip>
                        </div>
                      </td>
                    </tr>
                  )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Universal Pagination */}
          <div className={`p-4 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-neutral-800 bg-[#0a0a0a]'}`}>
            <UniversalPagination
              currentPage={vehiclePage}
              totalPages={totalPages}
              totalItems={filteredListings.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setVehiclePage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          </div>
        </div>

        {/* Dedicated Brand & Manufacturer Management Section */}
        <div className={`border rounded-2xl p-6 space-y-5 w-full transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0a0a0a] border-neutral-800 shadow-2xl'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
            isLight ? 'border-slate-200' : 'border-neutral-800'
          }`}>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#c9a84c] uppercase">
                <Tag size={16} /> Brand & Manufacturer Directory
              </div>
              <h2 className={`text-lg font-black uppercase tracking-tight mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Dynamic Vehicle Brands Management
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Add or remove car manufacturers. All updates automatically populate Storefront filter dropdowns.
              </p>
            </div>

            {/* Add Brand Form */}
            <form onSubmit={handleAddBrand} className="flex items-center gap-2">
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter Brand Name (e.g. Bentley)"
                className={`border rounded-xl px-3.5 py-2 text-xs outline-none w-56 transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]'
                    : 'bg-[#121212] border-neutral-800 text-white focus:border-[#c9a84c]'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <PlusCircle size={15} /> Add Brand
              </button>
            </form>
          </div>

          {brandSuccessNotice && (
            <div className={`p-3 border rounded-xl text-xs font-bold flex items-center gap-2 ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
            }`}>
              <CheckCircle2 size={16} /> {brandSuccessNotice}
            </div>
          )}

          {/* Active Brands Pills Directory */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {brands.map((brand) => (
              <div
                key={brand}
                className={`border rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 hover:border-[#c9a84c]'
                    : 'bg-[#121212] border-neutral-800 text-white hover:border-[#c9a84c]/50'
                }`}
              >
                <span>{brand}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteBrand(brand)}
                  title={`Delete ${brand}`}
                  className={`p-0.5 rounded transition-colors cursor-pointer ${
                    isLight ? 'text-slate-400 hover:text-rose-600' : 'text-neutral-500 hover:text-rose-400'
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <ActionConfirmModal
            isOpen={Boolean(confirmDelete)}
            title="Delete Vehicle Listing"
            description={`Are you sure you want to delete ${confirmDelete.listing_title}? This action cannot be undone.`}
            confirmText="Delete Vehicle"
            onConfirm={handleDeleteListing}
            onClose={() => setConfirmDelete(null)}
          />
        )}

        {/* Gorgeous Success Confirmation Modal */}
        <SuccessModal
          isOpen={Boolean(successNotice)}
          onClose={() => setSuccessNotice(null)}
          title={successNotice?.title || "Vehicle Inventory Updated!"}
          vehicleTitle={successNotice?.vehicleTitle}
          message={successNotice?.message || "Changes have been saved successfully to database and updated live on the storefront."}
          primaryActionText="Dismiss & Continue"
          onPrimaryAction={() => setSuccessNotice(null)}
          isLight={isLight}
          autoCloseMs={3500}
        />
      </div>
    </CRMLayout>
  );
}
