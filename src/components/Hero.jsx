import React from 'react';
import { Sparkles, Utensils, ShieldCheck, Flame, ArrowDown } from 'lucide-react';

export default function Hero({ orderType, tableNumber, customerName, onOpenOrderTypeModal }) {
  return (
    <section className="hero-section">
      {/* Background Subtle Overlay Glow */}
      <div className="hero-overlay-glow" />

      <div className="hero-content">
        {/* Active Mode Banner Badge */}
        <div
          onClick={onOpenOrderTypeModal}
          className="hero-mode-badge"
          title="Click to change order mode"
        >
          <Sparkles size={15} style={{ color: '#34d399', flexShrink: 0 }} />
          <span>
            Mode:{' '}
            <strong style={{ color: '#fff', textDecoration: 'underline' }}>
              {orderType === 'dine-in' ? `Dine-In (Table #${tableNumber || '1'})` : `Takeaway (${customerName || 'Pickup'})`}
            </strong>
          </span>
        </div>

        <h1 className="hero-title">
          Artisanal Flavors, Effortlessly Served.
        </h1>

        <p className="hero-subtitle">
          Welcome to <strong style={{ color: '#fff' }}>HAPPYBREAK</strong>. Handcrafted gourmet salads, flame-grilled burgers, fresh wraps, and craft drinks made from locally sourced ingredients.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <a href="#menu-section" className="btn btn-primary hero-btn">
            <Utensils size={18} />
            <span>Explore Menu</span>
            <ArrowDown size={16} />
          </a>

          <button onClick={onOpenOrderTypeModal} className="btn btn-secondary hero-btn">
            <span>Change Order Mode</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="hero-features">
          <div className="hero-feature-item">
            <ShieldCheck size={18} style={{ color: '#34d399' }} />
            <span>100% Fresh Daily</span>
          </div>
          <div className="hero-feature-item">
            <Flame size={18} style={{ color: '#f59e0b' }} />
            <span>Made to Order</span>
          </div>
        </div>
      </div>
    </section>
  );
}
