import React from 'react';
import Link from 'next/link';
import { Layers, Database, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  status: {
    connected: boolean;
    message: string;
    version?: string;
  };
}

export default function Header({ status }: HeaderProps) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Strapi<span className="gradient-text">Studio</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
              Headless Client App
            </div>
          </div>
        </Link>

        {/* Backend Status & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="badge-status">
            <span className={status.connected ? 'dot-online' : 'dot-offline'} />
            <Database size={14} />
            <span>{status.connected ? `PostgreSQL v5.52` : 'Offline'}</span>
          </div>

          <a 
            href="http://localhost:1338/admin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="gradient-button"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <span>Strapi Admin Panel</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}
