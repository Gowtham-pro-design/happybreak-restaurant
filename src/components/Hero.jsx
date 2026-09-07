import React from 'react';
import { Sparkles, Utensils, ShieldCheck, Flame, ArrowDown } from 'lucide-react';

export default function Hero({ orderType, tableNumber, customerName, onOpenOrderTypeModal }) {
  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        padding: '3.5rem 2.5rem',
        marginBottom: '2.5rem',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.95), rgba(11, 15, 25, 0.95)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: 'var(--glass-border)',
        boxShadow: 'var(--shadow-main)'
      }}
    >
      {/* Background Subtle Overlay Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
        {/* Active Mode Banner Badge */}
        <div
          onClick={onOpenOrderTypeModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.85rem',
            color: '#a7f3d0',
            marginBottom: '1.25rem',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={16} style={{ color: '#34d399' }} />
          <span>
            Ordering Mode:{' '}
            <strong style={{ color: '#fff', textDecoration: 'underline' }}>
              {orderType === 'dine-in' ? `Dine-In (Table #${tableNumber || '1'})` : `Takeaway Pickup (${customerName || 'Guest'})`}
            </strong>
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 40%, #a7f3d0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Artisanal Flavors, Effortlessly Served.
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Welcome to <strong style={{ color: '#fff' }}>HAPPYBREAK</strong>. Handcrafted gourmet salads, flame-grilled burgers, fresh wraps, and craft drinks made from locally sourced US ingredients.
        </p>

        {/* Action Buttons & Features */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <a href="#menu-section" className="btn btn-primary">
            <Utensils size={18} />
            <span>Explore Menu</span>
            <ArrowDown size={16} />
          </a>

          <button onClick={onOpenOrderTypeModal} className="btn btn-secondary">
            <span>Change Order Mode</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <ShieldCheck size={18} style={{ color: '#34d399' }} />
            <span>100% Fresh Daily</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Flame size={18} style={{ color: '#f59e0b' }} />
            <span>Made to Order</span>
          </div>
        </div>
      </div>
    </section>
  );
}
