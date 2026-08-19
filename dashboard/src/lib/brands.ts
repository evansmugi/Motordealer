export const DEFAULT_BRANDS = [
  'Mercedes-Benz',
  'BMW',
  'Toyota',
  'Audi',
  'Porsche',
  'Range Rover',
  'Tesla',
  'Lexus',
  'Land Cruiser',
  'Ford',
  'Nissan',
  'Subaru',
  'Volkswagen',
  'Hyundai'
];

export function getStoredBrands(): string[] {
  if (typeof window === 'undefined') return DEFAULT_BRANDS;
  const saved = localStorage.getItem('knk_vehicle_brands');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn('Failed to parse saved brands:', e);
    }
  }
  return DEFAULT_BRANDS;
}

export function saveStoredBrands(brands: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('knk_vehicle_brands', JSON.stringify(brands));
    window.dispatchEvent(new Event('knk_brands_updated'));
  }
}
