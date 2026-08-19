/* AETHEL MOTORS / NEXUS DRIVE — Master Vehicle Dataset for ERP Operational OS */

export * from '../../../frontend/src/lib/vehicle-dataset';
import { VEHICLES } from '../../../frontend/src/lib/vehicle-dataset';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  reservedStock: number;
  status: string;
  brand: string;
  rating: number;
  images: string[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  createdAt: string;
  total: number;
  totalAmount: number;
  status: string;
  orderStatus: string;
  paymentStatus: string;
  itemsCount: number;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: { city: string; street: string; state: string; zip: string; country: string };
  timeline: { status: string; timestamp: string; note: string }[];
}

export interface WarehouseStock {
  id: string;
  sku: string;
  warehouseName: string;
  city: string;
  skuCount: number;
  totalUnits: number;
  available: number;
  reserved: number;
  reorderPoint: number;
  binLocation: string;
  capacityUtilization: number;
}

export interface SupplierItem {
  id: string;
  code: string;
  name: string;
  country: string;
  contactName: string;
  contactPerson: string;
  email: string;
  leadTimeDays: number;
  activeOrders: number;
  rating: number;
}

export interface CampaignItem {
  id: string;
  name: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageCount: number;
  budget: number;
  spent: number;
  leadsGenerated: number;
  status: string;
}

export const PRODUCTS: ProductItem[] = VEHICLES.map(v => ({
  id: v.id,
  name: `${v.year} ${v.make} ${v.model}`,
  sku: v.stockNumber,
  category: v.bodyType,
  price: v.pricing.cashPrice,
  costPrice: v.pricing.costPrice,
  stock: 1,
  reservedStock: 0,
  status: 'PUBLISHED',
  brand: v.make,
  rating: 4.9,
  images: v.images
}));

export const ORDERS: OrderItem[] = [
  {
    id: 'ORD-9001',
    orderNumber: 'ORD-9001',
    customerName: 'Dr. Evelyn Vance',
    customerEmail: 'evelyn.vance@blackmesa.org',
    date: '2026-08-18',
    createdAt: '2026-08-18T10:00:00Z',
    total: 98500,
    totalAmount: 98500,
    status: 'DELIVERED',
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    itemsCount: 1,
    items: [{ name: 'Toyota Land Cruiser Prado 2025', quantity: 1, price: 98500 }],
    shippingAddress: { city: 'Nairobi', street: 'Westlands Ave', state: 'Nairobi', zip: '00100', country: 'Kenya' },
    timeline: [{ status: 'Order Placed', timestamp: '2026-08-18', note: 'Customer paid deposit' }]
  }
];

export const WAREHOUSE_STOCKS: WarehouseStock[] = [
  {
    id: 'wh-1',
    sku: 'NK-2026-901',
    warehouseName: 'Central Executive Showroom Yard',
    city: 'Nairobi',
    skuCount: 18,
    totalUnits: 18,
    available: 15,
    reserved: 3,
    reorderPoint: 5,
    binLocation: 'Bay A-04',
    capacityUtilization: 85
  }
];

export const SUPPLIERS: SupplierItem[] = [
  {
    id: 'sup-1',
    code: 'SUP-TOYOTA',
    name: 'Toyota Motor Logistics Europe',
    country: 'Japan / UK',
    contactName: 'Hiroshi Tanaka',
    contactPerson: 'Hiroshi Tanaka',
    email: 'h.tanaka@toyota-export.jp',
    leadTimeDays: 14,
    activeOrders: 3,
    rating: 4.9
  }
];

export const CAMPAIGNS: CampaignItem[] = [
  {
    id: 'cmp-101',
    name: 'Land Cruiser Prado Launch Blitz',
    code: 'PRADO2026',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    usageCount: 42,
    budget: 15000,
    spent: 8400,
    leadsGenerated: 42,
    status: 'ACTIVE'
  }
];
