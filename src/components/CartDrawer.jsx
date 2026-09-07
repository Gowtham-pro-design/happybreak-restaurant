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

  const usTaxPresets = [
    { label: 'New York City (8.875%)', value: 0.08875 },
    { label: 'California - Los Angeles (9.50%)', value: 0.095 },
    { label: 'Illinois - Chicago (10.25%)', value: 0.1025 },
    { label: 'Florida - Miami (7.00%)', value: 0.07 },
    { label: 'Texas - Austin (8.25%)', value: 0.0825 },
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="modal-overlay fade-in" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="modal-content"
        style={{
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '460px',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem'
        }}
      >
        {/* Header */}
        <div>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={22} style={{ color: '#34d399' }} />
              <div className="modal-title">Your Order Cart</div>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          {/* Order Type Banner */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: orderType === 'dine-in' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: orderType === 'dine-in' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >
            <span>
              Order Type:{' '}
              <strong style={{ color: orderType === 'dine-in' ? '#34d399' : '#fbbf24' }}>
                {orderType === 'dine-in' ? `Dine-In (Table #${tableNumber || '1'})` : `Takeaway (${customerName || 'Pickup'})`}
              </strong>
            </span>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={54} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <h4>Your cart is currently empty</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Add delicious items from the menu to start!</p>
            </div>
          ) : (
            <div style={{ maxHeight: 'calc(100vh - 430px)', overflowY: 'auto', paddingRight: '4px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>${item.price.toFixed(2)} each</div>
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
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#34d399' }}>${(item.price * item.quantity).toFixed(2)}</div>
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
                <Calculator size={14} style={{ color: '#34d399' }} /> Sales Tax Region (US)
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                value={taxRate}
                onChange={(e) => onUpdateTaxRate(parseFloat(e.target.value))}
              >
                {usTaxPresets.map((taxItem, i) => (
                  <option key={i} value={taxItem.value}>{taxItem.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: 'white', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sales Tax ({(taxRate * 100).toFixed(3)}%)</span>
                <span style={{ color: 'white' }}>${tax.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>
                <span>Total Amount</span>
                <span style={{ color: '#34d399' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
              <button onClick={onClearCart} className="btn btn-secondary" style={{ padding: '10px 14px' }} title="Clear Cart">
                <Trash2 size={16} />
              </button>
              <button onClick={onProceedToCheckout} className="btn btn-primary" style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem' }}>
                <span>Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
