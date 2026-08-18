'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, CreditCard, Truck, Check, ArrowLeft, Lock } from 'lucide-react';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order creation
    const newOrderNumber = `NX-${Math.floor(Math.random() * 900000 + 100000)}`;
    setOrderNumber(newOrderNumber);
    clearCart();
    setStep('confirmation');
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div style={{ maxWidth: '680px', margin: '80px auto', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', marginBottom: '12px' }}>Cart is Empty</h1>
        <p style={{ color: '#94A3B8', marginBottom: '24px' }}>Add some hardware items to your cart before checking out.</p>
        <Link href="/products" className="nexus-btn-primary">
          Explore Hardware Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '880px', margin: '40px auto 0', padding: '0 40px' }}>
      {/* Back Link */}
      {step !== 'confirmation' && (
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      )}

      {/* Step Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        {(['shipping', 'payment', 'confirmation'] as CheckoutStep[]).map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '800',
                background: step === s || (['shipping', 'payment', 'confirmation'].indexOf(step) > i)
                  ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                  : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {(['shipping', 'payment', 'confirmation'].indexOf(step) > i) ? <Check size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: step === s ? '#F8FAFC' : '#64748B', textTransform: 'capitalize' }}>
                {s}
              </span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Shipping */}
      {step === 'shipping' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <form onSubmit={handleShippingSubmit} className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', marginBottom: '24px' }}>Shipping Address</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input required type="text" value={shippingForm.fullName} onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })} placeholder="Dr. Evelyn Vance" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input required type="email" value={shippingForm.email} onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })} placeholder="operator@nexus.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Street Address</label>
                <input required type="text" value={shippingForm.street} onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })} placeholder="742 Quantum Way, Suite 400" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>City</label>
                  <input required type="text" value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} placeholder="Palo Alto" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>State</label>
                  <input required type="text" value={shippingForm.state} onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })} placeholder="CA" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>ZIP Code</label>
                  <input required type="text" value={shippingForm.zip} onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })} placeholder="94301" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>

              <button type="submit" className="nexus-btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Continue to Payment <CreditCard size={18} />
              </button>
            </div>
          </form>

          {/* Order Summary Sidebar */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#94A3B8' }}>{item.product.name} ×{item.quantity}</span>
                  <span style={{ color: '#F8FAFC', fontWeight: '700' }}>${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', color: '#F8FAFC' }}>
                <span>Total</span>
                <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
              <Lock size={14} /> Secure 256-bit encrypted checkout
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && (
        <form onSubmit={handlePaymentSubmit} className="glass-panel" style={{ borderRadius: '20px', padding: '28px', maxWidth: '580px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', marginBottom: '24px' }}>Payment Method</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {[
              { id: 'credit_card', label: 'Credit / Debit Card', icon: '💳' },
              { id: 'apple_pay', label: 'Apple Pay / Digital Wallet', icon: '📱' },
              { id: 'crypto', label: 'Express Crypto / BNPL', icon: '⚡' }
            ].map(method => (
              <label key={method.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '12px',
                background: paymentMethod === method.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                border: paymentMethod === method.id ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: '#3B82F6' }} />
                <span style={{ fontSize: '18px' }}>{method.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC' }}>{method.label}</span>
              </label>
            ))}
          </div>

          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', color: '#F8FAFC' }}>
              <span>Total to Charge</span>
              <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setStep('shipping')} className="nexus-btn-secondary" style={{ flex: 1 }}>
              Back
            </button>
            <button type="submit" className="nexus-btn-primary" style={{ flex: 2 }}>
              <Lock size={16} /> Confirm & Place Order
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirmation' && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}>
            <Check size={36} color="#fff" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#F8FAFC', marginBottom: '8px' }}>Order Confirmed</h1>
          <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '8px' }}>Your order has been successfully placed and payment verified.</p>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#3B82F6', marginBottom: '32px', fontFamily: 'var(--font-mono)' }}>
            Order #{orderNumber}
          </div>

          <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', maxWidth: '480px', margin: '0 auto 24px', textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>ORDER LIFECYCLE STATUS</div>
            {['Order Placed', 'Payment Confirmed'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div>
                <span style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '700' }}>{label}</span>
                <span style={{ fontSize: '11px', color: '#64748B', marginLeft: 'auto' }}>Just Now</span>
              </div>
            ))}
            {['Processing', 'Packed', 'Shipped', 'Delivered'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#334155' }}></div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/account" className="nexus-btn-primary">Track Order in Portal</Link>
            <Link href="/products" className="nexus-btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
