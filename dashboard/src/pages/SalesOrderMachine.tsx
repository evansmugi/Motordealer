import React, { useState } from 'react';
import { HeaderButton } from '../components/common/HeaderButton';
import { ORDERS as initialOrders, type OrderItem } from '../data/mock-dataset';
import { Plus, CheckCircle2, ChevronRight, Printer } from 'lucide-react';

export const SalesOrderMachine: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const stateTransitions: Record<OrderItem['orderStatus'], OrderItem['orderStatus'] | null> = {
    PENDING: 'PAID',
    PAYMENT_PENDING: 'PAID',
    PAID: 'PROCESSING',
    PROCESSING: 'PACKED',
    PACKED: 'SHIPPED',
    SHIPPED: 'DELIVERED',
    DELIVERED: null,
    CANCELLED: null,
    REFUNDED: null
  };

  const advanceOrderState = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const nextState = stateTransitions[ord.orderStatus];
        if (nextState) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              status: nextState,
              timestamp: new Date().toISOString(),
              note: `Order state transitioned to ${nextState} via AETHEL ERP State Machine.`
            }
          ];
          setStatusMessage(`Order ${ord.orderNumber} successfully advanced from ${ord.orderStatus} → ${nextState}`);
          setTimeout(() => setStatusMessage(null), 3500);
          return { ...ord, orderStatus: nextState, timeline: updatedTimeline };
        }
      }
      return ord;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Sales & Order Fulfillment Machine
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--erp-text-muted)', marginTop: '4px' }}>
            Controlled transactional order state lifecycle execution & invoice generation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <HeaderButton
            label="Print Batch Invoices"
            icon={<Printer size={16} />}
            variant="secondary"
          />
          <HeaderButton
            label="CREATE NEW ORDER"
            icon={<Plus size={18} />}
            variant="primary"
            accentColor="#84cc16"
            accentLight="#a3e635"
            accentRgb="132, 204, 22"
          />
        </div>
      </div>

      {statusMessage && (
        <div style={{ padding: '12px 16px', background: 'rgba(132, 204, 22, 0.15)', border: '1px solid rgba(132, 204, 22, 0.3)', borderRadius: '10px', color: '#65a30d', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {statusMessage}
        </div>
      )}

      <div className="erp-card">
        <div className="erp-card-header">
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--erp-text-main)' }}>Order Fulfillment Pipeline</div>
          <span className="badge badge-emerald">STATE MACHINE ACTIVE</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Customer</th>
              <th>Items Purchased</th>
              <th>Total Amount</th>
              <th>Current State</th>
              <th>State Machine Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord: OrderItem) => {
              const nextState = stateTransitions[ord.orderStatus];
              return (
                <tr key={ord.id}>
                  <td style={{ fontFamily: 'var(--erp-font-mono)', fontWeight: '700', color: '#65a30d' }}>{ord.orderNumber}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--erp-text-main)' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--erp-text-dim)' }}>{ord.customerEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)' }}>{ord.items.map((i: { name: string; quantity: number }) => `${i.name} (x${i.quantity})`).join(', ')}</div>
                  </td>
                  <td style={{ fontWeight: '800', color: '#10b981' }}>${ord.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'SHIPPED' ? 'badge-emerald' : 'badge-amber'}`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td>
                    {nextState ? (
                      <button
                        onClick={() => advanceOrderState(ord.id)}
                        style={{
                          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          color: '#000',
                          fontSize: '11px',
                          fontWeight: '850',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(132, 204, 22, 0.3)'
                        }}
                      >
                        Advance to {nextState} <ChevronRight size={14} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--erp-text-dim)', fontWeight: '700' }}>Terminal State</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      style={{ background: 'var(--erp-bg-dark)', border: '1px solid var(--erp-card-border)', borderRadius: '6px', padding: '6px 12px', color: 'var(--erp-text-muted)', fontSize: '12px', cursor: 'pointer' }}
                    >
                      View Drawer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', background: 'var(--erp-card-bg)', borderLeft: '1px solid var(--erp-card-border)', padding: '28px', zIndex: 1000, overflowY: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--erp-text-main)', margin: 0 }}>
              Order Drawer: {selectedOrder.orderNumber}
            </h2>
            <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: 'var(--erp-text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', background: 'var(--erp-bg-dark)', borderRadius: '10px', border: '1px solid var(--erp-card-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--erp-text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Customer Shipping Destination</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--erp-text-main)', marginTop: '4px' }}>{selectedOrder.customerName}</div>
              <div style={{ fontSize: '12px', color: 'var(--erp-text-muted)', marginTop: '2px' }}>
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--erp-bg-dark)', borderRadius: '10px', border: '1px solid var(--erp-card-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--erp-text-dim)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>Audit State Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedOrder.timeline.map((item: { status: string; timestamp: string; note: string }, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#65a30d', marginTop: '4px' }}></div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--erp-text-main)' }}>{item.status}</div>
                      <div style={{ fontSize: '11px', color: 'var(--erp-text-dim)' }}>{new Date(item.timestamp).toLocaleString()} — {item.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
