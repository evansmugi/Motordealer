'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, PRODUCTS as productList, ProductItem } from '../lib/mock-dataset';

export interface CartItem {
  product: ProductItem;
  variantColor: string;
  variantOption: string;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: ProductItem | null;
  addToCart: (product: ProductItem, variantColor?: string, variantOption?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantColor: string) => void;
  updateQuantity: (productId: string, variantColor: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: ProductItem | null) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nexus_cart');
      const savedWishlist = localStorage.getItem('nexus_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexus_cart', JSON.stringify(cart));
      localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [cart, wishlist]);

  const addToCart = (
    product: ProductItem,
    variantColor: string = product.variants[0]?.color || 'Standard',
    variantOption: string = product.variants[0]?.option || 'Standard',
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

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        quickViewProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
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
