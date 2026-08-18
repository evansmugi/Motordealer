'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Globe, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#040507',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 40px 30px',
      marginTop: '80px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC' }}>
              NEXUS<span style={{ color: '#3B82F6' }}>.PRIME</span>
            </div>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', maxWidth: '320px' }}>
            Next-generation digital commerce ecosystem. Engineered for high-velocity hardware discovery, quantum computing optics, and neural haptic technology.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontSize: '12px', color: '#10B981', fontWeight: '700' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
            Platform Telemetry Systems Operational
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Discovery
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
            <Link href="/products?category=neural-interface" style={{ color: '#94A3B8', textDecoration: 'none' }}>Neural & Haptics</Link>
            <Link href="/products?category=quantum-computing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Quantum Compute</Link>
            <Link href="/products?category=kinetic-workstations" style={{ color: '#94A3B8', textDecoration: 'none' }}>Kinetic Stations</Link>
            <Link href="/products?category=autonomous-drones" style={{ color: '#94A3B8', textDecoration: 'none' }}>Autonomous Drones</Link>
          </div>
        </div>

        {/* Portal Column */}
        <div>
          <h4 style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Ecosystem
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
            <Link href="/account" style={{ color: '#94A3B8', textDecoration: 'none' }}>Order Tracking</Link>
            <a href="http://localhost:5181" target="_blank" rel="noreferrer" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '700' }}>AETHEL ERP OS →</a>
            <a href="http://localhost:1338/admin" target="_blank" rel="noreferrer" style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: '700' }}>Strapi 5 CMS →</a>
          </div>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Telemetry Dispatch
          </h4>
          <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '12px' }}>
            Receive technical spec releases and early access allocations.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="operator@domain.com"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', width: '100%', outline: 'none' }}
            />
            <button style={{ background: '#3B82F6', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
        <div>© 2026 NEXUS PRIME Inc. All rights reserved. Target WCAG 2.2 AA.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Privacy Policy</span>
          <span>Security Audit</span>
          <span>Terms of Dispatch</span>
        </div>
      </div>
    </footer>
  );
};
