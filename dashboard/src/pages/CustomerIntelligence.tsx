import React from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { UserPlus } from 'lucide-react';

export const CustomerIntelligence: React.FC = () => {
  const customers = [
    { id: 'c-1', name: 'Dr. Evelyn Vance', email: 'evelyn.vance@blackmesa.org', tier: 'VIP PLATINUM', ltv: 24500, ordersCount: 8, lastActive: 'Today' },
    { id: 'c-2', name: 'Marcus Thorne', email: 'm.thorne@cyberdyne.io', tier: 'ENTERPRISE GOLD', ltv: 18200, ordersCount: 5, lastActive: '2 days ago' },
    { id: 'c-3', name: 'Sarah Connor', email: 's.connor@resistance.net', tier: 'STANDARD TECH', ltv: 4200, ordersCount: 2, lastActive: '1 week ago' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Customer CRM & RFM Intelligence
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            RFM Segmentation, Lifetime Value (LTV) analytics, and key account profiles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton label="Export CRM Matrix" variant="secondary" />
          <HeaderButton
            label="ADD CUSTOMER"
            icon={<UserPlus size={18} />}
            variant="primary"
            accentColor="#0284c7"
            accentLight="#38bdf8"
            accentRgb="2, 132, 199"
          />
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--erp-text-main)' }}>Customer Database</div>
          <span className="badge badge-blue">RFM ALGORITHM ACTIVE</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>RFM Tier</th>
              <th>Lifetime Value (LTV)</th>
              <th>Orders Count</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: '800', color: 'var(--erp-text-main)' }}>{c.name}</td>
                <td style={{ color: '#2563eb' }}>{c.email}</td>
                <td>
                  <span className="badge badge-purple">{c.tier}</span>
                </td>
                <td style={{ fontWeight: '800', color: '#10b981' }}>${c.ltv.toLocaleString()}</td>
                <td style={{ fontWeight: '700', color: 'var(--erp-text-main)' }}>{c.ordersCount} orders</td>
                <td style={{ fontSize: '11px', color: 'var(--erp-text-muted)' }}>{c.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
