import { VEHICLES as MOCK_VEHICLES } from '../data/mock-dataset.ts';

export interface VehicleListing {
  id: string;
  listing_title: string;
  tagline?: string;
  price: string;
  cost_price?: string;
  make: string;
  model: string;
  condition: string;
  year: string;
  transmission: string;
  engine: string;
  fuel_type: string;
  mileage: string;
  color: string;
  interior_color: string;
  offer_type: string;
  listing_description?: string;
  currentStatus: string;
  features: string[];
  images: Array<{ url: string } | string>;
  video_url?: string;
}

const STORAGE_KEY = 'knk_custom_car_listings';
const EVENT_NAME = 'knk_vehicles_updated';

// Format initial mock dataset into normalized vehicle listings
const INITIAL_MASTER_LISTINGS: VehicleListing[] = (MOCK_VEHICLES || []).map(v => ({
  id: String(v.id),
  listing_title: `${v.year || 2024} ${v.make || ''} ${v.model || ''} ${v.trim ? v.trim : ''}`.trim(),
  tagline: v.shortTagline || '',
  price: String(v.pricing?.cashPrice || (v as any).price || 24500000),
  cost_price: '18000000',
  make: v.make || 'Mercedes-Benz',
  model: v.model || 'Luxury Model',
  year: String(v.year || '2024'),
  condition: v.condition === 'NEW' ? 'Brand New' : v.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified Pre-Owned' : 'Foreign Used',
  transmission: typeof v.transmission === 'object' ? (v.transmission.type || 'Automatic') : (v.transmission || 'Automatic'),
  engine: typeof v.engine === 'object' ? (v.engine.type || '3.0L Turbo') : (v.engine || 'V8 Biturbo'),
  fuel_type: typeof v.fuelEnergy === 'object' ? (v.fuelEnergy.fuelType || 'Petrol') : ((v as any).fuel_type || 'Petrol'),
  mileage: v.history?.odometerKm ? `${v.history.odometerKm} KM` : ((v as any).mileage || '45 KM'),
  color: v.colorExterior || 'Obsidian Black',
  interior_color: v.colorInterior || 'Nappa Leather',
  offer_type: (v.badges && v.badges.includes('FEATURED')) || v.isFeatured ? 'Featured' : 'For Sale',
  listing_description: 'High-specification executive vehicle dossier.',
  currentStatus: 'Available',
  features: ['Burmester 3D Surround Sound', 'Panoramic Sunroof', '360-Degree Surround View Camera', 'Nappa Leather Seats', 'Adaptive Air Suspension'],
  images: Array.isArray(v.images) && v.images.length > 0
    ? v.images.map(img => typeof img === 'string' ? { url: img } : img)
    : [{ url: v.heroImage || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' }],
  video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}));

export function getStoredVehicles(): VehicleListing[] {
  if (typeof window === 'undefined') return INITIAL_MASTER_LISTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MASTER_LISTINGS));
      return INITIAL_MASTER_LISTINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MASTER_LISTINGS;
  } catch (e) {
    console.error('Error reading stored vehicles:', e);
    return INITIAL_MASTER_LISTINGS;
  }
}

export function saveStoredVehicles(vehicles: VehicleListing[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: vehicles }));
  } catch (e) {
    console.error('Error saving vehicles:', e);
  }
}

export function upsertStoredVehicle(vehicle: VehicleListing) {
  const current = getStoredVehicles();
  const existingIdx = current.findIndex(v => String(v.id) === String(vehicle.id));
  let updated: VehicleListing[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...vehicle };
  } else {
    updated = [vehicle, ...current];
  }
  saveStoredVehicles(updated);
  return updated;
}

export function deleteStoredVehicle(id: string) {
  const current = getStoredVehicles();
  const updated = current.filter(v => String(v.id) !== String(id));
  saveStoredVehicles(updated);
  return updated;
}

export function getEmbedVideoUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // YouTube match: watch?v=ID, embed/ID, or youtu.be/ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }
  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  return trimmed;
}
