import React from 'react';
import { ShoppingBag, Utensils, Clock, LayoutDashboard, ChefHat } from 'lucide-react';

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
        {/* Top / Main Bar */}
        <div className="navbar-top-row">
          {/* Brand */}
          <div className="brand" onClick={() => setIsAdminView(false)}>
            <div className="brand-icon">
              <ChefHat size={22} />
            </div>
            <div className="brand-titles">
              <div className="brand-text">HAPPYBREAK</div>
              <div className="brand-subtext">FRESH & ARTISANAL KITCHEN</div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="nav-actions">
            {/* Active Order Live Tracker */}
            {activeOrder && !isAdminView && (
              <button
                className="btn btn-tracker-nav"
                onClick={onOpenTracker}
                title={`Track Order #${activeOrder.orderId}`}
              >
                <Clock size={14} />
                <span className="tracker-text">#{activeOrder.orderId}</span>
              </button>
            )}

            {/* Cart Icon */}
            {!isAdminView && (
              <button className="btn-icon cart-btn-nav" onClick={onOpenCart} title="View Cart">
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
              <LayoutDashboard size={16} />
              <span className="admin-btn-text">{isAdminView ? 'Customer' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Order Mode Pill Bar (Desktop inline, Mobile dedicated clean strip) */}
        {!isAdminView && (
          <div className="order-mode-container">
            <div className="order-mode-pill" onClick={onOpenOrderTypeModal} title="Change Order Type">
              {orderType === 'dine-in' ? (
                <>
                  <Utensils size={15} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span className="order-mode-label">
                    Dine-In <strong style={{ color: '#34d399' }}>Table #{tableNumber || '1'}</strong>
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
                  <span className="order-mode-label">
                    Takeaway <strong style={{ color: '#fbbf24' }}>{customerName || 'Pickup'}</strong>
                  </span>
                </>
              )}
              <span className="order-mode-change-badge">Change</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
