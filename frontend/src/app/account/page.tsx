'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { ORDERS, PRODUCTS } from '../../lib/mock-dataset';
import {
  Package, Heart, User, LogOut, ChevronRight,
  Truck, Clock, CheckCircle, Shield, MapPin, Mail
} from 'lucide-react';

type AccountTab = 'orders' | 'wishlist' | 'profile';

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#F59E0B',
  PAYMENT_PENDING: '#F59E0B',
  PAID: '#3B82F6',
  PROCESSING: '#8B5CF6',
  PACKED: '#6366F1',
  SHIPPED: '#06B6D4',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
  REFUNDED: '#F97316',
};

export default function AccountPage() {
  const { wishlist, toggleWishlist } = useStore();
  const [activeTab, setActiveTab] = useState<AccountTab>('orders');

  const wishlisted = PRODUCTS.filter(p => wishlist.includes(p.id));

  const tabs: { id: AccountTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'orders', label: 'Order History', icon: <Package size={18} />, count: ORDERS.length },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, count: wishlisted.length },
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto 0', padding: '0 40px' }}>
      {/* Profile Header */}
      <div className="glass-panel" style={{
        borderRadius: '20px', padding: '32px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '24px'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: '900', color: '#fff'
        }}>
          EV
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#F8FAFC', marginBottom: '4px' }}>
            Dr. Evelyn Vance
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> evelyn.vance@blackmesa.org</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> Palo Alto, CA</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
            background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', letterSpacing: '0.5px'
          }}>
            VIP TIER
          </div>
          <button className="nexus-btn-secondary" style={{ height: '36px', padding: '0 16px', fontSize: '12px', gap: '6px' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        {/* Sidebar Navigation */}
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '8px', height: 'fit-content' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: 'none', color: activeTab === tab.id ? '#3B82F6' : '#94A3B8',
                fontSize: '13px', fontWeight: activeTab === tab.id ? '800' : '600',
                cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left'
              }}
            >
              {tab.icon}
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '11px', fontWeight: '800', padding: '2px 8px',
                  borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#64748B'
                }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div>
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC' }}>Order History</h2>
              {ORDERS.map(order => (
                <div key={order.id} className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                        #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px',
                        background: `${STATUS_COLOR[order.orderStatus] || '#64748B'}22`,
                        color: STATUS_COLOR[order.orderStatus] || '#64748B',
                        letterSpacing: '0.5px'
                      }}>
                        {order.orderStatus}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC' }}>
                        ${order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)'
                      }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '10px',
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          border: '1px solid rgba(255,255,255,0.08)'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>SKU: {item.sku} · Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC' }}>
                          ${item.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div style={{
                    padding: '16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                      LIFECYCLE TIMELINE
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.timeline.map((event, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                            background: idx === order.timeline.length - 1 ? '#3B82F6' : '#10B981'
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC' }}>
                              {event.status}
                              <span style={{ fontWeight: '400', color: '#64748B', marginLeft: '8px' }}>
                                {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{event.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber !== 'PENDING' && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#06B6D4' }}>
                      <Truck size={14} /> Tracking: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC', marginBottom: '16px' }}>Wishlist</h2>
              {wishlisted.length === 0 ? (
                <div className="glass-panel" style={{ borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                  <Heart size={32} color="#64748B" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#94A3B8', fontSize: '14px' }}>No items in your wishlist yet.</p>
                  <Link href="/products" className="nexus-btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
                    Explore Catalog
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {wishlisted.map(product => (
                    <div key={product.id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{
                        height: '160px', backgroundImage: `url(${product.images[0]})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <button onClick={() => toggleWishlist(product.id)} style={{
                          position: 'absolute', top: '10px', right: '10px',
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.2)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Heart size={16} color="#EF4444" fill="#EF4444" />
                        </button>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', marginBottom: '4px' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>{product.shortDescription}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC' }}>${product.price.toLocaleString()}</span>
                          <Link href={`/product/${product.slug}`} className="nexus-btn-primary" style={{ height: '34px', padding: '0 16px', fontSize: '11px' }}>
                            View <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC' }}>Profile & Security</h2>

              <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px' }}>Account Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Full Name', value: 'Dr. Evelyn Vance' },
                    { label: 'Email', value: 'evelyn.vance@blackmesa.org' },
                    { label: 'Phone', value: '+1 (650) 555-2842' },
                    { label: 'Member Since', value: 'August 2026' },
                  ].map((field, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{field.label}</div>
                      <div style={{
                        padding: '10px 14px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '13px', color: '#F8FAFC', fontWeight: '600'
                      }}>{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px' }}>Default Shipping Address</h3>
                <div style={{
                  padding: '14px 16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '13px', color: '#94A3B8', lineHeight: '1.8'
                }}>
                  742 Quantum Way, Suite 400<br />
                  Palo Alto, CA 94301<br />
                  United States
                </div>
              </div>

              <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} /> Security
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Password', value: '••••••••••••', action: 'Change' },
                    { label: 'Two-Factor Auth', value: 'Enabled (Authenticator App)', action: 'Manage' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', marginBottom: '2px' }}>{row.label}</div>
                        <div style={{ fontSize: '13px', color: '#F8FAFC' }}>{row.value}</div>
                      </div>
                      <button className="nexus-btn-secondary" style={{ height: '30px', padding: '0 14px', fontSize: '11px' }}>
                        {row.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
