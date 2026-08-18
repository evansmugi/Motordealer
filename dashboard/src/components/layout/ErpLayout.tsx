import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  ShoppingCart,
  Users,
  Megaphone,
  BarChart3,
  ShieldCheck,
  Search,
  Bell,
  Zap,
  Globe
} from 'lucide-react';

interface ErpLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const ErpLayout: React.FC<ErpLayoutProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Executive Telemetry', icon: LayoutDashboard, accent: '#6366f1' },
    { id: 'catalog', label: 'Product & SKU Matrix', icon: Package, accent: '#3b82f6' },
    { id: 'inventory', label: 'Inventory & Warehouses', icon: Boxes, accent: '#f59e0b' },
    { id: 'procurement', label: 'Procurement & Suppliers', icon: Truck, accent: '#8b5cf6' },
    { id: 'sales', label: 'Sales & Order Machine', icon: ShoppingCart, accent: '#84cc16' },
    { id: 'crm', label: 'Customer Intelligence', icon: Users, accent: '#0284c7' },
    { id: 'marketing', label: 'Marketing Studio', icon: Megaphone, accent: '#f43f5e' },
    { id: 'finance', label: 'Financial & P&L Reports', icon: BarChart3, accent: '#10b981' },
    { id: 'admin', label: 'System & Security Admin', icon: ShieldCheck, accent: '#64748b' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#090B0E' }}>
      {/* Left Navigation Sidebar */}
      <aside style={{
        width: '260px',
        background: '#0C0E13',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #3730a3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
            }}>
              <Zap size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '1px', color: '#F1F5F9', textTransform: 'uppercase' }}>
                AETHEL<span style={{ color: '#6366f1' }}>.OS</span>
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', letterSpacing: '0.5px' }}>
                OPERATIONAL OS v4.2
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '800', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Core Operations
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? `3px solid ${item.accent}` : '3px solid transparent'
                }}
              >
                <Icon size={18} color={isActive ? item.accent : '#64748B'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Telemetry Status */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(0, 0, 0, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#34d399', fontWeight: '600' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}></span>
            PostgreSQL & Strapi Synced
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
            Port 5181 • Latency 1.2ms
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Command Bar */}
        <header style={{
          height: '64px',
          background: 'rgba(12, 14, 19, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Global Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '380px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '8px 14px' }}>
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search SKUs, Orders, Customers (Ctrl + K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#F1F5F9', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>

          {/* Header Action Tools & Quick Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', fontSize: '11px', color: '#818cf8', fontWeight: '700' }}>
              <Globe size={14} />
              Storefront Live (Port 3001)
            </div>

            <button style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: '#f43f5e', borderRadius: '50%' }}></span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '800' }}>
                EX
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9' }}>Evans Mugi</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Chief Architect</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content Container */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
