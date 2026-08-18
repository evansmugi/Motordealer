import React, { useState } from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { SUPPLIERS, type SupplierItem } from '../data/mock-dataset';
import { Plus, CheckCircle2, Star } from 'lucide-react';

export const ProcurementSupplier: React.FC = () => {
  const [supplierList] = useState<SupplierItem[]>(SUPPLIERS);
  const [poCreatedNotice, setPoCreatedNotice] = useState<string | null>(null);

  const handleCreatePO = () => {
    setPoCreatedNotice('Purchase Order PO-2026-904 generated for Titanium Synthetics Corp ($18,500). Sent for GRN verification.');
    setTimeout(() => setPoCreatedNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F1F5F9', margin: 0, letterSpacing: '-0.5px' }}>
            Procurement & Supplier CRM
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            Manage vendor relations, Purchase Orders (PO), Goods Received Notes (GRN), and landed cost calculations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton
            label="Landed Cost Calculator"
            variant="secondary"
          />
          <HeaderButton
            label="NEW PURCHASE ORDER"
            icon={<Plus size={18} />}
            onClick={handleCreatePO}
            variant="primary"
            accentColor="#8b5cf6"
            accentLight="#a78bfa"
            accentRgb="139, 92, 246"
          />
        </div>
      </div>

      {poCreatedNotice && (
        <div style={{ padding: '12px 16px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', color: '#a78bfa', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {poCreatedNotice}
        </div>
      )}

      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#F1F5F9' }}>Verified Vendor Network</div>
          <span className="badge badge-purple">{supplierList.length} SUPPLIERS ACTIVE</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Vendor Code</th>
              <th>Supplier Name</th>
              <th>Key Contact</th>
              <th>Contact Email</th>
              <th>Lead Time</th>
              <th>Vendor Score</th>
              <th>Active POs</th>
            </tr>
          </thead>
          <tbody>
            {supplierList.map((sup: SupplierItem) => (
              <tr key={sup.id}>
                <td style={{ fontFamily: 'var(--erp-font-mono)', fontWeight: '700', color: '#a78bfa' }}>{sup.code}</td>
                <td style={{ fontWeight: '800', color: '#F1F5F9' }}>{sup.name}</td>
                <td style={{ color: '#94A3B8' }}>{sup.contactName}</td>
                <td style={{ color: '#60a5fa' }}>{sup.email}</td>
                <td style={{ fontWeight: '700', color: '#F1F5F9' }}>{sup.leadTimeDays} Days</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: '800' }}>
                    <Star size={14} fill="#fbbf24" /> {sup.rating}
                  </span>
                </td>
                <td>
                  <span className="badge badge-purple">{sup.activeOrders} POs Processing</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
