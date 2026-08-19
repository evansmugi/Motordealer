'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VehicleItem, TestDriveBooking, TradeInValuation, VehicleReservation, VEHICLES, SAMPLE_TEST_DRIVES, SAMPLE_TRADE_INS, SAMPLE_RESERVATIONS } from '../lib/vehicle-dataset';
import { getStoredBrands } from '../lib/brands';

export interface CartItem {
  product: VehicleItem | any;
  variantColor: string;
  variantOption: string;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: VehicleItem | any | null;
  theme: 'dark' | 'light';
  
  // Automotive Specific Modals & State
  testDriveVehicleId: string | null;
  isTradeInOpen: boolean;
  reservationVehicleId: string | null;
  testDrives: TestDriveBooking[];
  tradeInValuations: TradeInValuation[];
  reservations: VehicleReservation[];
  
  toggleTheme: () => void;
  addToCart: (product: any, variantColor?: string, variantOption?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantColor: string) => void;
  updateQuantity: (productId: string, variantColor: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (vehicleId: string) => void;
  
  openTestDriveModal: (vehicleId: string | null) => void;
  openTradeInModal: (open: boolean) => void;
  openReservationModal: (vehicleId: string | null) => void;
  bookTestDrive: (booking: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdAt'>) => void;
  submitTradeIn: (valuation: Omit<TradeInValuation, 'id' | 'valuationRef' | 'createdAt'>) => void;
  createReservation: (reservation: Omit<VehicleReservation, 'id' | 'reservationRef' | 'createdAt'>) => void;

  vehicles: VehicleItem[];
  brands: string[];
  refreshVehicles: () => Promise<void>;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: any | null) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['veh-001']);
  const [compareList, setCompareList] = useState<string[]>(['veh-001', 'veh-002']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<VehicleItem | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Dynamic Brands Management
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    setBrands(getStoredBrands());

    const handleUpdate = () => {
      setBrands(getStoredBrands());
    };
    window.addEventListener('knk_brands_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('knk_brands_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Automotive Modal States
  const [testDriveVehicleId, setTestDriveVehicleId] = useState<string | null>(null);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [reservationVehicleId, setReservationVehicleId] = useState<string | null>(null);

  // Dynamic Datasets
  const [vehicles, setVehicles] = useState<VehicleItem[]>(VEHICLES);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>(SAMPLE_TEST_DRIVES);
  const [tradeInValuations, setTradeInValuations] = useState<TradeInValuation[]>(SAMPLE_TRADE_INS);
  const [reservations, setReservations] = useState<VehicleReservation[]>(SAMPLE_RESERVATIONS);

  const refreshVehicles = async () => {
    try {
      const res = await fetch('http://localhost:1338/api/car-listings');
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          const loaded: VehicleItem[] = json.data.map((item: any, idx: number) => {
            const attr = item.attributes || item;
            const id = String(item.id || attr.id || `strapi-${idx}`);
            const priceNum = Number(attr.price) || 24500000;
            return {
              id,
              stockNumber: attr.stockNumber || `KNK-${1000 + Number(item.id || idx)}`,
              vin: attr.vin || `W1K2230${100000 + Number(item.id || idx)}`,
              registrationNumber: attr.registrationNumber || 'KDG 001A',
              make: attr.make || 'Mercedes-Benz',
              model: attr.model || 'S-Class',
              generation: attr.generation || 'W223',
              trim: attr.trim || attr.listing_title || 'S 580 4MATIC',
              variant: attr.variant || 'V8 Biturbo',
              year: Number(attr.year) || 2024,
              registrationYear: Number(attr.registrationYear) || 2024,
              condition: (attr.condition as any) || 'CERTIFIED_PRE_OWNED',
              bodyType: (attr.bodyType as any) || 'SEDAN',
              segment: attr.segment || 'Luxury Flagship',
              colorExterior: attr.color || 'Obsidian Black',
              colorInterior: attr.interior_color || 'Nappa Leather',
              interiorMaterial: 'Nappa Leather',
              engine: {
                type: attr.engine || '3.0L V6 Turbo',
                displacementCc: 2999,
                litres: 3.0,
                cylinders: 6,
                configuration: 'V6',
                aspiration: 'TURBOCHARGED',
                powerHp: 429,
                powerKw: 320,
                torqueNm: 520,
                zeroToHundredKm: 4.9,
                topSpeedKm: 250
              },
              fuelEnergy: {
                fuelType: (attr.fuel_type?.toUpperCase().includes('HYBRID') ? 'HYBRID' : attr.fuel_type?.toUpperCase().includes('DIESEL') ? 'DIESEL' : 'PETROL') as any,
                consumptionL100km: 8.5,
                co2EmissionsGkm: 195,
                rangeKm: 750
              },
              transmission: {
                type: (attr.transmission?.toUpperCase().includes('MANUAL') ? 'MANUAL' : 'AUTOMATIC') as any,
                gears: 9,
                paddleShifters: true,
                driveModes: ['Comfort', 'Sport', 'Eco']
              },
              drivetrain: {
                type: 'AWD',
                diffLock: false,
                lowRange: false,
                terrainModes: ['Road', 'Sport']
              },
              dimensions: {
                lengthMm: 5179,
                widthMm: 1954,
                heightMm: 1503,
                wheelbaseMm: 3106,
                groundClearanceMm: 130,
                kerbWeightKg: 2065,
                bootCapacityLiters: 550,
                seats: 5,
                doors: 4,
                towingCapacityKg: 2100
              },
              features: [
                {
                  category: 'INTERIOR_COMFORT',
                  title: 'Executive Comfort',
                  items: Array.isArray(attr.features) ? attr.features : ['Burmester 3D Sound', 'Panoramic Sunroof', 'Head-Up Display', '360 Camera']
                }
              ],
              inspection: {
                score: 98,
                inspectionDate: '2026-08-01',
                inspectorName: 'KnK Senior Master Technician',
                centerLocation: 'Nairobi HQ Complex',
                breakdown: {
                  mechanical: 'PASS',
                  exteriorBody: 'PASS',
                  interiorComfort: 'PASS',
                  electricalElectronics: 'PASS',
                  suspensionSteering: 'PASS',
                  brakesTyres: 'PASS'
                },
                notes: 'Vehicle inspected and passed 150-point KnK Quality Certification.'
              },
              history: {
                previousOwners: 1,
                serviceHistory: 'FULL_DEALER_SERVICE_HISTORY',
                accidentStatus: 'ACCIDENT_FREE_VERIFIED',
                mileageVerified: true,
                odometerKm: Number(attr.mileage) || 8400,
                lastServiceDate: '2026-07-15',
                lastServiceKm: Number(attr.mileage) || 8400,
                importStatus: 'DIRECT_UK_IMPORT'
              },
              pricing: {
                cashPrice: priceNum,
                originalPrice: Math.round(priceNum * 1.08),
                costPrice: Math.round(priceNum * 0.85),
                minDepositPercent: 20,
                estimatedMonthlyPayment: Math.round((priceNum * 0.8) / 48),
                vatIncluded: true,
                dutyPaid: true
              },
              availability: attr.currentStatus === 'Sold' ? 'SOLD' : attr.currentStatus === 'Reserved' ? 'RESERVED' : 'AVAILABLE',
              daysInStock: 12,
              branchId: 'nairobi-hq',
              branchName: 'KnK Executive Showroom - Nairobi HQ',
              heroImage: (attr.images && attr.images[0] && (attr.images[0].url || attr.images[0])) || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
              images: Array.isArray(attr.images) && attr.images.length > 0
                ? attr.images.map((img: any) => typeof img === 'string' ? img : img.url)
                : ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'],
              frames360: [],
              badges: [attr.offer_type || 'Featured', attr.condition || 'Foreign Used'],
              isFeatured: true,
              shortTagline: attr.tagline || attr.listing_title || 'Luxury Flagship',
              overviewDescription: attr.listing_description || 'High-specification vehicle listed via KnK Enterprise Admin.'
            };
          });

          // Merge Strapi API vehicles with master VEHICLES dataset without duplicating IDs
          const existingIds = new Set(loaded.map(v => v.id));
          const combined = [...loaded];
          VEHICLES.forEach(v => {
            if (!existingIds.has(v.id)) {
              combined.push(v);
            }
          });

          setVehicles(combined);
        }
      }
    } catch (e) {
      console.warn('Could not load vehicles from Strapi backend, using dataset fallback:', e);
    }
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nexus_cart');
      const savedWishlist = localStorage.getItem('nexus_wishlist');
      const savedCompare = localStorage.getItem('nexus_compare');
      const savedTheme = localStorage.getItem('nexus_theme') as 'dark' | 'light';
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCompare) setCompareList(JSON.parse(savedCompare));
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexus_cart', JSON.stringify(cart));
      localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('nexus_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error(e);
    }
  }, [cart, wishlist, compareList]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('nexus_theme', next);
        document.documentElement.setAttribute('data-theme', next);
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addToCart = (
    product: any,
    variantColor: string = product.colorExterior || 'Standard',
    variantOption: string = product.trim || 'Standard',
    quantity: number = 1
  ) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variantColor === variantColor
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, variantColor, variantOption, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantColor: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.variantColor === variantColor)));
  };

  const updateQuantity = (productId: string, variantColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantColor);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.variantColor === variantColor) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (vehicleId: string) => {
    setCompareList(prev => {
      if (prev.includes(vehicleId)) return prev.filter(id => id !== vehicleId);
      if (prev.length >= 4) return prev; // max 4 vehicles
      return [...prev, vehicleId];
    });
  };

  const openTestDriveModal = (vehicleId: string | null) => setTestDriveVehicleId(vehicleId);
  const openTradeInModal = (open: boolean) => setIsTradeInOpen(open);
  const openReservationModal = (vehicleId: string | null) => setReservationVehicleId(vehicleId);

  const bookTestDrive = (booking: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdAt'>) => {
    const newBooking: TestDriveBooking = {
      ...booking,
      id: `td-${Date.now()}`,
      bookingRef: `TD-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };
    setTestDrives(prev => [newBooking, ...prev]);
    setTestDriveVehicleId(null);
  };

  const submitTradeIn = (valuation: Omit<TradeInValuation, 'id' | 'valuationRef' | 'createdAt'>) => {
    const newTradeIn: TradeInValuation = {
      ...valuation,
      id: `ti-${Date.now()}`,
      valuationRef: `TI-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };
    setTradeInValuations(prev => [newTradeIn, ...prev]);
    setIsTradeInOpen(false);
  };

  const createReservation = (reservation: Omit<VehicleReservation, 'id' | 'reservationRef' | 'createdAt'>) => {
    const newReservation: VehicleReservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      reservationRef: `RES-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [newReservation, ...prev]);
    setReservationVehicleId(null);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.pricing ? item.product.pricing.cashPrice : (item.product.price || 0);
    return sum + price * item.quantity;
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        vehicles,
        brands,
        refreshVehicles,
        cart,
        wishlist,
        compareList,
        isCartOpen,
        isSearchOpen,
        quickViewProduct,
        theme,
        testDriveVehicleId,
        isTradeInOpen,
        reservationVehicleId,
        testDrives,
        tradeInValuations,
        reservations,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        toggleCompare,
        openTestDriveModal,
        openTradeInModal,
        openReservationModal,
        bookTestDrive,
        submitTradeIn,
        createReservation,
        setIsCartOpen,
        setIsSearchOpen,
        setQuickViewProduct,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
