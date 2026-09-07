import React, { useState } from 'react';
import { ShoppingBag, Utensils, Phone, Clock, LayoutDashboard, ChefHat } from 'lucide-react';

export default function Navbar({
  orderType,
  tableNumber,
  customerName,
  cartCount,
  onOpenOrderTypeModal,
  onOpenCart,
  isAdminView,
  setIsAdminView,
  activeOrder,
  onOpenTracker
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => setIsAdminView(false)}>
          <div className="brand-icon">
            <ChefHat size={24} />
          </div>
          <div>
            <div className="brand-text">HAPPYBREAK</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              FRESH & ARTISANAL KITCHEN
            </div>
          </div>
        </div>

        {/* Order Mode Pill */}
        {!isAdminView && (
          <div className="order-mode-pill" onClick={onOpenOrderTypeModal} title="Change Order Type">
            {orderType === 'dine-in' ? (
              <>
                <Utensils size={16} style={{ color: '#34d399' }} />
                <span>
                  Dine-In <strong style={{ color: '#34d399' }}>Table #{tableNumber || '1'}</strong>
                </span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} style={{ color: '#fbbf24' }} />
                <span>
                  Takeaway <strong style={{ color: '#fbbf24' }}>{customerName ? customerName : 'Pickup'}</strong>
                </span>
              </>
            )}
            <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '4px' }}>Change</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Active Order Live Tracker */}
          {activeOrder && !isAdminView && (
            <button
              className="btn"
              onClick={onOpenTracker}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '9999px'
              }}
            >
              <Clock size={14} />
              <span>Track Order #{activeOrder.orderId}</span>
            </button>
          )}

          {/* Cart Icon */}
          {!isAdminView && (
            <button className="btn-icon" onClick={onOpenCart} title="View Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          )}

          {/* Admin Toggle */}
          <button
            className={`admin-toggle-btn ${isAdminView ? 'active' : ''}`}
            onClick={() => setIsAdminView(!isAdminView)}
            title="Toggle Staff Admin Dashboard"
          >
            <LayoutDashboard size={18} />
            <span>{isAdminView ? 'Customer View' : 'Staff Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
