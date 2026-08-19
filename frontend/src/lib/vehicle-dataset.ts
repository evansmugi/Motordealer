/* AETHEL MOTORS / NEXUS DRIVE — Master Automotive Vehicle Dataset */

export interface VehicleEngine {
  type: string;
  displacementCc: number;
  litres: number;
  cylinders: number;
  configuration: string; // V6, Inline-4, V8, Supercharged, Twin-Turbo, Superconducting Dual-Motor
  aspiration: 'NATURALLY_ASPIRATED' | 'TURBOCHARGED' | 'TWIN_TURBO' | 'SUPERCHARGED' | 'DUAL_ELECTRIC_MOTOR';
  powerHp: number;
  powerKw: number;
  torqueNm: number;
  zeroToHundredKm: number;
  topSpeedKm: number;
}

export interface FuelEnergySpecs {
  fuelType: 'PETROL' | 'DIESEL' | 'HYBRID' | 'PLUG_IN_HYBRID' | 'ELECTRIC' | 'HYDROGEN';
  consumptionL100km: number;
  co2EmissionsGkm: number;
  tankCapacityLiters?: number;
  rangeKm: number;
  batteryCapacityKwh?: number;
  wltpRangeKm?: number;
  maxChargingRateKw?: number;
  chargingTime10To80Min?: number;
}

export interface TransmissionSpecs {
  type: 'AUTOMATIC' | 'MANUAL' | 'CVT' | 'DCT' | 'SINGLE_SPEED_DIRECT';
  gears: number;
  paddleShifters: boolean;
  driveModes: string[];
}

export interface DrivetrainSpecs {
  type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  diffLock: boolean;
  lowRange: boolean;
  terrainModes: string[];
}

export interface DimensionsCapacities {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  groundClearanceMm: number;
  wadingDepthMm?: number;
  kerbWeightKg: number;
  bootCapacityLiters: number;
  seats: number;
  doors: number;
  towingCapacityKg: number;
}

export interface FeatureCategory {
  category: 'LIGHTING' | 'INTERIOR_COMFORT' | 'INFOTAINMENT_AUDIO' | 'ADAS_SAFETY' | 'PERFORMANCE_OFFROAD';
  title: string;
  items: string[];
}

export interface InspectionReport {
  score: number; // e.g. 98 out of 100
  inspectionDate: string;
  inspectorName: string;
  centerLocation: string;
  breakdown: {
    mechanical: 'PASS' | 'ATTENTION' | 'FAIL';
    exteriorBody: 'PASS' | 'ATTENTION' | 'FAIL';
    interiorComfort: 'PASS' | 'ATTENTION' | 'FAIL';
    electricalElectronics: 'PASS' | 'ATTENTION' | 'FAIL';
    suspensionSteering: 'PASS' | 'ATTENTION' | 'FAIL';
    brakesTyres: 'PASS' | 'ATTENTION' | 'FAIL';
  };
  notes: string;
}

export interface VehicleHistory {
  previousOwners: number;
  serviceHistory: 'FULL_DEALER_SERVICE_HISTORY' | 'PARTIAL' | 'NOT_AVAILABLE';
  accidentStatus: 'ACCIDENT_FREE_VERIFIED' | 'MINOR_REPAIR' | 'FRAME_ACCIDENT';
  mileageVerified: boolean;
  odometerKm: number;
  lastServiceDate: string;
  lastServiceKm: number;
  importStatus: 'LOCAL_NEW' | 'LOCAL_USED' | 'DIRECT_JAPAN_IMPORT' | 'DIRECT_UK_IMPORT';
}

export interface VehiclePricing {
  cashPrice: number;
  originalPrice?: number;
  costPrice: number; // For ERP Landed Cost profitability tracking
  minDepositPercent: number;
  estimatedMonthlyPayment: number;
  vatIncluded: boolean;
  dutyPaid: boolean;
}

export interface VehicleItem {
  id: string;
  stockNumber: string;
  vin: string;
  registrationNumber: string;
  make: string;
  model: string;
  generation: string;
  trim: string;
  variant: string;
  year: number;
  registrationYear: number;
  condition: 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED';
  bodyType: 'SUV' | 'SEDAN' | 'HATCHBACK' | 'COUPE' | 'CONVERTIBLE' | 'PICKUP' | 'VAN' | 'COMMERCIAL' | 'EV';
  segment: string;
  colorExterior: string;
  colorInterior: string;
  interiorMaterial: string;
  
  engine: VehicleEngine;
  fuelEnergy: FuelEnergySpecs;
  transmission: TransmissionSpecs;
  drivetrain: DrivetrainSpecs;
  dimensions: DimensionsCapacities;
  features: FeatureCategory[];
  inspection: InspectionReport;
  history: VehicleHistory;
  pricing: VehiclePricing;
  
  availability: 'AVAILABLE' | 'RESERVED' | 'TEST_DRIVE' | 'UNDER_PREPARATION' | 'IN_TRANSIT' | 'SOLD';
  preparationStage?: 'RECEIVED' | 'INSPECTED' | 'RECONDITIONED' | 'PHOTOGRAPHED' | 'PUBLISHED';
  daysInStock: number;
  branchId: string;
  branchName: string;
  
  heroImage: string;
  images: string[];
  frames360: string[];
  badges: string[];
  isFeatured: boolean;
  shortTagline: string;
  overviewDescription: string;
  video_url?: string;
  youtubeUrl?: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  openingHours: string;
  availableVehiclesCount: number;
}

export interface TestDriveBooking {
  id: string;
  bookingRef: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  branchId: string;
  branchName: string;
  preferredDate: string;
  preferredTimeSlot: string;
  driveType: 'SHOWROOM' | 'HOME_DELIVERY';
  salespersonName: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface TradeInValuation {
  id: string;
  valuationRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  make: string;
  model: string;
  year: number;
  mileageKm: number;
  conditionGrade: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR';
  estimatedCreditValue: number;
  targetVehicleId: string;
  status: 'SUBMITTED' | 'VALUATION_OFFERED' | 'INSPECTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface VehicleReservation {
  id: string;
  reservationRef: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  depositAmount: number;
  expiresAt: string;
  status: 'ACTIVE_HOLD' | 'PURCHASE_COMPLETED' | 'EXPIRED' | 'REFUNDED';
  createdAt: string;
}

/* Sample Dealership Branches */
export const BRANCHES: BranchLocation[] = [
  {
    id: 'br-central',
    name: 'Central Executive Showroom',
    address: '404 Automotive Boulevard, Westlands',
    city: 'Nairobi',
    phone: '+254 700 100 200',
    email: 'central@aethelmotors.com',
    openingHours: 'Mon - Sat: 08:00 - 18:00',
    availableVehiclesCount: 18
  },
  {
    id: 'br-hub',
    name: 'Logistics & Import Hub',
    address: 'Gate 4, Mombasa Road Logistics Park',
    city: 'Nairobi',
    phone: '+254 711 300 400',
    email: 'import@aethelmotors.com',
    openingHours: 'Mon - Fri: 08:00 - 17:00',
    availableVehiclesCount: 12
  },
  {
    id: 'br-coastal',
    name: 'Coastal Premium Motors',
    address: 'Nyali Drive, Sector 2',
    city: 'Mombasa',
    phone: '+254 722 500 600',
    email: 'mombasa@aethelmotors.com',
    openingHours: 'Mon - Sat: 08:30 - 17:30',
    availableVehiclesCount: 8
  }
];

/* Master Automotive Vehicle Database */
export const VEHICLES: VehicleItem[] = [
  {
    id: 'veh-001',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    stockNumber: 'NK-2026-901',
    vin: 'JTEPE53J80K049281',
    registrationNumber: 'KDF 890X',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    generation: 'LC250 Series',
    trim: 'First Edition 2.8 D-4D',
    variant: '2.8 Turbo Diesel Auto 4x4',
    year: 2025,
    registrationYear: 2025,
    condition: 'NEW',
    bodyType: 'SUV',
    segment: 'D-Segment Premium Off-Road',
    colorExterior: 'Heritage Sand & Grayscape Two-Tone',
    colorInterior: 'Cognac Saddle Brown',
    interiorMaterial: 'Semi-Aniline Perforated Leather',
    
    engine: {
      type: '2.8L 1GD-FTV Turbocharged Diesel',
      displacementCc: 2755,
      litres: 2.8,
      cylinders: 4,
      configuration: 'Inline 4 Turbo Diesel',
      aspiration: 'TURBOCHARGED',
      powerHp: 204,
      powerKw: 150,
      torqueNm: 500,
      zeroToHundredKm: 9.2,
      topSpeedKm: 180
    },
    fuelEnergy: {
      fuelType: 'DIESEL',
      consumptionL100km: 7.9,
      co2EmissionsGkm: 208,
      tankCapacityLiters: 110,
      rangeKm: 1390
    },
    transmission: {
      type: 'AUTOMATIC',
      gears: 8,
      paddleShifters: true,
      driveModes: ['Eco', 'Comfort', 'Normal', 'Sport', 'Sport+', 'Custom']
    },
    drivetrain: {
      type: '4WD',
      diffLock: true,
      lowRange: true,
      terrainModes: ['Auto', 'Dirt', 'Sand', 'Mud', 'Deep Snow', 'Rock']
    },
    dimensions: {
      lengthMm: 4920,
      widthMm: 1980,
      heightMm: 1870,
      wheelbaseMm: 2850,
      groundClearanceMm: 220,
      wadingDepthMm: 700,
      kerbWeightKg: 2330,
      bootCapacityLiters: 620,
      seats: 7,
      doors: 5,
      towingCapacityKg: 3500
    },
    features: [
      {
        category: 'LIGHTING',
        title: 'Illumination Architecture',
        items: ['Round Heritage LED Headlights', 'Automatic High Beam', 'Sequential LED Indicators', 'Under-Door Courtesy Projection']
      },
      {
        category: 'INTERIOR_COMFORT',
        title: 'Cabin & Climate',
        items: ['Heated & Ventilated Front Seats', 'Tri-Zone Climate Control', 'Cooler Box in Center Console', 'Panoramic Glass Moonroof']
      },
      {
        category: 'INFOTAINMENT_AUDIO',
        title: 'Digital & Audio Telemetry',
        items: ['12.3-inch Toyota Multimedia Touchscreen', 'JBL 14-Speaker Surround Sound', 'Wireless Apple CarPlay & Android Auto', 'Head-Up Display']
      },
      {
        category: 'ADAS_SAFETY',
        title: 'Active Safety & ADAS',
        items: ['Toyota Safety Sense 3.0', 'Adaptive Cruise Control with Stop & Go', '360° Multi-Terrain Monitor Cameras', 'Lane Tracing Assist']
      }
    ],
    inspection: {
      score: 99,
      inspectionDate: '2026-08-15',
      inspectorName: 'Master Tech. Marcus Vance',
      centerLocation: 'Central Diagnostic Center',
      breakdown: {
        mechanical: 'PASS',
        exteriorBody: 'PASS',
        interiorComfort: 'PASS',
        electricalElectronics: 'PASS',
        suspensionSteering: 'PASS',
        brakesTyres: 'PASS'
      },
      notes: '150-point factory fresh inspection verified. Zero defects recorded.'
    },
    history: {
      previousOwners: 0,
      serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
      accidentStatus: 'ACCIDENT_FREE_VERIFIED',
      mileageVerified: true,
      odometerKm: 45,
      lastServiceDate: '2026-08-14',
      lastServiceKm: 10,
      importStatus: 'LOCAL_NEW'
    },
    pricing: {
      cashPrice: 98500,
      originalPrice: 105000,
      costPrice: 79000,
      minDepositPercent: 15,
      estimatedMonthlyPayment: 1480,
      vatIncluded: true,
      dutyPaid: true
    },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 8,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop'
    ],
    badges: ['NEW_ARRIVAL', 'CERTIFIED_PRE_OWNED', 'FEATURED', 'OFFROAD_KING'],
    isFeatured: true,
    shortTagline: 'Next-Gen LC250 First Edition 2.8L Turbo Diesel with 3.5-Ton Tow Capacity.',
    overviewDescription: 'The 2025 Toyota Land Cruiser Prado LC250 combines iconic heritage design with modern twin-stage turbo diesel efficiency, permanent full-time 4WD, dual diff-locks, and luxury 7-seat cabin refinement.'
  },
  {
    id: 'veh-002',
    stockNumber: 'NK-2026-902',
    vin: 'WBA53CE020FP81923',
    registrationNumber: 'KDG 112Z',
    make: 'BMW',
    model: 'M5 Competition',
    generation: 'F90 LCI',
    trim: 'M xDrive 4.4 V8 Twin-Turbo',
    variant: '4.4 V8 BiTurbo Steptronic',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SEDAN',
    segment: 'F-Segment High-Performance Executive',
    colorExterior: 'Frozen Dark Grey Metallic',
    colorInterior: 'Full Merino Leather Silverstone',
    interiorMaterial: 'Nappa Merino Leather with Carbon Trim',
    
    engine: {
      type: '4.4L S63 Twin-Turbocharged V8',
      displacementCc: 4395,
      litres: 4.4,
      cylinders: 8,
      configuration: 'V8 Twin-Turbo',
      aspiration: 'TWIN_TURBO',
      powerHp: 625,
      powerKw: 460,
      torqueNm: 750,
      zeroToHundredKm: 3.3,
      topSpeedKm: 305
    },
    fuelEnergy: {
      fuelType: 'PETROL',
      consumptionL100km: 11.3,
      co2EmissionsGkm: 257,
      tankCapacityLiters: 68,
      rangeKm: 600
    },
    transmission: {
      type: 'AUTOMATIC',
      gears: 8,
      paddleShifters: true,
      driveModes: ['Efficient', 'Sport', 'Sport Plus', 'Track Mode', 'M Dynamic Mode']
    },
    drivetrain: {
      type: 'AWD',
      diffLock: true,
      lowRange: false,
      terrainModes: ['4WD', '4WD Sport', '2WD Rear-Wheel Drive Pure']
    },
    dimensions: {
      lengthMm: 4983,
      widthMm: 1903,
      heightMm: 1469,
      wheelbaseMm: 2982,
      groundClearanceMm: 128,
      kerbWeightKg: 1895,
      bootCapacityLiters: 530,
      seats: 5,
      doors: 4,
      towingCapacityKg: 0
    },
    features: [
      {
        category: 'LIGHTING',
        title: 'Laserlight Matrix',
        items: ['BMW Laserlight Blue Accent Array', 'Adaptive Cornering Shadowlights', 'High-Beam Assistant']
      },
      {
        category: 'PERFORMANCE_OFFROAD',
        title: 'M Performance Dynamics',
        items: ['M Carbon Ceramic Brakes', 'M Carbon Fibre Roof', 'M Sport Exhaust System with Quad Tailpipes', 'Active M Differential']
      },
      {
        category: 'INFOTAINMENT_AUDIO',
        title: 'Cockpit Telemetry',
        items: ['Bowers & Wilkins Diamond Surround Sound (1400W)', 'BMW Live Cockpit Professional', 'M HUD Head-Up Display']
      }
    ],
    inspection: {
      score: 98,
      inspectionDate: '2026-08-10',
      inspectorName: 'Senior Specialist Klaus Weber',
      centerLocation: 'M Performance Tech Hub',
      breakdown: {
        mechanical: 'PASS',
        exteriorBody: 'PASS',
        interiorComfort: 'PASS',
        electricalElectronics: 'PASS',
        suspensionSteering: 'PASS',
        brakesTyres: 'PASS'
      },
      notes: 'Certified M Pre-Owned 150-Point Inspection verified. Carbon ceramics at 95% thickness.'
    },
    history: {
      previousOwners: 1,
      serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
      accidentStatus: 'ACCIDENT_FREE_VERIFIED',
      mileageVerified: true,
      odometerKm: 14200,
      lastServiceDate: '2026-07-20',
      lastServiceKm: 13900,
      importStatus: 'DIRECT_UK_IMPORT'
    },
    pricing: {
      cashPrice: 118000,
      originalPrice: 135000,
      costPrice: 94000,
      minDepositPercent: 20,
      estimatedMonthlyPayment: 1780,
      vatIncluded: true,
      dutyPaid: true
    },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 14,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop'
    ],
    badges: ['CERTIFIED_PRE_OWNED', 'LOW_MILEAGE', 'PRICE_DROP'],
    isFeatured: true,
    shortTagline: '625 HP Twin-Turbo V8 with M xDrive Selectable 2WD Drift Mode.',
    overviewDescription: 'Engineered for absolute road supremacy, this F90 M5 Competition combines supercar 0-100 km/h acceleration in 3.3s with executive saloon luxury and Bower & Wilkins 1400W acoustic precision.'
  },
  {
    id: 'veh-003',
    stockNumber: 'NK-2026-903',
    vin: '5YJSA1E28MF908124',
    registrationNumber: 'KDH 004E',
    make: 'Tesla',
    model: 'Model S Plaid',
    generation: 'Plaid Tri-Motor',
    trim: '1020 HP Carbon Sleeve Dual Rear Motors',
    variant: 'Tri-Motor AWD Plaid',
    year: 2025,
    registrationYear: 2025,
    condition: 'NEW',
    bodyType: 'EV',
    segment: 'Hyper Electric Saloon',
    colorExterior: 'Deep Crimson Multi-Coat',
    colorInterior: 'Ultra White Premium Synth',
    interiorMaterial: 'Carbon Fibre & Vegan Ultra-White Leather',
    
    engine: {
      type: 'Tri-Motor Electric Drive Unit with Carbon-Sleeved Rotors',
      displacementCc: 0,
      litres: 0,
      cylinders: 0,
      configuration: 'Tri-Motor All-Electric',
      aspiration: 'DUAL_ELECTRIC_MOTOR',
      powerHp: 1020,
      powerKw: 760,
      torqueNm: 1420,
      zeroToHundredKm: 2.1,
      topSpeedKm: 322
    },
    fuelEnergy: {
      fuelType: 'ELECTRIC',
      consumptionL100km: 0,
      co2EmissionsGkm: 0,
      rangeKm: 600,
      batteryCapacityKwh: 100,
      wltpRangeKm: 600,
      maxChargingRateKw: 250,
      chargingTime10To80Min: 19
    },
    transmission: {
      type: 'SINGLE_SPEED_DIRECT',
      gears: 1,
      paddleShifters: false,
      driveModes: ['Chill', 'Sport', 'Plaid', 'Drag Strip Mode', 'Track Mode V2']
    },
    drivetrain: {
      type: 'AWD',
      diffLock: false,
      lowRange: false,
      terrainModes: ['Standard AWD', 'Track Torque Vectoring']
    },
    dimensions: {
      lengthMm: 4970,
      widthMm: 1964,
      heightMm: 1445,
      wheelbaseMm: 2960,
      groundClearanceMm: 124,
      kerbWeightKg: 2162,
      bootCapacityLiters: 793,
      seats: 5,
      doors: 5,
      towingCapacityKg: 0
    },
    features: [
      {
        category: 'INFOTAINMENT_AUDIO',
        title: 'Cinematic Gaming & Audio',
        items: ['17-inch Tilt Touchscreen (2200x1300)', '22-Speaker 960W Audio System with Active Noise Canceling', '22 TFLOPS Gaming Computer with Steam Support']
      },
      {
        category: 'ADAS_SAFETY',
        title: 'Full Self-Driving Autopilot',
        items: ['Full Self-Driving Hardware 4.0', 'Autopark & Summon', 'Navigate on Autopilot', 'Sentry Mode 360 Security']
      }
    ],
    inspection: {
      score: 100,
      inspectionDate: '2026-08-17',
      inspectorName: 'EV Diagnostics Lead Dr. Sarah Lin',
      centerLocation: 'Cleanroom EV Diagnostics',
      breakdown: {
        mechanical: 'PASS',
        exteriorBody: 'PASS',
        interiorComfort: 'PASS',
        electricalElectronics: 'PASS',
        suspensionSteering: 'PASS',
        brakesTyres: 'PASS'
      },
      notes: '100 kWh battery health verified at 100% SOH. High-voltage isolation test passed.'
    },
    history: {
      previousOwners: 0,
      serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
      accidentStatus: 'ACCIDENT_FREE_VERIFIED',
      mileageVerified: true,
      odometerKm: 22,
      lastServiceDate: '2026-08-16',
      lastServiceKm: 1,
      importStatus: 'LOCAL_NEW'
    },
    pricing: {
      cashPrice: 129000,
      originalPrice: 140000,
      costPrice: 102000,
      minDepositPercent: 15,
      estimatedMonthlyPayment: 1920,
      vatIncluded: true,
      dutyPaid: true
    },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 5,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop'
    ],
    badges: ['NEW_ARRIVAL', 'HYBRID_EV', 'FEATURED'],
    isFeatured: true,
    shortTagline: '1,020 HP Tri-Motor Rocketing 0-100 km/h in 2.1 Seconds.',
    overviewDescription: 'The world’s fastest-accelerating production saloon. Plaid features carbon-sleeved electric rotors delivering 1,020 horsepower, Drag Strip Mode, and 600km real-world range.'
  },
  {
    id: 'veh-004',
    stockNumber: 'NK-2026-904',
    vin: 'SALWR2SU4NA812904',
    registrationNumber: 'KDF 440P',
    make: 'Range Rover',
    model: 'Autobiography P530',
    generation: 'L460 Series',
    trim: 'SWB 4.4 Twin-Turbo V8',
    variant: '4.4 V8 Twin-Turbo Auto 4WD',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SUV',
    segment: 'Ultra Luxury SUV',
    colorExterior: 'Sunset Gold Satin',
    colorInterior: 'Perino Caraway Semi-Aniline',
    interiorMaterial: 'Caraway Semi-Aniline Leather with Walnut Veneer',
    
    engine: {
      type: '4.4L BMW N63 Twin-Turbocharged V8',
      displacementCc: 4395,
      litres: 4.4,
      cylinders: 8,
      configuration: 'V8 Twin-Turbo',
      aspiration: 'TWIN_TURBO',
      powerHp: 530,
      powerKw: 390,
      torqueNm: 750,
      zeroToHundredKm: 4.6,
      topSpeedKm: 250
    },
    fuelEnergy: {
      fuelType: 'PETROL',
      consumptionL100km: 11.8,
      co2EmissionsGkm: 270,
      tankCapacityLiters: 90,
      rangeKm: 760
    },
    transmission: {
      type: 'AUTOMATIC',
      gears: 8,
      paddleShifters: true,
      driveModes: ['Eco', 'Comfort', 'Grass/Gravel/Snow', 'Mud/Ruts', 'Sand', 'Rock Crawl', 'Wade']
    },
    drivetrain: {
      type: 'AWD',
      diffLock: true,
      lowRange: true,
      terrainModes: ['Terrain Response 2 Auto', 'All-Terrain Progress Control']
    },
    dimensions: {
      lengthMm: 5052,
      widthMm: 2047,
      heightMm: 1870,
      wheelbaseMm: 2997,
      groundClearanceMm: 295,
      wadingDepthMm: 900,
      kerbWeightKg: 2585,
      bootCapacityLiters: 818,
      seats: 5,
      doors: 5,
      towingCapacityKg: 3500
    },
    features: [
      {
        category: 'INTERIOR_COMFORT',
        title: 'Executive Class Rear Seating',
        items: ['Hot Stone Massage Executive Seats', 'Meridian Signature Sound 1600W with Headrest Speakers', 'Power Deployable Club Table']
      },
      {
        category: 'PERFORMANCE_OFFROAD',
        title: 'Chassis Telemetry',
        items: ['Electronic Air Suspension with Dynamic Response Pro', 'All-Wheel Steering', 'Active Locking Rear Differential']
      }
    ],
    inspection: {
      score: 97,
      inspectionDate: '2026-08-11',
      inspectorName: 'Cert. Inspector James Sterling',
      centerLocation: 'Luxury SUV Diagnostic Hub',
      breakdown: {
        mechanical: 'PASS',
        exteriorBody: 'PASS',
        interiorComfort: 'PASS',
        electricalElectronics: 'PASS',
        suspensionSteering: 'PASS',
        brakesTyres: 'PASS'
      },
      notes: 'Full air suspension height calibration complete. Zero diagnostic fault codes.'
    },
    history: {
      previousOwners: 1,
      serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
      accidentStatus: 'ACCIDENT_FREE_VERIFIED',
      mileageVerified: true,
      odometerKm: 18400,
      lastServiceDate: '2026-07-10',
      lastServiceKm: 18000,
      importStatus: 'DIRECT_UK_IMPORT'
    },
    pricing: {
      cashPrice: 145000,
      originalPrice: 168000,
      costPrice: 119000,
      minDepositPercent: 20,
      estimatedMonthlyPayment: 2150,
      vatIncluded: true,
      dutyPaid: true
    },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 22,
    branchId: 'br-hub',
    branchName: 'Logistics & Import Hub',
    heroImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1200&auto=format&fit=crop'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop'
    ],
    badges: ['CERTIFIED_PRE_OWNED', 'PRICE_DROP'],
    isFeatured: false,
    shortTagline: 'L460 Autobiography V8 Twin-Turbo with 900mm Wading & All-Wheel Steering.',
    overviewDescription: 'The pinnacle of luxury engineering. L460 Range Rover Autobiography combines 530 HP Twin-Turbo V8 power with 900mm wading depth, active noise cancellation, and rear executive lounge seats.'
  },
  {
    id: 'veh-005',
    stockNumber: 'NK-2026-905',
    vin: 'MHFRE36G004918231',
    registrationNumber: 'KDE 303Y',
    make: 'Ford',
    model: 'Ranger Raptor',
    generation: 'Next-Gen V6 Twin-Turbo',
    trim: '3.0L EcoBoost V6 10-Speed',
    variant: '3.0 V6 EcoBoost 4x4 Double Cab',
    year: 2025,
    registrationYear: 2025,
    condition: 'NEW',
    bodyType: 'PICKUP',
    segment: 'High-Performance Off-Road Pickup',
    colorExterior: 'Code Orange Metallic',
    colorInterior: 'Ebony Leather with Orange Stitching',
    interiorMaterial: 'Suede & Leather Sports Seats',
    
    engine: {
      type: '3.0L Nano EcoBoost Twin-Turbo V6',
      displacementCc: 2956,
      litres: 3.0,
      cylinders: 6,
      configuration: 'V6 Twin-Turbo',
      aspiration: 'TWIN_TURBO',
      powerHp: 392,
      powerKw: 292,
      torqueNm: 583,
      zeroToHundredKm: 6.0,
      topSpeedKm: 180
    },
    fuelEnergy: {
      fuelType: 'PETROL',
      consumptionL100km: 11.5,
      co2EmissionsGkm: 262,
      tankCapacityLiters: 80,
      rangeKm: 690
    },
    transmission: {
      type: 'AUTOMATIC',
      gears: 10,
      paddleShifters: true,
      driveModes: ['Normal', 'Sport', 'Slippery', 'Mud/Ruts', 'Sand', 'Baja Mode', 'Rock Crawl']
    },
    drivetrain: {
      type: '4WD',
      diffLock: true,
      lowRange: true,
      terrainModes: ['Front & Rear Diff Locks', 'Baja Anti-Lag Engine Management']
    },
    dimensions: {
      lengthMm: 5360,
      widthMm: 2028,
      heightMm: 1926,
      wheelbaseMm: 3270,
      groundClearanceMm: 272,
      wadingDepthMm: 850,
      kerbWeightKg: 2475,
      bootCapacityLiters: 1200,
      seats: 5,
      doors: 4,
      towingCapacityKg: 2500
    },
    features: [
      {
        category: 'PERFORMANCE_OFFROAD',
        title: 'FOX Live Valve Suspension',
        items: ['FOX 2.5-inch Live Valve Internal Bypass Dampers', 'Baja Race Mode with Anti-Lag', 'Front & Rear Locking Differentials']
      },
      {
        category: 'INTERIOR_COMFORT',
        title: 'Cockpit & Tech',
        items: ['12-inch Vertical SYNC 4A Touchscreen', 'F-22 Fighter Jet Inspired Sports Seats', 'Bang & Olufsen 10-Speaker Audio']
      }
    ],
    inspection: {
      score: 99,
      inspectionDate: '2026-08-16',
      inspectorName: 'Off-Road Specialist David Omondi',
      centerLocation: 'Logistics Prep Center',
      breakdown: {
        mechanical: 'PASS',
        exteriorBody: 'PASS',
        interiorComfort: 'PASS',
        electricalElectronics: 'PASS',
        suspensionSteering: 'PASS',
        brakesTyres: 'PASS'
      },
      notes: 'FOX 2.5 Live Valve dampers tested on dynamic dyno. Pass.'
    },
    history: {
      previousOwners: 0,
      serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
      accidentStatus: 'ACCIDENT_FREE_VERIFIED',
      mileageVerified: true,
      odometerKm: 90,
      lastServiceDate: '2026-08-15',
      lastServiceKm: 10,
      importStatus: 'LOCAL_NEW'
    },
    pricing: {
      cashPrice: 79500,
      originalPrice: 84000,
      costPrice: 62000,
      minDepositPercent: 15,
      estimatedMonthlyPayment: 1190,
      vatIncluded: true,
      dutyPaid: true
    },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 6,
    branchId: 'br-coastal',
    branchName: 'Coastal Premium Motors',
    heroImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop'
    ],
    badges: ['NEW_ARRIVAL', 'OFFROAD_KING', 'FEATURED'],
    isFeatured: true,
    shortTagline: '392 HP Twin-Turbo V6 EcoBoost with FOX 2.5 Live Valve Dampers.',
    overviewDescription: 'Built for high-speed desert endurance and extreme off-road terrain. The Next-Gen Ranger Raptor features a 392 HP Twin-Turbo V6, Baja Mode anti-lag, and active FOX internal bypass dampers.'
  },
  {
    id: 'veh-006',
    stockNumber: 'NK-2026-906',
    vin: 'W1K2231791A098231',
    registrationNumber: 'KDF 500X',
    make: 'Mercedes-Benz',
    model: 'AMG G 63',
    generation: 'W463A Series',
    trim: '4.0L V8 Biturbo AMG',
    variant: '4.0 V8 Biturbo SPEEDSHIFT 9G',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SUV',
    segment: 'Ultra Luxury Off-Road Performance',
    colorExterior: 'G Manufaktur Night Black Magno',
    colorInterior: 'Bengal Red Nappa Leather',
    interiorMaterial: 'Exclusive Nappa Leather with AMG Carbon Fiber',
    engine: {
      type: '4.0L M177 Biturbo V8',
      displacementCc: 3982,
      litres: 4.0,
      cylinders: 8,
      configuration: 'V8 Biturbo',
      aspiration: 'TWIN_TURBO',
      powerHp: 585,
      powerKw: 430,
      torqueNm: 850,
      zeroToHundredKm: 4.5,
      topSpeedKm: 240
    },
    fuelEnergy: {
      fuelType: 'PETROL',
      consumptionL100km: 13.1,
      co2EmissionsGkm: 299,
      tankCapacityLiters: 100,
      rangeKm: 650
    },
    transmission: {
      type: 'AUTOMATIC',
      gears: 9,
      paddleShifters: true,
      driveModes: ['Slippery', 'Comfort', 'Sport', 'Sport+', 'Individual', 'Trail', 'Rock', 'Sand']
    },
    drivetrain: {
      type: '4WD',
      diffLock: true,
      lowRange: true,
      terrainModes: ['Front, Center & Rear 100% Differential Locks']
    },
    dimensions: {
      lengthMm: 4873,
      widthMm: 1984,
      heightMm: 1966,
      wheelbaseMm: 2890,
      groundClearanceMm: 241,
      kerbWeightKg: 2560,
      bootCapacityLiters: 667,
      seats: 5,
      doors: 5,
      towingCapacityKg: 3500
    },
    features: [
      {
        category: 'PERFORMANCE_OFFROAD',
        title: 'AMG Performance Package',
        items: ['AMG Performance Exhaust with Side Pipes', 'AMG RIDE CONTROL Suspension', 'AMG High-Performance Braking']
      }
    ],
    inspection: {
      score: 99,
      inspectionDate: '2026-08-14',
      inspectorName: 'AMG Master Technician',
      centerLocation: 'Nairobi HQ Complex',
      breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' },
      notes: '150-Point AMG Inspection certified.'
    },
    history: {
      previousOwners: 1,
      serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
      accidentStatus: 'ACCIDENT_FREE_VERIFIED',
      mileageVerified: true,
      odometerKm: 4500,
      lastServiceDate: '2026-07-30',
      lastServiceKm: 4200,
      importStatus: 'DIRECT_UK_IMPORT'
    },
    pricing: {
      cashPrice: 34500000,
      originalPrice: 37000000,
      costPrice: 28000000,
      minDepositPercent: 20,
      estimatedMonthlyPayment: 490000,
      vatIncluded: true,
      dutyPaid: true
    },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 10,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop'],
    frames360: [],
    badges: ['FEATURED', 'CERTIFIED_PRE_OWNED'],
    isFeatured: true,
    shortTagline: '585 HP AMG Biturbo V8 with Side Exhausts & Triple Diff Locks.',
    overviewDescription: 'The legendary Geländewagen AMG G 63 combines handcrafted 585 HP V8 power with iconic boxy styling, side-pipe exhaust roar, and triple differential locks.'
  },
  {
    id: 'veh-007',
    stockNumber: 'NK-2026-907',
    vin: 'WP1AA2AY5PDA09124',
    registrationNumber: 'KDG 090Y',
    make: 'Porsche',
    model: 'Cayenne Turbo E-Hybrid',
    generation: 'E3 Facelift',
    trim: '4.0 V8 Turbo E-Hybrid 739 HP',
    variant: 'Tiptronic S 8-Speed AWD',
    year: 2024,
    registrationYear: 2024,
    condition: 'NEW',
    bodyType: 'SUV',
    segment: 'High Performance Hybrid SUV',
    colorExterior: 'Carrara White Metallic',
    colorInterior: 'Black Leather',
    interiorMaterial: 'Smooth-Finish Leather Interior',
    engine: { type: '4.0L V8 Turbo + Electric Motor', displacementCc: 3996, litres: 4.0, cylinders: 8, configuration: 'V8 PHEV', aspiration: 'TWIN_TURBO', powerHp: 739, powerKw: 544, torqueNm: 950, zeroToHundredKm: 3.7, topSpeedKm: 295 },
    fuelEnergy: { fuelType: 'PLUG_IN_HYBRID', consumptionL100km: 2.0, co2EmissionsGkm: 45, rangeKm: 82, batteryCapacityKwh: 25.9 },
    transmission: { type: 'AUTOMATIC', gears: 8, paddleShifters: true, driveModes: ['E-Power', 'Hybrid Auto', 'SPORT', 'SPORT PLUS'] },
    drivetrain: { type: 'AWD', diffLock: true, lowRange: false, terrainModes: ['Onroad', 'Gravel', 'Mud', 'Sand', 'Rocks'] },
    dimensions: { lengthMm: 4930, widthMm: 1983, heightMm: 1685, wheelbaseMm: 2895, groundClearanceMm: 216, kerbWeightKg: 2570, bootCapacityLiters: 621, seats: 5, doors: 5, towingCapacityKg: 3000 },
    features: [{ category: 'INTERIOR_COMFORT', title: 'Porsche Tech', items: ['HD-Matrix LED Headlights', 'Adaptive Air Suspension', 'Porsche Dynamic Chassis Control'] }],
    inspection: { score: 100, inspectionDate: '2026-08-16', inspectorName: 'Porsche Master Tech', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'Factory brand new condition verified.' },
    history: { previousOwners: 0, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 3200, lastServiceDate: '2026-08-10', lastServiceKm: 3200, importStatus: 'LOCAL_NEW' },
    pricing: { cashPrice: 28000000, originalPrice: 30000000, costPrice: 22000000, minDepositPercent: 20, estimatedMonthlyPayment: 400000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 4,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FEATURED', 'NEW_ARRIVAL'],
    isFeatured: true,
    shortTagline: '739 HP V8 Turbo E-Hybrid with 3.7s 0-100 km/h Launch Control.',
    overviewDescription: 'The most powerful Cayenne ever built. Combining 739 HP system power with Porsche active suspension management and 82km zero-emissions electric range.'
  },
  {
    id: 'veh-008',
    stockNumber: 'NK-2026-908',
    vin: 'JTJHY7AX8N4018231',
    registrationNumber: 'KDF 770Z',
    make: 'Lexus',
    model: 'LX 600 Ultra Luxury',
    generation: 'J300 Series',
    trim: '3.5L V6 Twin-Turbo 409 HP',
    variant: 'Direct Shift 10-Speed Automatic',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SUV',
    segment: 'Flagship Luxury SUV',
    colorExterior: 'Manganese Luster',
    colorInterior: 'Sunflare Orange Leather',
    interiorMaterial: 'Semi-Aniline Leather with Artwood Trim',
    engine: { type: '3.5L Twin-Turbo V6', displacementCc: 3445, litres: 3.5, cylinders: 6, configuration: 'V6 Twin-Turbo', aspiration: 'TWIN_TURBO', powerHp: 409, powerKw: 305, torqueNm: 650, zeroToHundredKm: 6.9, topSpeedKm: 210 },
    fuelEnergy: { fuelType: 'PETROL', consumptionL100km: 11.0, co2EmissionsGkm: 260, rangeKm: 700 },
    transmission: { type: 'AUTOMATIC', gears: 10, paddleShifters: true, driveModes: ['Eco', 'Comfort', 'Normal', 'Sport S', 'Sport S+', 'Custom'] },
    drivetrain: { type: '4WD', diffLock: true, lowRange: true, terrainModes: ['Multi-Terrain Select Auto'] },
    dimensions: { lengthMm: 5095, widthMm: 1990, heightMm: 1885, wheelbaseMm: 2850, groundClearanceMm: 225, kerbWeightKg: 2660, bootCapacityLiters: 700, seats: 4, doors: 5, towingCapacityKg: 3500 },
    features: [{ category: 'INTERIOR_COMFORT', title: 'Ultra Luxury 4-Seat Executive Suite', items: ['Rear Ottoman Seat with 48° Recline', 'Mark Levinson 25-Speaker Reference Audio'] }],
    inspection: { score: 99, inspectionDate: '2026-08-12', inspectorName: 'Lexus Master Tech', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'Ultra Luxury 4-seat package verified.' },
    history: { previousOwners: 1, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 6800, lastServiceDate: '2026-07-25', lastServiceKm: 6500, importStatus: 'DIRECT_UK_IMPORT' },
    pricing: { cashPrice: 29500000, originalPrice: 32000000, costPrice: 24000000, minDepositPercent: 20, estimatedMonthlyPayment: 420000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 7,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FEATURED', 'CERTIFIED_PRE_OWNED'],
    isFeatured: true,
    shortTagline: '409 HP Twin-Turbo V6 with 4-Seat Rear Ottoman Executive Lounge.',
    overviewDescription: 'The pinnacle of Japanese luxury craftsmanship. The 4-seat Ultra Luxury LX 600 features rear reclining ottoman massage seating, Mark Levinson 25-speaker audio, and GA-F body-on-frame strength.'
  },
  {
    id: 'veh-009',
    stockNumber: 'NK-2026-909',
    vin: 'SALWR2SU9PA098123',
    registrationNumber: 'KDG 110X',
    make: 'Land Rover',
    model: 'Defender 110 V8',
    generation: 'L663 Series',
    trim: '5.0L Supercharged V8 525 HP',
    variant: '8-Speed Automatic 4WD',
    year: 2024,
    registrationYear: 2024,
    condition: 'NEW',
    bodyType: 'SUV',
    segment: 'High Performance Off-Road',
    colorExterior: 'Carpathian Grey Satin',
    colorInterior: 'Ebony Windsor Leather',
    interiorMaterial: 'Windsor Leather & Dinamica Suedecloth',
    engine: { type: '5.0L Supercharged V8', displacementCc: 4999, litres: 5.0, cylinders: 8, configuration: 'V8 Supercharged', aspiration: 'SUPERCHARGED', powerHp: 525, powerKw: 386, torqueNm: 625, zeroToHundredKm: 5.2, topSpeedKm: 240 },
    fuelEnergy: { fuelType: 'PETROL', consumptionL100km: 12.8, co2EmissionsGkm: 290, rangeKm: 650 },
    transmission: { type: 'AUTOMATIC', gears: 8, paddleShifters: true, driveModes: ['Dynamic', 'Eco', 'Comfort', 'Grass/Gravel/Snow', 'Mud/Ruts', 'Sand', 'Rock Crawl', 'Wade'] },
    drivetrain: { type: '4WD', diffLock: true, lowRange: true, terrainModes: ['Terrain Response 2 with Dynamic Mode'] },
    dimensions: { lengthMm: 5018, widthMm: 2008, heightMm: 1967, wheelbaseMm: 3022, groundClearanceMm: 291, wadingDepthMm: 900, kerbWeightKg: 2603, bootCapacityLiters: 786, seats: 5, doors: 5, towingCapacityKg: 3500 },
    features: [{ category: 'PERFORMANCE_OFFROAD', title: 'Defender V8 Spec', items: ['22-inch Gloss Black Alloy Wheels', 'Quad Exhaust Outlets', 'Meridian Surround Sound 700W'] }],
    inspection: { score: 100, inspectionDate: '2026-08-15', inspectorName: 'JLR Master Inspector', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'Supercharged V8 factory inspection verified.' },
    history: { previousOwners: 0, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 500, lastServiceDate: '2026-08-14', lastServiceKm: 500, importStatus: 'LOCAL_NEW' },
    pricing: { cashPrice: 21500000, originalPrice: 23500000, costPrice: 17500000, minDepositPercent: 20, estimatedMonthlyPayment: 310000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 5,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FOR_SALE', 'NEW_ARRIVAL'],
    isFeatured: false,
    shortTagline: '525 HP Supercharged V8 with Quad Tailpipes & 900mm Wading Depth.',
    overviewDescription: 'The ultimate performance 4x4. Featuring Land Rover’s 525 HP 5.0L Supercharged V8, bespoke chassis tuning, electronic active rear differential, and quad exhaust acoustic rumble.'
  },
  {
    id: 'veh-010',
    stockNumber: 'NK-2026-910',
    vin: 'W1K2231781A081231',
    registrationNumber: 'KDG 001X',
    make: 'Mercedes-Benz',
    model: 'S 580 4MATIC',
    generation: 'W223 Series',
    trim: '4.0L V8 Biturbo Mild Hybrid 496 HP',
    variant: '9G-TRONIC Automatic AWD',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SEDAN',
    segment: 'Executive Luxury Flagship',
    colorExterior: 'Obsidian Black Metallic',
    colorInterior: 'Exclusive Black Nappa Leather',
    interiorMaterial: 'Exclusive Nappa Leather with Piano Black Trim',
    engine: { type: '4.0L V8 Biturbo + EQ Boost', displacementCc: 3982, litres: 4.0, cylinders: 8, configuration: 'V8 Biturbo', aspiration: 'TWIN_TURBO', powerHp: 496, powerKw: 370, torqueNm: 700, zeroToHundredKm: 4.4, topSpeedKm: 250 },
    fuelEnergy: { fuelType: 'PETROL', consumptionL100km: 9.8, co2EmissionsGkm: 220, rangeKm: 780 },
    transmission: { type: 'AUTOMATIC', gears: 9, paddleShifters: true, driveModes: ['Eco', 'Comfort', 'Sport', 'Sport+', 'Individual'] },
    drivetrain: { type: 'AWD', diffLock: false, lowRange: false, terrainModes: ['4MATIC All-Wheel Drive'] },
    dimensions: { lengthMm: 5289, widthMm: 1954, heightMm: 1503, wheelbaseMm: 3216, groundClearanceMm: 130, kerbWeightKg: 2065, bootCapacityLiters: 550, seats: 5, doors: 4, towingCapacityKg: 2100 },
    features: [{ category: 'INTERIOR_COMFORT', title: 'First-Class Rear Suite', items: ['Burmester 4D Surround Sound 1750W', 'Digital Light 1.3M Micro-Mirrors', 'MBUX Augmented Reality HUD'] }],
    inspection: { score: 98, inspectionDate: '2026-08-10', inspectorName: 'Mercedes Master Inspector', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'Digital Light micro-mirror calibration verified.' },
    history: { previousOwners: 1, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 8400, lastServiceDate: '2026-07-15', lastServiceKm: 8000, importStatus: 'DIRECT_UK_IMPORT' },
    pricing: { cashPrice: 24500000, originalPrice: 27000000, costPrice: 19500000, minDepositPercent: 20, estimatedMonthlyPayment: 350000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 12,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FOR_SALE', 'CERTIFIED_PRE_OWNED'],
    isFeatured: false,
    shortTagline: '496 HP Biturbo V8 Mild-Hybrid with Burmester 4D Audio & Rear Steering.',
    overviewDescription: 'The world benchmark for executive luxury. W223 S 580 4MATIC features 496 HP Biturbo V8 power, Burmester 4D sound, 10° rear-axle steering, and Digital Light 1.3M micro-mirrors.'
  },
  {
    id: 'veh-011',
    stockNumber: 'NK-2026-911',
    vin: 'JTJHY7AX7N4091241',
    registrationNumber: 'KDF 909A',
    make: 'Toyota',
    model: 'Land Cruiser 300 VXR',
    generation: 'LC300 Series',
    trim: '3.3L Twin-Turbo V6 Diesel 304 HP',
    variant: 'Direct Shift 10-Speed Automatic 4WD',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SUV',
    segment: 'Full Size Off-Road Flagship',
    colorExterior: 'Precious White Pearl',
    colorInterior: 'Neutral Beige Leather',
    interiorMaterial: 'Smooth Leather with Woodgrain Accents',
    engine: { type: '3.3L F33A-FTV Twin-Turbo V6 Diesel', displacementCc: 3346, litres: 3.3, cylinders: 6, configuration: 'V6 Twin-Turbo Diesel', aspiration: 'TWIN_TURBO', powerHp: 304, powerKw: 225, torqueNm: 700, zeroToHundredKm: 6.7, topSpeedKm: 210 },
    fuelEnergy: { fuelType: 'DIESEL', consumptionL100km: 8.9, co2EmissionsGkm: 235, rangeKm: 1200 },
    transmission: { type: 'AUTOMATIC', gears: 10, paddleShifters: true, driveModes: ['Eco', 'Comfort', 'Normal', 'Sport', 'Sport+', 'Custom'] },
    drivetrain: { type: '4WD', diffLock: true, lowRange: true, terrainModes: ['E-KDSS Electronic Kinetic Dynamic Suspension'] },
    dimensions: { lengthMm: 4985, widthMm: 1980, heightMm: 1945, wheelbaseMm: 2850, groundClearanceMm: 230, kerbWeightKg: 2610, bootCapacityLiters: 700, seats: 7, doors: 5, towingCapacityKg: 3500 },
    features: [{ category: 'PERFORMANCE_OFFROAD', title: 'LC300 VXR Package', items: ['E-KDSS Electronic Kinetic Suspension', 'JBL 14-Speaker Audio', 'Rear Seat Entertainment Screens'] }],
    inspection: { score: 99, inspectionDate: '2026-08-11', inspectorName: 'Toyota Senior Inspector', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'E-KDSS hydraulic suspension certified.' },
    history: { previousOwners: 1, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 9100, lastServiceDate: '2026-07-28', lastServiceKm: 8800, importStatus: 'DIRECT_JAPAN_IMPORT' },
    pricing: { cashPrice: 22000000, originalPrice: 24000000, costPrice: 18000000, minDepositPercent: 20, estimatedMonthlyPayment: 315000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 9,
    branchId: 'br-hub',
    branchName: 'Logistics & Import Hub',
    heroImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FOR_SALE', 'CERTIFIED_PRE_OWNED'],
    isFeatured: false,
    shortTagline: '304 HP 700Nm Twin-Turbo Diesel V6 with E-KDSS Kinetic Suspension.',
    overviewDescription: 'The flagship Land Cruiser 300 VXR combines 700Nm twin-turbo V6 diesel torque with E-KDSS suspension stabilization, JBL 14-speaker sound, and full 7-seat versatility.'
  },
  {
    id: 'veh-012',
    stockNumber: 'NK-2026-912',
    vin: 'WAUZZZF27PA018231',
    registrationNumber: 'KDF 880V',
    make: 'Audi',
    model: 'RS Q8 Performance',
    generation: '4M Series',
    trim: '4.0L TFSI Twin-Turbo V8 600 HP',
    variant: '8-Speed tiptronic quattro',
    year: 2024,
    registrationYear: 2024,
    condition: 'NEW',
    bodyType: 'SUV',
    segment: 'High Performance Super SUV',
    colorExterior: 'Nardo Grey',
    colorInterior: 'Black Valcona Leather with Honeycomb Stitching',
    interiorMaterial: 'Valcona Leather & Alcantara',
    engine: { type: '4.0L TFSI Twin-Turbo V8', displacementCc: 3996, litres: 4.0, cylinders: 8, configuration: 'V8 Twin-Turbo', aspiration: 'TWIN_TURBO', powerHp: 600, powerKw: 441, torqueNm: 800, zeroToHundredKm: 3.8, topSpeedKm: 305 },
    fuelEnergy: { fuelType: 'PETROL', consumptionL100km: 12.1, co2EmissionsGkm: 276, rangeKm: 680 },
    transmission: { type: 'AUTOMATIC', gears: 8, paddleShifters: true, driveModes: ['Comfort', 'Auto', 'Dynamic', 'RS1', 'RS2', 'Allroad', 'Offroad'] },
    drivetrain: { type: 'AWD', diffLock: true, lowRange: false, terrainModes: ['quattro Permanent All-Wheel Drive with Sport Differential'] },
    dimensions: { lengthMm: 5012, widthMm: 1998, heightMm: 1694, wheelbaseMm: 2998, groundClearanceMm: 210, kerbWeightKg: 2315, bootCapacityLiters: 605, seats: 5, doors: 5, towingCapacityKg: 3500 },
    features: [{ category: 'PERFORMANCE_OFFROAD', title: 'RS Performance Package', items: ['RS Carbon Ceramic Brakes', 'RS Sport Exhaust System', 'Electromechanical Active Roll Stabilization'] }],
    inspection: { score: 100, inspectionDate: '2026-08-16', inspectorName: 'Audi Sport Inspector', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'Nürburgring lap record heritage certified.' },
    history: { previousOwners: 0, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 350, lastServiceDate: '2026-08-15', lastServiceKm: 350, importStatus: 'LOCAL_NEW' },
    pricing: { cashPrice: 26000000, originalPrice: 28500000, costPrice: 21000000, minDepositPercent: 20, estimatedMonthlyPayment: 375000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 4,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FOR_SALE', 'NEW_ARRIVAL'],
    isFeatured: false,
    shortTagline: '600 HP TFSI Twin-Turbo V8 with RS Ceramic Brakes & Active Roll Stabilization.',
    overviewDescription: 'The Nürburgring king of Super SUVs. The RS Q8 packs a 600 HP TFSI Twin-Turbo V8, quattro permanent all-wheel drive with sport differential, and carbon ceramic brakes.'
  },
  {
    id: 'veh-013',
    stockNumber: 'NK-2026-913',
    vin: 'JN8AY2NC0PW019281',
    registrationNumber: 'KDF 404P',
    make: 'Nissan',
    model: 'Patrol Nismo V8',
    generation: 'Y62 Series',
    trim: '5.6L Takumi V8 428 HP',
    variant: '7-Speed Automatic 4WD',
    year: 2023,
    registrationYear: 2023,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SUV',
    segment: 'High Performance Full Size SUV',
    colorExterior: 'White Pearl Nismo Red Accent',
    colorInterior: 'Black & Red Alcantara',
    interiorMaterial: 'Takumi Craftsmanship Leather & Alcantara',
    engine: { type: '5.6L VK56VD Takumi V8', displacementCc: 5552, litres: 5.6, cylinders: 8, configuration: 'V8 Naturally Aspirated', aspiration: 'NATURALLY_ASPIRATED', powerHp: 428, powerKw: 319, torqueNm: 560, zeroToHundredKm: 6.2, topSpeedKm: 210 },
    fuelEnergy: { fuelType: 'PETROL', consumptionL100km: 14.5, co2EmissionsGkm: 330, rangeKm: 900, tankCapacityLiters: 140 },
    transmission: { type: 'AUTOMATIC', gears: 7, paddleShifters: true, driveModes: ['Sand', 'On-Road', 'Rock', 'Snow'] },
    drivetrain: { type: '4WD', diffLock: true, lowRange: true, terrainModes: ['HBMC Hydraulic Body Motion Control'] },
    dimensions: { lengthMm: 5315, widthMm: 2035, heightMm: 1940, wheelbaseMm: 3075, groundClearanceMm: 275, kerbWeightKg: 2750, bootCapacityLiters: 550, seats: 7, doors: 5, towingCapacityKg: 3500 },
    features: [{ category: 'PERFORMANCE_OFFROAD', title: 'Nismo Tuned Aerodynamics & Dampers', items: ['Bilstein High-Performance Shock Absorbers', 'Nismo 22-inch Rays Forged Alloy Wheels'] }],
    inspection: { score: 98, inspectionDate: '2026-08-09', inspectorName: 'Nissan Nismo Tech', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'Takumi V8 engine tune verified.' },
    history: { previousOwners: 1, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 15400, lastServiceDate: '2026-07-20', lastServiceKm: 15000, importStatus: 'DIRECT_JAPAN_IMPORT' },
    pricing: { cashPrice: 18500000, originalPrice: 21000000, costPrice: 15000000, minDepositPercent: 20, estimatedMonthlyPayment: 265000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 15,
    branchId: 'br-hub',
    branchName: 'Logistics & Import Hub',
    heroImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FOR_SALE', 'CERTIFIED_PRE_OWNED'],
    isFeatured: false,
    shortTagline: '428 HP Takumi Tuned 5.6L V8 with Bilstein Dampers & 140L Fuel Tank.',
    overviewDescription: 'Handcrafted by Nissan Takumi master engineers. The Patrol Nismo features a 428 HP 5.6L naturally aspirated V8, Bilstein suspension, and 140L dual fuel capacity.'
  },
  {
    id: 'veh-014',
    stockNumber: 'NK-2026-914',
    vin: '1GYSKC439PR019281',
    registrationNumber: 'KDF 007S',
    make: 'Cadillac',
    model: 'Escalade ESV Sport Platinum',
    generation: '5th Gen ESV',
    trim: '6.2L V8 EcoTec3 420 HP',
    variant: '10-Speed Automatic 4WD',
    year: 2024,
    registrationYear: 2024,
    condition: 'CERTIFIED_PRE_OWNED',
    bodyType: 'SUV',
    segment: 'Extended Full Size Luxury SUV',
    colorExterior: 'Black Raven',
    colorInterior: 'Jet Black Semi-Aniline Leather',
    interiorMaterial: 'Full Semi-Aniline Leather with Auburn Accents',
    engine: { type: '6.2L L87 EcoTec3 V8', displacementCc: 6162, litres: 6.2, cylinders: 8, configuration: 'V8 Naturally Aspirated', aspiration: 'NATURALLY_ASPIRATED', powerHp: 420, powerKw: 313, torqueNm: 623, zeroToHundredKm: 5.9, topSpeedKm: 210 },
    fuelEnergy: { fuelType: 'PETROL', consumptionL100km: 14.7, co2EmissionsGkm: 340, rangeKm: 850, tankCapacityLiters: 107 },
    transmission: { type: 'AUTOMATIC', gears: 10, paddleShifters: true, driveModes: ['Tour', 'Sport', 'Off-Road', 'Tow/Haul'] },
    drivetrain: { type: '4WD', diffLock: true, lowRange: true, terrainModes: ['Electronic Limited Slip Differential eLSD'] },
    dimensions: { lengthMm: 5766, widthMm: 2059, heightMm: 1942, wheelbaseMm: 3407, groundClearanceMm: 203, kerbWeightKg: 2790, bootCapacityLiters: 1175, seats: 7, doors: 5, towingCapacityKg: 3600 },
    features: [{ category: 'INFOTAINMENT_AUDIO', title: 'Curved 38-inch OLED Display', items: ['38-inch Curved OLED Screen (2x Pixel Density of 4K)', 'AKG Studio Reference 36-Speaker 3D Audio', 'Super Cruise Hands-Free Driving'] }],
    inspection: { score: 98, inspectionDate: '2026-08-08', inspectorName: 'Cadillac Master Tech', centerLocation: 'Nairobi HQ', breakdown: { mechanical: 'PASS', exteriorBody: 'PASS', interiorComfort: 'PASS', electricalElectronics: 'PASS', suspensionSteering: 'PASS', brakesTyres: 'PASS' }, notes: 'AKG 36-speaker system and 38-inch OLED display certified.' },
    history: { previousOwners: 1, serviceHistory: 'FULL_DEALER_SERVICE_HISTORY', accidentStatus: 'ACCIDENT_FREE_VERIFIED', mileageVerified: true, odometerKm: 7200, lastServiceDate: '2026-07-22', lastServiceKm: 7000, importStatus: 'DIRECT_UK_IMPORT' },
    pricing: { cashPrice: 31000000, originalPrice: 34000000, costPrice: 25000000, minDepositPercent: 20, estimatedMonthlyPayment: 440000, vatIncluded: true, dutyPaid: true },
    availability: 'AVAILABLE',
    preparationStage: 'PUBLISHED',
    daysInStock: 11,
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop'],
    frames360: [],
    badges: ['FOR_SALE', 'CERTIFIED_PRE_OWNED'],
    isFeatured: false,
    shortTagline: '6.2L V8 Extended Wheelbase with 38-inch Curved OLED Display & AKG 36-Speaker Audio.',
    overviewDescription: 'The ultimate statement in executive transport. Escalade ESV Sport Platinum features a 38-inch Curved OLED display, AKG Studio Reference 36-speaker sound, and Air Ride Adaptive Suspension.'
  }
];

/* Sample Active Test Drive Appointments */
export const SAMPLE_TEST_DRIVES: TestDriveBooking[] = [
  {
    id: 'td-101',
    bookingRef: 'TD-2026-081',
    vehicleId: 'veh-001',
    vehicleName: '2025 Toyota Land Cruiser Prado LC250',
    customerName: 'Dr. Evelyn Vance',
    customerPhone: '+254 712 990 011',
    customerEmail: 'evelyn.vance@blackmesa.org',
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    preferredDate: '2026-08-20',
    preferredTimeSlot: '10:30 AM',
    driveType: 'SHOWROOM',
    salespersonName: 'Evans Mugi (Chief Architect)',
    status: 'CONFIRMED',
    createdAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'td-102',
    bookingRef: 'TD-2026-082',
    vehicleId: 'veh-002',
    vehicleName: '2024 BMW M5 Competition F90',
    customerName: 'Marcus Thorne',
    customerPhone: '+254 733 445 566',
    customerEmail: 'm.thorne@cyberdyne.io',
    branchId: 'br-central',
    branchName: 'Central Executive Showroom',
    preferredDate: '2026-08-21',
    preferredTimeSlot: '02:00 PM',
    driveType: 'HOME_DELIVERY',
    salespersonName: 'Klaus Weber',
    status: 'SCHEDULED',
    createdAt: '2026-08-18T16:15:00Z'
  }
];

/* Sample Active Trade-In Valuations */
export const SAMPLE_TRADE_INS: TradeInValuation[] = [
  {
    id: 'ti-201',
    valuationRef: 'TI-2026-401',
    customerName: 'Marcus Thorne',
    customerPhone: '+254 733 445 566',
    customerEmail: 'm.thorne@cyberdyne.io',
    make: 'BMW',
    model: 'M3 Competition F80',
    year: 2020,
    mileageKm: 38000,
    conditionGrade: 'VERY_GOOD',
    estimatedCreditValue: 48000,
    targetVehicleId: 'veh-002',
    status: 'VALUATION_OFFERED',
    createdAt: '2026-08-17T11:00:00Z'
  }
];

/* Sample Vehicle Reservations */
export const SAMPLE_RESERVATIONS: VehicleReservation[] = [
  {
    id: 'res-301',
    reservationRef: 'RES-2026-701',
    vehicleId: 'veh-003',
    vehicleName: '2025 Tesla Model S Plaid (1020 HP)',
    customerName: 'Dr. Evelyn Vance',
    customerEmail: 'evelyn.vance@blackmesa.org',
    depositAmount: 1500,
    expiresAt: '2026-08-21T18:00:00Z',
    status: 'ACTIVE_HOLD',
    createdAt: '2026-08-18T09:20:00Z'
  }
];
