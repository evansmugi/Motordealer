import React, { useState } from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { PRODUCTS as initialProducts, type ProductItem } from '../data/mock-dataset';
import { Plus, Search, RefreshCw, Eye, Edit3, CheckCircle2 } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const [productsList] = useState<ProductItem[]>(initialProducts);
  const [filterText, setFilterText] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const filtered = productsList.filter((p: ProductItem) =>
    p.name.toLowerCase().includes(filterText.toLowerCase()) ||
    p.sku.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSyncToStorefront = () => {
    setSyncStatus('Syncing catalog to Next.js Storefront (Port 3001)...');
    setTimeout(() => {
      setSyncStatus('Successfully synced 5 products to Next.js & Strapi!');
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header with Catalog Accent Fuse Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Product & SKU Matrix
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            Manage product specs, pricing, variant matrix, and sync state to the Storefront.
          </p>
        </div>

        {/* Fuse Header Buttons (Catalog Accent #3b82f6) */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton
            label="Sync Storefront"
            icon={<RefreshCw size={18} />}
            onClick={handleSyncToStorefront}
            variant="secondary"
          />
          <HeaderButton
            label="CREATE NEW SKU"
            icon={<Plus size={18} />}
            variant="primary"
            accentColor="#3b82f6"
            accentLight="#60a5fa"
            accentRgb="59, 130, 246"
          />
        </div>
      </div>

      {syncStatus && (
        <div style={{ padding: '12px 16px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', color: '#2563eb', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {syncStatus}
        </div>
      )}

      {/* Catalog Search & Data Grid Table */}
      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '320px', background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '8px', padding: '6px 12px' }}>
            <Search size={16} color="var(--erp-text-dim)" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--erp-text-main)', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>
          <span className="badge badge-blue">{filtered.length} SKUs Listed</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Media</th>
              <th>Product Details</th>
              <th>SKU</th>
              <th>Price / Cost</th>
              <th>Total Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod: ProductItem) => (
              <tr key={prod.id}>
                <td>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--erp-card-border)' }}
                  />
                </td>
                <td>
                  <div style={{ fontWeight: '800', color: 'var(--erp-text-main)' }}>{prod.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--erp-text-dim)', marginTop: '2px' }}>Brand: {prod.brand} • Rating: {prod.rating}★</div>
                </td>
                <td style={{ fontFamily: 'var(--erp-font-mono)', fontWeight: '700', color: '#2563eb' }}>{prod.sku}</td>
                <td>
                  <div style={{ fontWeight: '800', color: '#10b981' }}>${prod.price.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--erp-text-dim)' }}>Cost: ${prod.costPrice.toLocaleString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '800', color: prod.stock < 20 ? '#e11d48' : 'var(--erp-text-main)' }}>
                    {prod.stock} units
                  </div>
                  <div style={{ fontSize: '11px', color: '#d97706' }}>Reserved: {prod.reservedStock}</div>
                </td>
                <td>
                  <span className="badge badge-emerald">PUBLISHED</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '6px', padding: '6px', color: 'var(--erp-text-muted)', cursor: 'pointer' }}>
                      <Eye size={14} />
                    </button>
                    <button style={{ background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '6px', padding: '6px', color: '#2563eb', cursor: 'pointer' }}>
                      <Edit3 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
