'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VehicleItem, TestDriveBooking, TradeInValuation, VehicleReservation, VEHICLES, SAMPLE_TEST_DRIVES, SAMPLE_TRADE_INS, SAMPLE_RESERVATIONS } from '../lib/vehicle-dataset';

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

  // Automotive Modal States
  const [testDriveVehicleId, setTestDriveVehicleId] = useState<string | null>(null);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [reservationVehicleId, setReservationVehicleId] = useState<string | null>(null);

  // Dynamic Datasets
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>(SAMPLE_TEST_DRIVES);
  const [tradeInValuations, setTradeInValuations] = useState<TradeInValuation[]>(SAMPLE_TRADE_INS);
  const [reservations, setReservations] = useState<VehicleReservation[]>(SAMPLE_RESERVATIONS);

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
