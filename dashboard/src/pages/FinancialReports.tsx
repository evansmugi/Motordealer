import React from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { Download } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Financial & Profitability Reports
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            Profit & Loss (P&L) breakdown, gross margin per SKU/category, and tax audit telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton label="Tax Audit CSV" variant="secondary" />
          <HeaderButton
            label="DOWNLOAD P&L STATEMENT"
            icon={<Download size={18} />}
            variant="primary"
            accentColor="#10b981"
            accentLight="#34d399"
            accentRgb="16, 185, 129"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        <div className="erp-card">
          <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', fontWeight: '700' }}>GROSS REVENUE (YTD)</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--erp-text-main)', margin: '8px 0' }}>$186,490.00</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+31.2% year-over-year</div>
        </div>

        <div className="erp-card">
          <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', fontWeight: '700' }}>TOTAL COGS</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--erp-text-main)', margin: '8px 0' }}>$88,200.00</div>
          <div style={{ fontSize: '12px', color: '#2563eb' }}>47.3% cost ratio</div>
        </div>

        <div className="erp-card">
          <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', fontWeight: '700' }}>NET PROFIT MARGIN</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981', margin: '8px 0' }}>52.7%</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>$98,290.00 net margin</div>
        </div>
      </div>
    </div>
  );
};
