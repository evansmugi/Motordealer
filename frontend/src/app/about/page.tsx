import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Globe, Layers, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About NEXUS PRIME | Our Mission',
  description: 'Discover the vision behind NEXUS PRIME — the futuristic e-commerce platform for next-generation hardware systems.',
};

const VALUES = [
  {
    icon: <Zap size={24} />,
    title: 'Relentless Innovation',
    description: 'We engineer solutions at the absolute frontier of what is physically possible. Every product we curate pushes the boundary of human-machine interaction.',
    accent: '#3B82F6'
  },
  {
    icon: <Shield size={24} />,
    title: 'Uncompromising Quality',
    description: 'Each unit undergoes 200+ point inspection across thermal, structural, and electromagnetic tolerances before it reaches your lab.',
    accent: '#10B981'
  },
  {
    icon: <Globe size={24} />,
    title: 'Global Operator Network',
    description: 'From CERN to MIT, our operator network spans 140+ countries with sub-48hr fulfillment to any research facility worldwide.',
    accent: '#8B5CF6'
  },
  {
    icon: <Layers size={24} />,
    title: 'Open Architecture',
    description: 'Every module is designed with open standards and interoperable protocols. No vendor lock-in, no proprietary barriers.',
    accent: '#F59E0B'
  }
];

const STATS = [
  { value: '140+', label: 'Countries Served' },
  { value: '12K', label: 'Active Operators' },
  { value: '99.97%', label: 'Uptime SLA' },
  { value: '<48h', label: 'Global Fulfillment' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        maxWidth: '1100px', margin: '0 auto', padding: '60px 40px 48px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
            background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            ABOUT US
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '16px', lineHeight: '1.15' }}>
            Building the Infrastructure for Tomorrow&apos;s Operators
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--nexus-text-muted)', lineHeight: '1.8' }}>
            NEXUS PRIME is the premier platform for sourcing, deploying, and managing next-generation hardware systems — from bio-neural interfaces to quantum compute modules. We exist to empower researchers, engineers, and operators with the tools they need to build the future.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 40px 48px'
      }}>
        <div className="glass-panel" style={{
          borderRadius: '20px', padding: '28px 32px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'
        }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--nexus-text)', fontFamily: 'var(--font-mono)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--nexus-text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '24px', textAlign: 'center' }}>
          Our Engineering Principles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {VALUES.map((value, i) => (
            <div key={i} className="glass-panel" style={{ borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px',
                background: `radial-gradient(circle, ${value.accent}22 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${value.accent}15`, color: value.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {value.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '8px' }}>{value.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--nexus-text-muted)', lineHeight: '1.7' }}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 48px' }}>
        <div style={{
          borderRadius: '24px', padding: '48px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.15)', textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '16px' }}>
            &ldquo;We don&apos;t sell products. We deploy capability.&rdquo;
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--nexus-text-muted)', maxWidth: '560px', margin: '0 auto 24px', lineHeight: '1.7' }}>
            NEXUS PRIME is purpose-built for operators who demand laboratory-grade precision, military-grade reliability, and consumer-grade usability — all in a single transaction.
          </p>
          <Link href="/products" className="nexus-btn-primary" style={{ display: 'inline-flex' }}>
            Explore Hardware <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Team / Offices */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 80px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '20px', textAlign: 'center' }}>
          Global Presence
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { city: 'San Francisco', country: 'USA', role: 'HQ — Engineering & Design', tz: 'PST (UTC-8)' },
            { city: 'Frankfurt', country: 'Germany', role: 'EU Fulfillment Hub', tz: 'CET (UTC+1)' },
            { city: 'Tokyo', country: 'Japan', role: 'APAC R&D Lab', tz: 'JST (UTC+9)' },
          ].map((office, i) => (
            <div key={i} className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--nexus-text)', marginBottom: '4px' }}>{office.city}</div>
              <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '700', marginBottom: '8px' }}>{office.country}</div>
              <div style={{ fontSize: '12px', color: 'var(--nexus-text-muted)', marginBottom: '4px' }}>{office.role}</div>
              <div style={{ fontSize: '11px', color: 'var(--nexus-text-dim)', fontFamily: 'var(--font-mono)' }}>{office.tz}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
