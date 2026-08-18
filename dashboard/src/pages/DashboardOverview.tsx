import React, { useState } from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { PRODUCTS, ORDERS, type ProductItem, type OrderItem } from '../data/mock-dataset';
import { DollarSign, ShoppingBag, AlertTriangle, RefreshCw, ArrowUpRight, Truck } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');

  const totalRevenue = ORDERS.reduce((sum: number, ord: OrderItem) => sum + ord.totalAmount, 0);
  const totalOrders = ORDERS.length;
  const pendingFulfillment = ORDERS.filter((o: OrderItem) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'PENDING').length;
  const lowStockCount = PRODUCTS.filter((p: ProductItem) => p.stock < 20).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Section Header with Fuse Button Standard */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F1F5F9', margin: 0, letterSpacing: '-0.5px' }}>
            Executive Operations Telemetry
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            Real-time business performance, warehouse velocity, and order pipeline analytics.
          </p>
        </div>

        {/* Fuse Header Buttons (Dashboard Accent #6366f1) */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton
            label="Export P&L Report"
            variant="secondary"
          />
          <HeaderButton
            label="Run Diagnostics"
            icon={<RefreshCw size={18} />}
            variant="primary"
            accentColor="#6366f1"
            accentLight="#818cf8"
            accentRgb="99, 102, 241"
          />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <div className="erp-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>
            <span>TOTAL REVENUE</span>
            <DollarSign size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F1F5F9', margin: '10px 0 4px' }}>
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34d399', fontWeight: '700' }}>
            <ArrowUpRight size={14} /> +24.8% vs last week
          </div>
        </div>

        <div className="erp-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>
            <span>ACTIVE ORDERS</span>
            <ShoppingBag size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F1F5F9', margin: '10px 0 4px' }}>
            {totalOrders}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34d399', fontWeight: '700' }}>
            <ArrowUpRight size={14} /> 100% Payment Verified
          </div>
        </div>

        <div className="erp-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>
            <span>PENDING FULFILLMENT</span>
            <Truck size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F1F5F9', margin: '10px 0 4px' }}>
            {pendingFulfillment}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24', fontWeight: '700' }}>
            Alpha Central Allocated
          </div>
        </div>

        <div className="erp-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>
            <span>LOW STOCK ALERTS</span>
            <AlertTriangle size={18} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F1F5F9', margin: '10px 0 4px' }}>
            {lowStockCount} SKUs
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fb7185', fontWeight: '700' }}>
            Reorder point triggered
          </div>
        </div>
      </div>

      {/* Main Grid Section: Live Orders & Warehouse Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Recent Orders Data Table */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#F1F5F9' }}>Live Order Stream</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>State Machine Orders & Dispatch Status</div>
            </div>
            <span className="badge badge-emerald">REALTIME SYNC</span>
          </div>

          <table className="erp-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>State</th>
                <th>Payment</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((ord: OrderItem) => (
                <tr key={ord.id}>
                  <td style={{ fontFamily: 'var(--erp-font-mono)', fontWeight: '700', color: '#60a5fa' }}>{ord.orderNumber}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{ord.customerEmail}</div>
                  </td>
                  <td style={{ fontWeight: '800', color: '#F1F5F9' }}>${ord.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${ord.orderStatus === 'SHIPPED' ? 'badge-emerald' : 'badge-amber'}`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{ord.paymentStatus}</span>
                  </td>
                  <td style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Multi-Warehouse Status Panel */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#F1F5F9' }}>Warehouse Matrix</div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#F1F5F9', borderRadius: '6px', padding: '4px 8px', fontSize: '11px' }}
            >
              <option value="ALL">All Warehouses</option>
              <option value="wh-alpha">Alpha Central</option>
              <option value="wh-omega">Omega Logistics</option>
              <option value="wh-eu">EU Hub</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PRODUCTS.slice(0, 4).map((prod: ProductItem, idx: number) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                  <span style={{ color: '#F1F5F9' }}>{prod.sku}</span>
                  <span style={{ color: '#60a5fa', fontFamily: 'var(--erp-font-mono)' }}>STOCK: {prod.stock}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{prod.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '8px', color: '#94A3B8' }}>
                  <span>Available: <strong style={{ color: '#34d399' }}>{prod.stock - prod.reservedStock}</strong></span>
                  <span>Reserved: <strong style={{ color: '#fbbf24' }}>{prod.reservedStock}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
