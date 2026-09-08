import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingBag, CheckCircle, X, MapPin, Phone, User } from 'lucide-react';

export default function OrderTypeModal({
  isOpen,
  onClose,
  currentOrderType,
  currentTableNumber,
  currentCustomerName,
  currentCustomerPhone,
  onSaveOrderType
}) {
  const [orderType, setOrderType] = useState(currentOrderType || 'dine-in');
  const [tableNumber, setTableNumber] = useState(currentTableNumber || '1');
  const [customerName, setCustomerName] = useState(currentCustomerName || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomerPhone || '');

  // Check URL query parameters for QR code scanning (e.g. ?table=12)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setOrderType('dine-in');
      setTableNumber(tableParam);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderType === 'takeaway' && (!customerName.trim() || !customerPhone.trim())) {
      alert('Please fill in your name and phone number for Takeaway orders.');
      return;
    }
    onSaveOrderType({
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : '',
      customerName: orderType === 'takeaway' ? customerName : `Table ${tableNumber}`,
      customerPhone: orderType === 'takeaway' ? customerPhone : ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content order-type-modal-content">
        <div className="modal-header">
          <div className="modal-title">Select Order Type</div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
          Choose how you would like to receive your food order today:
        </p>

        {/* Order Type Selection Cards */}
        <div className="order-type-cards-grid">
          {/* Dine-In Selection Card */}
          <div
            onClick={() => setOrderType('dine-in')}
            className={`order-type-card ${orderType === 'dine-in' ? 'active-dine-in' : ''}`}
          >
            {orderType === 'dine-in' && (
              <CheckCircle size={18} className="order-type-check-icon" style={{ color: '#10b981' }} />
            )}
            <Utensils size={28} style={{ color: orderType === 'dine-in' ? '#10b981' : 'var(--text-muted)' }} />
            <h4 style={{ fontSize: '1rem', marginTop: '6px', marginBottom: '2px' }}>DINE-IN</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eat at restaurant table</p>
          </div>

          {/* Takeaway Selection Card */}
          <div
            onClick={() => setOrderType('takeaway')}
            className={`order-type-card ${orderType === 'takeaway' ? 'active-takeaway' : ''}`}
          >
            {orderType === 'takeaway' && (
              <CheckCircle size={18} className="order-type-check-icon" style={{ color: '#f59e0b' }} />
            )}
            <ShoppingBag size={28} style={{ color: orderType === 'takeaway' ? '#f59e0b' : 'var(--text-muted)' }} />
            <h4 style={{ fontSize: '1rem', marginTop: '6px', marginBottom: '2px' }}>TAKEAWAY</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pickup at counter</p>
          </div>
        </div>

        {/* Dynamic Options depending on Order Type */}
        <form onSubmit={handleSubmit}>
          {orderType === 'dine-in' ? (
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} style={{ color: '#10b981' }} /> Table Number
              </label>
              <select
                className="form-select"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Table #{i + 1}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '6px' }}>
                Check the QR code or stand label on your dining table.
              </p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} style={{ color: '#f59e0b' }} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Miller"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={16} style={{ color: '#f59e0b' }} /> Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. (555) 234-5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-modal-confirm">
              Confirm Selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
