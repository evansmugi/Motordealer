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
