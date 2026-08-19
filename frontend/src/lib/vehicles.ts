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

export function getStoredVehicles(): VehicleListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading stored vehicles:', e);
    return [];
  }
}

export function getEmbedVideoUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  return trimmed;
}
