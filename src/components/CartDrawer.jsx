import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Calculator } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  tableNumber,
  customerName,
  onProceedToCheckout,
  taxRate,
  onUpdateTaxRate
}) {
  if (!isOpen) return null;

  const taxPresets = [
    { label: 'Standard Restaurant GST (5.0%)', value: 0.05 },
    { label: 'AC Dining GST (5.0%)', value: 0.05 },
    { label: 'Zero Tax (0%)', value: 0.0 },
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="modal-overlay fade-in cart-drawer-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="glass-card cart-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          background: '#0e1424',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Order Cart</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {cart.reduce((s, i) => s + i.quantity, 0)} items selected
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Order Mode summary bar */}
        <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', margin: '1rem 0', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Fulfillment:</span>
          <span style={{ fontWeight: 600, color: orderType === 'dine-in' ? '#34d399' : '#fbbf24' }}>
            {orderType === 'dine-in' ? `Dine-In (Table #${tableNumber || '1'})` : `Takeaway (${customerName || 'Pickup'})`}
          </span>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Add artisanal dishes and craft drinks from the menu.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '54px', height: '54px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>{item.name}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>₹{item.price.toFixed(2)} each</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '2px 4px' }}>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '60px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#34d399' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => onRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.72rem', marginTop: '2px' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.25rem', marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Calculator size={14} style={{ color: '#34d399' }} /> Applicable Taxes (GST)
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                value={taxRate}
                onChange={(e) => onUpdateTaxRate(parseFloat(e.target.value))}
              >
                {taxPresets.map((taxItem, i) => (
                  <option key={i} value={taxItem.value}>{taxItem.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: 'white', fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST ({(taxRate * 100).toFixed(1)}%)</span>
                <span style={{ color: 'white' }}>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>
                <span>Total Amount</span>
                <span style={{ color: '#34d399' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
              <button onClick={onClearCart} className="btn btn-secondary" style={{ padding: '10px 14px' }} title="Clear Cart">
                <Trash2 size={16} />
              </button>
              <button
                onClick={onProceedToCheckout}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem' }}
              >
                <span>Checkout (₹{total.toFixed(2)})</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
