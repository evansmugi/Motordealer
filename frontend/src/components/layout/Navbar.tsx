'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingCart, Heart, Zap, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, theme, toggleTheme } = useStore();

  return (
    <header style={{
      height: '72px',
      background: 'var(--nexus-surface)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--nexus-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      justifyContent: 'space-between',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Brand Mark */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
        }}>
          <Zap size={22} color="#fff" />
        </div>
        <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', color: 'var(--nexus-text)' }}>
          NEXUS<span style={{ color: '#3B82F6' }}>.PRIME</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/products" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
          Catalog
        </Link>
        <Link href="/categories" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
          Categories
        </Link>
        <Link href="/campaigns" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
          Deals
        </Link>
        <Link href="/about" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
          About
        </Link>
        <Link href="/account" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
          Portal
        </Link>
      </nav>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Trigger Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--nexus-bg)',
            border: '1px solid var(--nexus-border)',
            borderRadius: '10px',
            padding: '8px 16px',
            color: 'var(--nexus-text-muted)',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <Search size={16} />
          <span>Search products...</span>
          <span style={{ fontSize: '11px', background: 'var(--nexus-border)', padding: '2px 6px', borderRadius: '4px' }}>/</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--nexus-bg)',
            border: '1px solid var(--nexus-border)',
            color: 'var(--nexus-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#3B82F6" />}
        </button>

        {/* Wishlist Link */}
        <Link href="/account" style={{ position: 'relative', color: 'var(--nexus-text-muted)', padding: '8px', display: 'flex' }}>
          <Heart size={20} />
          {wishlist.length > 0 && (
            <span style={{ position: 'absolute', top: '2px', right: '2px', background: '#f43f5e', color: '#fff', fontSize: '10px', fontWeight: '800', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}
        >
          <ShoppingCart size={18} />
          <span>Cart ({cartCount})</span>
        </button>
      </div>
    </header>
  );
};
