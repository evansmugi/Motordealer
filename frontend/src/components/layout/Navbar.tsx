'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { Search, Heart, Car, Sun, Moon, Layers, ArrowRightLeft, Calculator } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { wishlist, compareList, theme, toggleTheme, setIsSearchOpen, openTradeInModal } = useStore();

  return (
    <header style={{
      height: '72px',
      background: 'var(--nexus-surface)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--nexus-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      justifyContent: 'space-between',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Brand Mark */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
        }}>
          <Car size={22} color="#fff" />
        </div>
        <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', color: 'var(--nexus-text)' }}>
          AETHEL<span style={{ color: '#3B82F6' }}>.MOTORS</span>
        </div>
      </Link>

      {/* Automotive Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link href="/products" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', transition: 'color 0.2s' }}>
          Vehicle Inventory
        </Link>
        <Link href="/compare" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={15} color="#3B82F6" />
          Compare ({compareList.length})
        </Link>
        <Link href="/finance" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calculator size={15} color="#10B981" />
          Finance
        </Link>
        <Link href="/trade-in" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowRightLeft size={15} color="#8B5CF6" />
          Trade-In
        </Link>
        <Link href="/categories" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
          Body Types
        </Link>
        <Link href="/about" style={{ color: 'var(--nexus-text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
          About Dealership
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
          <span>Search VIN, Make, Model...</span>
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
      </div>
    </header>
  );
};
