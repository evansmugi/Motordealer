/* AETHEL MOTORS / NEXUS DRIVE — Master Vehicle Dataset & Legacy Compatibility */

export * from './vehicle-dataset';
import { VEHICLES, VehicleItem } from './vehicle-dataset';

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  description: string;
  shortDescription?: string;
  badge?: string;
  stock: number;
  images: string[];
  variants: { color: string; option: string; stock: number; priceModifier: number }[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  itemCount: number;
  image: string;
  tagline: string;
  description: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  name: string;
  code: string;
  discount: string;
  discountType: string;
  discountValue: number;
  usageCount: number;
  budget: number;
  active: boolean;
  expiry: string;
  description: string;
}

export const PRODUCTS: ProductItem[] = VEHICLES.map(v => ({
  id: v.id,
  name: `${v.year} ${v.make} ${v.model}`,
  slug: v.id,
  brand: v.make,
  sku: v.stockNumber,
  price: v.pricing.cashPrice,
  compareAtPrice: v.pricing.originalPrice,
  rating: 4.9,
  reviewsCount: 28,
  category: v.bodyType,
  description: v.overviewDescription,
  shortDescription: v.shortTagline,
  badge: v.badges[0] || 'FEATURED',
  stock: 1,
  images: v.images,
  variants: [{ color: v.colorExterior, option: v.trim, stock: 1, priceModifier: 0 }],
  specifications: {
    Engine: v.engine.type,
    Power: `${v.engine.powerHp} HP`,
    Torque: `${v.engine.torqueNm} Nm`,
    Transmission: `${v.transmission.gears}-Speed ${v.transmission.type}`,
    Drivetrain: v.drivetrain.type,
    Fuel: v.fuelEnergy.fuelType
  },
  isFeatured: v.isFeatured
}));

export const CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'SUVs & 4x4 Off-Road', slug: 'suv', count: 12, itemCount: 12, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop', tagline: 'All-Terrain Supremacy', description: 'High-performance 4x4 off-road SUVs.' },
  { id: 'cat-2', name: 'Luxury Saloons & Executive', slug: 'sedan', count: 8, itemCount: 8, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600&auto=format&fit=crop', tagline: 'High-Performance Executive Class', description: 'Luxury executive sedans.' },
  { id: 'cat-3', name: 'Electric & Hyper Hybrids', slug: 'ev', count: 6, itemCount: 6, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop', tagline: '100% Zero-Emissions Telemetry', description: 'Zero emissions electric vehicles.' },
  { id: 'cat-4', name: 'Pickups & Commercial Fleets', slug: 'pickup', count: 9, itemCount: 9, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop', tagline: 'Heavy-Duty Commercial Power', description: 'Heavy duty commercial pickups.' }
];

export const CAMPAIGNS: CampaignItem[] = [
  { id: 'cmp-1', title: 'Land Cruiser Prado Launch Blitz', name: 'Land Cruiser Prado Launch Blitz', code: 'PRADO2026', discount: '15% Off Deposit', discountType: 'PERCENTAGE', discountValue: 15, usageCount: 42, budget: 15000, active: true, expiry: '2026-09-01', description: 'Exclusive deposit discount for first 10 buyers.' },
  { id: 'cmp-2', title: 'BMW M5 Performance Showcase', name: 'BMW M5 Performance Showcase', code: 'M5POWER', discount: '$5,000 Trade Credit', discountType: 'FIXED', discountValue: 5000, usageCount: 68, budget: 20000, active: true, expiry: '2026-09-15', description: 'Bonus trade-in credit allowance.' }
];

export const ORDERS = [
  {
    id: 'ORD-9001',
    orderNumber: 'ORD-9001',
    createdAt: '2026-08-18',
    date: '2026-08-18',
    total: 98500,
    totalAmount: 98500,
    status: 'DELIVERED',
    orderStatus: 'DELIVERED',
    itemsCount: 1,
    items: [
      {
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=300',
        name: 'Toyota Land Cruiser Prado 2025',
        sku: 'NK-2026-901',
        price: 98500,
        quantity: 1,
        variantColor: 'Heritage Sand',
        variantOption: 'First Edition'
      }
    ],
    timeline: [{ status: 'Order Placed', timestamp: '2026-08-18', note: 'Deposit Received' }],
    trackingNumber: 'TRK-9001-KDF'
  }
];
