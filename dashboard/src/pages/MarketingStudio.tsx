import React from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { CAMPAIGNS, type CampaignItem } from '../data/mock-dataset';
import { Plus } from 'lucide-react';

export const MarketingStudio: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Marketing & Campaign Studio
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            Promotional code engine, campaign budget tracking, and landing page conversion analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton label="Conversion Funnels" variant="secondary" />
          <HeaderButton
            label="CREATE CAMPAIGN"
            icon={<Plus size={18} />}
            variant="primary"
            accentColor="#f43f5e"
            accentLight="#fb7185"
            accentRgb="244, 63, 94"
          />
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--erp-text-main)' }}>Active Promo Campaigns</div>
          <span className="badge badge-rose">{CAMPAIGNS.length} CAMPAIGNS RUNNING</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Campaign Name</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Total Redemptions</th>
              <th>Campaign Budget</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((camp: CampaignItem) => (
              <tr key={camp.id}>
                <td style={{ fontFamily: 'var(--erp-font-mono)', fontWeight: '800', color: '#e11d48' }}>{camp.code}</td>
                <td style={{ fontWeight: '800', color: 'var(--erp-text-main)' }}>{camp.name}</td>
                <td style={{ color: 'var(--erp-text-muted)' }}>{camp.discountType}</td>
                <td style={{ fontWeight: '700', color: '#10b981' }}>
                  {camp.discountType === 'PERCENTAGE' ? `${camp.discountValue}% OFF` : `$${camp.discountValue} OFF`}
                </td>
                <td style={{ fontWeight: '700', color: 'var(--erp-text-main)' }}>{camp.usageCount} redeemed</td>
                <td style={{ color: '#2563eb' }}>${camp.budget.toLocaleString()}</td>
                <td>
                  <span className="badge badge-rose">ACTIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
