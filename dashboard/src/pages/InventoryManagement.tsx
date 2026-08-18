import React, { useState } from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { WAREHOUSE_STOCKS, type WarehouseStock } from '../data/mock-dataset';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const [stocks] = useState<WarehouseStock[]>(WAREHOUSE_STOCKS);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Stock transfer order initiated: 5 units of NEX-NEURO-X1 from Alpha Central to EU Hub.');
    setShowTransferModal(false);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with Fuse Button Standard (Inventory Accent #f59e0b) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Multi-Warehouse Inventory OS
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            Real-time bin locations, warehouse stock movement audit trail, and low-stock reorder triggers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton
            label="Audit Valuation"
            variant="secondary"
          />
          <HeaderButton
            label="INITIATE TRANSFER"
            icon={<ArrowRightLeft size={18} />}
            onClick={() => setShowTransferModal(true)}
            variant="primary"
            accentColor="#f59e0b"
            accentLight="#fbbf24"
            accentRgb="245, 158, 11"
          />
        </div>
      </div>

      {notice && (
        <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', color: '#d97706', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {notice}
        </div>
      )}

      {/* Warehouse Stock Matrix Data Table */}
      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--erp-text-main)' }}>Warehouse Stock Allocations</div>
          <span className="badge badge-amber">3 WAREHOUSES ACTIVE</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Warehouse Facility</th>
              <th>Bin Location</th>
              <th>Available Units</th>
              <th>Reserved Units</th>
              <th>Reorder Point</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((item: WarehouseStock, idx: number) => {
              const isLow = item.available <= item.reorderPoint;
              return (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--erp-font-mono)', fontWeight: '700', color: '#2563eb' }}>{item.sku}</td>
                  <td style={{ fontWeight: '700', color: 'var(--erp-text-main)' }}>{item.warehouseName}</td>
                  <td style={{ fontFamily: 'var(--erp-font-mono)', color: '#d97706' }}>{item.binLocation}</td>
                  <td style={{ fontWeight: '800', color: isLow ? '#e11d48' : '#10b981' }}>{item.available} units</td>
                  <td style={{ color: 'var(--erp-text-muted)' }}>{item.reserved} units</td>
                  <td style={{ color: 'var(--erp-text-dim)' }}>{item.reorderPoint} units</td>
                  <td>
                    {isLow ? (
                      <span className="badge badge-rose">REORDER REQ</span>
                    ) : (
                      <span className="badge badge-emerald">OPTIMAL</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transfer Stock Modal */}
      {showTransferModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--erp-card-bg)', border: '1px solid var(--erp-card-border)', borderRadius: '16px', padding: '24px', width: '440px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--erp-text-main)', marginBottom: '16px' }}>Transfer Warehouse Inventory</h2>
            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--erp-text-muted)', display: 'block', marginBottom: '4px' }}>Select SKU</label>
                <select style={{ width: '100%', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', color: 'var(--erp-text-main)', padding: '8px', borderRadius: '8px' }}>
                  <option>NEX-NEURO-X1 (AETHEL Neural Visor)</option>
                  <option>NEX-QUANT-CORE (VORTEX Quantum Core)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--erp-text-muted)', display: 'block', marginBottom: '4px' }}>From Warehouse</label>
                  <select style={{ width: '100%', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', color: 'var(--erp-text-main)', padding: '8px', borderRadius: '8px' }}>
                    <option>Alpha Central (US West)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--erp-text-muted)', display: 'block', marginBottom: '4px' }}>To Warehouse</label>
                  <select style={{ width: '100%', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', color: 'var(--erp-text-main)', padding: '8px', borderRadius: '8px' }}>
                    <option>EU Central Hub (Frankfurt)</option>
                    <option>Omega Logistics (US East)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--erp-text-muted)', display: 'block', marginBottom: '4px' }}>Transfer Quantity</label>
                <input type="number" defaultValue={5} style={{ width: '100%', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', color: 'var(--erp-text-main)', padding: '8px', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowTransferModal(false)} className="aq-btn-secondary" style={{ height: '38px', padding: '0 16px', fontSize: '12px' }}>Cancel</button>
                <button type="submit" className="aq-btn-primary" style={{ height: '38px', padding: '0 16px', fontSize: '11px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)' }}>Confirm Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
