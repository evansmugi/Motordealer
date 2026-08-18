import React from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { Database, Server, Terminal, Lock } from 'lucide-react';

export const SystemAdmin: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            System & Security Administration
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            Role-Based Access Control (RBAC), audit log inspection, and webhook configuration.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton label="View Audit Logs" variant="secondary" />
          <HeaderButton
            label="CONFIGURE RBAC"
            icon={<Lock size={18} />}
            variant="primary"
            accentColor="#64748b"
            accentLight="#94a3b8"
            accentRgb="100, 116, 139"
          />
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--erp-text-main)' }}>Platform Telemetry Services</div>
          <span className="badge badge-emerald">SYSTEM HEALTHY</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2563eb', fontWeight: '800' }}>
              <Server size={18} /> Strapi 5 Headless API
            </div>
            <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', marginTop: '6px' }}>Port 1338 • Active</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: '800' }}>
              <Database size={18} /> PostgreSQL Database
            </div>
            <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', marginTop: '6px' }}>Port 5432 • Connected</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7c3aed', fontWeight: '800' }}>
              <Terminal size={18} /> Next.js Storefront
            </div>
            <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', marginTop: '6px' }}>Port 3001 • Online</div>
          </div>
        </div>
      </div>
    </div>
  );
};
