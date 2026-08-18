'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section style={{
      position: 'relative',
      minHeight: '82vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
      overflow: 'hidden'
    }}>
      {/* Background Kinetic Light Aura */}
      <div className="light-aura" style={{ top: '-100px', left: '20%' }}></div>
      <div className="light-aura" style={{ bottom: '-100px', right: '20%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' }}></div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Telemetry Badge Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          fontWeight: '700',
          color: '#3B82F6',
          marginBottom: '24px',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
        }}>
          <Activity size={16} />
          <span>AETHEL NEURAL SYNTHESIS 2026</span>
          <span style={{ color: '#64748B' }}>•</span>
          <span style={{ color: '#10B981' }}>128-QUBIT DISCOVERY READY</span>
        </div>

        {/* Spatial Typography Headline */}
        <h1 style={{
          fontSize: '64px',
          fontWeight: '900',
          lineHeight: '1.08',
          letterSpacing: '-2px',
          color: '#F8FAFC',
          marginBottom: '20px'
        }}>
          Next-Gen Bio-Neural & <br />
          <span style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Quantum Compute Ecosystem
          </span>
        </h1>

        {/* Narrative Description */}
        <p style={{
          fontSize: '18px',
          color: '#94A3B8',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: '1.6'
        }}>
          A curated hardware platform engineered for high-throughput cybernetic telemetry, retinal laser projection, and cryo-cooled quantum processing.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <Link href="/products" className="nexus-btn-primary">
            Explore Hardware Catalog <ArrowRight size={18} />
          </Link>
          <Link href="/campaigns/nexus-launch" className="nexus-btn-secondary">
            View Launch Campaign
          </Link>
        </div>

        {/* Floating Telemetry Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginTop: '64px',
          textAlign: 'left'
        }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>BIO-LATENCY</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: '4px 0' }}>0.8 ms</div>
            <div style={{ fontSize: '12px', color: '#10B981' }}>Retinal optical sync</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>QUBIT COHERENCE</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: '4px 0' }}>450 μs</div>
            <div style={{ fontSize: '12px', color: '#3B82F6' }}>128 Qubit superconducting</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>DISPATCH LATENCY</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: '4px 0' }}>Instant</div>
            <div style={{ fontSize: '12px', color: '#8B5CF6' }}>Automated warehouse packing</div>
          </div>
        </div>
      </div>
    </section>
  );
};
