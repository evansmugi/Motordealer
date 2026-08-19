import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  ShoppingCart,
  Users,
  BarChart3,
  ShieldCheck,
  Search,
  Bell,
  Zap,
  Globe,
  Sun,
  Moon,
  TrendingUp,
  Target,
  GitMerge,
  Award,
  MessageSquare,
  Calendar,
  ArrowRightLeft,
  CheckSquare,
  Clock,
  Eye,
  Compass
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('aethel_erp_theme') as 'dark' | 'light';
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('aethel_erp_theme', next);
        document.documentElement.setAttribute('data-theme', next);
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const menuSections = [
    {
      title: 'Executive Telemetry',
      items: [
        { id: 'dashboard', label: 'Executive Telemetry', icon: LayoutDashboard, accent: '#6366f1' },
        { id: 'catalog', label: 'Vehicle Inventory & SKUs', icon: Package, accent: '#3b82f6' }
      ]
    },
    {
      title: 'Fuse CRM 100% Suite',
      items: [
        { id: 'crm-overview', label: 'CRM Overview', icon: Users, accent: '#0284c7' },
        { id: 'leads', label: 'Leads Manager', icon: Users, accent: '#38bdf8' },
        { id: 'pipeline', label: 'Pipeline Kanban', icon: GitMerge, accent: '#0ea5e9' },
        { id: 'opportunities', label: 'Opportunities Matrix', icon: Target, accent: '#0284c7' },
        { id: 'won-deals', label: 'Won Deals Board', icon: Award, accent: '#10b981' },
        { id: 'communication', label: 'Communication Hub', icon: MessageSquare, accent: '#6366f1' },
        { id: 'appointments', label: 'Booked Appointments', icon: Calendar, accent: '#f59e0b' },
        { id: 'trade-ins', label: 'Trade-In Assessment Desk', icon: ArrowRightLeft, accent: '#8b5cf6' },
        { id: 'tasks', label: 'Task Hub', icon: CheckSquare, accent: '#ec4899' },
        { id: 'sla', label: 'SLA Tracker', icon: Clock, accent: '#14b8a6' }
      ]
    },
    {
      title: 'Campaign Monitor & Analytics',
      items: [
        { id: 'campaign-monitor', label: 'Campaign Monitor', icon: Target, accent: '#f43f5e' },
        { id: 'campaigns-manager', label: 'Campaigns Manager', icon: Target, accent: '#fb7185' },
        { id: 'insights', label: 'Insights & Traffic', icon: TrendingUp, accent: '#8b5cf6' },
        { id: 'vehicle-views', label: 'Vehicle Views Telemetry', icon: Eye, accent: '#a78bfa' },
        { id: 'customer-journeys', label: 'Attribution Journeys', icon: Compass, accent: '#c084fc' }
      ]
    },
    {
      title: 'Dealership Operations',
      items: [
        { id: 'inventory', label: 'Multi-Yard Inventory', icon: Boxes, accent: '#f59e0b' },
        { id: 'procurement', label: 'Procurement & Imports', icon: Truck, accent: '#8b5cf6' },
        { id: 'sales', label: 'Sales & Order Machine', icon: ShoppingCart, accent: '#84cc16' },
        { id: 'finance', label: 'Vehicle Profitability P&L', icon: BarChart3, accent: '#10b981' },
        { id: 'admin', label: 'System & Security Admin', icon: ShieldCheck, accent: '#64748b' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--erp-bg-dark)', transition: 'background 0.3s ease' }}>
      {/* Left Navigation Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--erp-sidebar-bg)',
        borderRight: '1px solid var(--erp-card-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}>
        {/* Brand Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--erp-card-border)' }}>
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
              <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '1px', color: 'var(--erp-text-main)', textTransform: 'uppercase' }}>
                AETHEL<span style={{ color: '#6366f1' }}>.MOTORS</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--erp-text-dim)', fontWeight: '600', letterSpacing: '0.5px' }}>
                FUSE AUTOMOTIVE OS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ padding: '4px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--erp-text-dim)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isActive ? 'var(--erp-card-border)' : 'transparent',
                      color: isActive ? 'var(--erp-text-main)' : 'var(--erp-text-muted)',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? `3px solid ${item.accent}` : '3px solid transparent'
                    }}
                  >
                    <Icon size={16} color={isActive ? item.accent : 'var(--erp-text-dim)'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Telemetry Status */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--erp-card-border)', background: 'var(--erp-bg-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            100% Fuse Active
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Command Bar */}
        <header style={{
          height: '64px',
          background: 'var(--erp-header-bg)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--erp-card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}>
          {/* Global Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '380px', background: 'var(--erp-card-bg)', border: '1px solid var(--erp-card-border)', borderRadius: '10px', padding: '8px 14px' }}>
            <Search size={16} color="var(--erp-text-dim)" />
            <input
              type="text"
              placeholder="Search Leads, Campaigns, UTMs, Tasks (Ctrl + K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--erp-text-main)', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>

          {/* Header Action Tools & Quick Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', fontSize: '11px', color: '#818cf8', fontWeight: '700' }}>
                <Globe size={14} />
                Live Showroom (Port 3001)
              </div>
            </a>

            {/* Sun / Moon Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{
                background: 'var(--erp-card-bg)',
                border: '1px solid var(--erp-card-border)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--erp-text-main)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366f1" />}
            </button>

            <button style={{ background: 'var(--erp-card-bg)', border: '1px solid var(--erp-card-border)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--erp-text-muted)', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: '#f43f5e', borderRadius: '50%' }}></span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid var(--erp-card-border)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '800' }}>
                EX
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--erp-text-main)' }}>Evans Mugi</div>
                <div style={{ fontSize: '10px', color: 'var(--erp-text-dim)' }}>Chief Architect</div>
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
