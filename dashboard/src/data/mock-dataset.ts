export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  stock: number;
  reservedStock: number;
  category: string;
  brand: string;
  badge?: string;
  images: string[];
  variants: {
    color: string;
    option: string;
    stock: number;
    priceModifier: number;
  }[];
  specifications: Record<string, string>;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  orderStatus: 'PENDING' | 'PAYMENT_PENDING' | 'PAID' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentMethod: string;
  trackingNumber: string;
  createdAt: string;
  items: {
    productId: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
}

export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  sku: string;
  available: number;
  reserved: number;
  reorderPoint: number;
  binLocation: string;
}

export interface SupplierItem {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  leadTimeDays: number;
  rating: number;
  activeOrders: number;
}

export interface CampaignItem {
  id: string;
  code: string;
  name: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  active: boolean;
  usageCount: number;
  budget: number;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    slug: 'neural-interface',
    name: 'Neural & Haptics',
    description: 'Direct bio-neural connectivity & micro-tactile sensory arrays.',
    icon: 'Brain',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop',
    itemCount: 4
  },
  {
    id: 'cat-2',
    slug: 'quantum-computing',
    name: 'Quantum Optics & Compute',
    description: 'Cryo-cooled photon engines & sub-atomic processing modules.',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
    itemCount: 5
  },
  {
    id: 'cat-3',
    slug: 'kinetic-workstations',
    name: 'Kinetic Workstations',
    description: 'Anti-grav ergonomic pods & zero-latency tactile control desks.',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    itemCount: 3
  },
  {
    id: 'cat-4',
    slug: 'autonomous-drones',
    name: 'Autonomous Airborne Drones',
    description: 'Sub-orbital surveillance, automated delivery & swarm robotics.',
    icon: 'Send',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1000&auto=format&fit=crop',
    itemCount: 3
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    sku: 'NEX-NEURO-X1',
    name: 'AETHEL Neural Haptic Visor X1',
    slug: 'aethel-neural-haptic-visor-x1',
    shortDescription: 'Sub-millisecond bio-interface with retinal laser projection & spatial sensory audio.',
    description: 'Engineered for high-throughput cybernetic telemetry and immersive spatial synthesis. Features 120Hz micro-OLED panels, graphene heat sinks, and multi-nodal optical nerve feedback.',
    price: 3499.00,
    compareAtPrice: 3899.00,
    costPrice: 1950.00,
    stock: 42,
    reservedStock: 5,
    category: 'neural-interface',
    brand: 'NEXUS PRIME',
    badge: 'FLAGSHIP',
    images: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { color: 'Obsidian Titanium', option: 'Standard Band', stock: 25, priceModifier: 0 },
      { color: 'Cyber Emerald', option: 'Neural-Weave Pro Band', stock: 17, priceModifier: 250 }
    ],
    specifications: {
      'Optical Matrix': 'Dual 4K Micro-OLED @ 120Hz',
      'Latency': '0.8ms Bio-Feedback Sync',
      'Weight': '280 grams (Carbon Composite)',
      'Connectivity': 'Quantum-Sync 6.0 GHz / Optical Link'
    },
    rating: 4.95,
    reviewsCount: 38,
    isFeatured: true
  },
  {
    id: 'prod-2',
    sku: 'NEX-QUANT-CORE',
    name: 'VORTEX Quantum Core Processor Mk IV',
    slug: 'vortex-quantum-core-processor-mk-iv',
    shortDescription: '128-Qubit Cryo-Chamber Processor for high-density AI acceleration.',
    description: 'Designed for enterprise algorithmic simulation and real-time neural modeling. Features sapphire optical interconnects and zero-maintenance Peltier cooling matrix.',
    price: 8950.00,
    compareAtPrice: 9500.00,
    costPrice: 4800.00,
    stock: 15,
    reservedStock: 2,
    category: 'quantum-computing',
    brand: 'VORTEX LABS',
    badge: 'LIMITED SUPPLY',
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { color: 'Deep Silver', option: 'Air Cooled Module', stock: 10, priceModifier: 0 },
      { color: 'Cobalt Blue', option: 'Liquid Cryo Kit', stock: 5, priceModifier: 600 }
    ],
    specifications: {
      'Qubit Density': '128 Superconducting Qubits',
      'Coherence Time': '450 microseconds',
      'Power Draw': '145W Nominal',
      'Interface': 'PCIe Gen 6.0 x32'
    },
    rating: 5.0,
    reviewsCount: 14,
    isFeatured: true
  },
  {
    id: 'prod-3',
    sku: 'NEX-KINETIC-POD',
    name: 'KINETIC Zero-G Ergonomic Pod',
    slug: 'kinetic-zero-g-ergonomic-pod',
    shortDescription: 'Pneumatic levitation station with integrated biometrics & focal lighting.',
    description: 'Restructure your workstation experience with full spinal decompression, ambient environmental lighting, and dynamic muscle massage matrix.',
    price: 6200.00,
    compareAtPrice: 6800.00,
    costPrice: 3100.00,
    stock: 8,
    reservedStock: 1,
    category: 'kinetic-workstations',
    brand: 'AETHEL OS',
    badge: 'NEW RELEASE',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { color: 'Midnight Black', option: 'Synthetic Leather', stock: 5, priceModifier: 0 },
      { color: 'Titanium Grey', option: 'Breathable Mesh Pro', stock: 3, priceModifier: 400 }
    ],
    specifications: {
      'Recline Angle': '165° Zero-Gravity Tilt',
      'Weight Capacity': '220 kg',
      'Structure': 'Aero-Grade Titanium Frame',
      'Audio': 'Integrated 3D Surround Pod Speakers'
    },
    rating: 4.88,
    reviewsCount: 29,
    isFeatured: true
  },
  {
    id: 'prod-4',
    sku: 'NEX-DRONE-SWARM',
    name: 'AERO-SWARM Autonomous Courier Unit',
    slug: 'aero-swarm-autonomous-courier-unit',
    shortDescription: 'Tri-rotor carbon fiber drone with LIDAR spatial navigation & payload lock.',
    description: 'Rapid autonomous payload delivery drone equipped with optical collision avoidance, encrypted GPS-independent navigation, and weather-proof sealing.',
    price: 4150.00,
    costPrice: 2200.00,
    stock: 24,
    reservedStock: 3,
    category: 'autonomous-drones',
    brand: 'NEXUS PRIME',
    badge: 'POPULAR',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { color: 'Tactile Charcoal', option: 'Standard Battery (45m)', stock: 15, priceModifier: 0 },
      { color: 'Safety Orange', option: 'Extended Battery (90m)', stock: 9, priceModifier: 350 }
    ],
    specifications: {
      'Range': '40 km Radius',
      'Payload Capacity': '6.5 kg',
      'Max Speed': '110 km/h',
      'Sensors': '360° LIDAR + Dual Thermal Array'
    },
    rating: 4.92,
    reviewsCount: 52,
    isFeatured: true
  },
  {
    id: 'prod-5',
    sku: 'NEX-NEURO-GLOVE',
    name: 'SYNTAC Micro-Tactile Haptic Gloves',
    slug: 'syntac-micro-tactile-haptic-gloves',
    shortDescription: 'Full finger force-feedback with micro-vibration texture simulation.',
    description: 'Feel virtual surfaces with micro-newton tactile precision. Designed for medical surgery simulation, CAD modeling, and immersive digital interaction.',
    price: 1850.00,
    costPrice: 900.00,
    stock: 60,
    reservedStock: 4,
    category: 'neural-interface',
    brand: 'AETHEL OS',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { color: 'Matte Slate', option: 'Medium Pair', stock: 35, priceModifier: 0 },
      { color: 'Matte Slate', option: 'Large Pair', stock: 25, priceModifier: 0 }
    ],
    specifications: {
      'Actuators': '32 Piezo-Tactile Nodes per Hand',
      'Force Feedback': 'Up to 15N per finger',
      'Latency': '< 2ms',
      'Battery': '8 Hours Active Use'
    },
    rating: 4.78,
    reviewsCount: 19,
    isFeatured: false
  }
];

export const ORDERS: OrderItem[] = [
  {
    id: 'ord-1001',
    orderNumber: 'NX-892041',
    customerName: 'Dr. Evelyn Vance',
    customerEmail: 'evelyn.vance@blackmesa.org',
    totalAmount: 12449.00,
    subtotal: 12449.00,
    taxAmount: 0.00,
    shippingCost: 0.00,
    discountAmount: 0.00,
    orderStatus: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    trackingNumber: 'TRK-990812-NX',
    createdAt: '2026-08-17T14:30:00Z',
    items: [
      {
        productId: 'prod-1',
        sku: 'NEX-NEURO-X1',
        name: 'AETHEL Neural Haptic Visor X1',
        price: 3499.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop'
      },
      {
        productId: 'prod-2',
        sku: 'NEX-QUANT-CORE',
        name: 'VORTEX Quantum Core Processor Mk IV',
        price: 8950.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'PENDING', timestamp: '2026-08-17T14:30:00Z', note: 'Order submitted by customer.' },
      { status: 'PAID', timestamp: '2026-08-17T14:31:00Z', note: 'Payment verified via Stripe Gateway.' },
      { status: 'PROCESSING', timestamp: '2026-08-17T15:00:00Z', note: 'Order allocated to Alpha Central Warehouse.' },
      { status: 'PACKED', timestamp: '2026-08-17T17:15:00Z', note: 'Inspected and sealed in anti-static container.' },
      { status: 'SHIPPED', timestamp: '2026-08-18T09:20:00Z', note: 'Handed to Express Courier. Tracking assigned.' }
    ],
    shippingAddress: {
      street: '742 Quantum Way, Suite 400',
      city: 'Palo Alto',
      state: 'CA',
      country: 'USA',
      zip: '94301'
    }
  },
  {
    id: 'ord-1002',
    orderNumber: 'NX-892042',
    customerName: 'Marcus Thorne',
    customerEmail: 'm.thorne@cyberdyne.io',
    totalAmount: 6200.00,
    subtotal: 6200.00,
    taxAmount: 0.00,
    shippingCost: 0.00,
    discountAmount: 0.00,
    orderStatus: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'APPLE_PAY',
    trackingNumber: 'PENDING',
    createdAt: '2026-08-18T10:15:00Z',
    items: [
      {
        productId: 'prod-3',
        sku: 'NEX-KINETIC-POD',
        name: 'KINETIC Zero-G Ergonomic Pod',
        price: 6200.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'PENDING', timestamp: '2026-08-18T10:15:00Z', note: 'Order submitted by customer.' },
      { status: 'PAID', timestamp: '2026-08-18T10:16:00Z', note: 'Payment verified via Apple Pay.' },
      { status: 'PROCESSING', timestamp: '2026-08-18T11:00:00Z', note: 'Sent to assembly line for zero-G calibration.' }
    ],
    shippingAddress: {
      street: '120 Cyberdyne Blvd',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      zip: '78701'
    }
  }
];

export const WAREHOUSE_STOCKS: WarehouseStock[] = [
  { warehouseId: 'wh-alpha', warehouseName: 'Alpha Central (US West)', sku: 'NEX-NEURO-X1', available: 25, reserved: 3, reorderPoint: 10, binLocation: 'A-12-04' },
  { warehouseId: 'wh-omega', warehouseName: 'Omega Logistics (US East)', sku: 'NEX-NEURO-X1', available: 12, reserved: 2, reorderPoint: 5, binLocation: 'B-04-09' },
  { warehouseId: 'wh-eu', warehouseName: 'EU Central Hub (Frankfurt)', sku: 'NEX-NEURO-X1', available: 5, reserved: 0, reorderPoint: 8, binLocation: 'E-01-11' },
  { warehouseId: 'wh-alpha', warehouseName: 'Alpha Central (US West)', sku: 'NEX-QUANT-CORE', available: 10, reserved: 2, reorderPoint: 4, binLocation: 'A-02-01' },
  { warehouseId: 'wh-omega', warehouseName: 'Omega Logistics (US East)', sku: 'NEX-QUANT-CORE', available: 5, reserved: 0, reorderPoint: 2, binLocation: 'B-01-03' },
  { warehouseId: 'wh-alpha', warehouseName: 'Alpha Central (US West)', sku: 'NEX-KINETIC-POD', available: 5, reserved: 1, reorderPoint: 3, binLocation: 'C-08-02' },
  { warehouseId: 'wh-alpha', warehouseName: 'Alpha Central (US West)', sku: 'NEX-DRONE-SWARM', available: 15, reserved: 2, reorderPoint: 5, binLocation: 'D-03-05' }
];

export const SUPPLIERS: SupplierItem[] = [
  { id: 'sup-1', code: 'SUP-TITAN', name: 'Titanium Synthetics Corp', contactName: 'Helena Vance', email: 'orders@titan-synth.com', phone: '+1 (800) 555-9012', leadTimeDays: 5, rating: 4.95, activeOrders: 3 },
  { id: 'sup-2', code: 'SUP-OPTO', name: 'Opto-Optics Japan Ltd', contactName: 'Kenji Sato', email: 'sales@opto-optics.co.jp', phone: '+81 3 5555 0192', leadTimeDays: 9, rating: 4.88, activeOrders: 1 },
  { id: 'sup-3', code: 'SUP-CRYO', name: 'CryoTech Thermal Systems', contactName: 'Lars Lindqvist', email: 'supply@cryotech.se', phone: '+46 8 123 4567', leadTimeDays: 7, rating: 4.90, activeOrders: 2 }
];

export const CAMPAIGNS: CampaignItem[] = [
  { id: 'camp-1', code: 'NEXUS2026', name: 'Nexus Launch Promo', discountType: 'PERCENTAGE', discountValue: 15, active: true, usageCount: 142, budget: 25000 },
  { id: 'camp-2', code: 'QUANTUM1000', name: 'Quantum Core Rebate', discountType: 'FIXED', discountValue: 500, active: true, usageCount: 28, budget: 50000 },
  { id: 'camp-3', code: 'NEURALVIP', name: 'VIP Bio-Haptics Early Access', discountType: 'PERCENTAGE', discountValue: 20, active: true, usageCount: 89, budget: 15000 }
];
