import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Flame, Sparkles } from 'lucide-react';

export default function FoodCard({ item, onAddToCart, cartItem }) {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAddToCart(item, qty);
    setQty(1); // Reset card local counter after adding
  };

  const getDietaryBadgeClass = (tag) => {
    switch (tag.toLowerCase()) {
      case 'vegetarian':
      case 'vegan':
        return 'badge-primary';
      case 'gluten-free':
        return 'badge-info';
      case 'chef special':
        return 'badge-purple';
      case 'spicy':
        return 'badge-danger';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      {/* Image container */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(19, 27, 46, 0.95) 0%, transparent 50%)'
          }}
        />

        {/* Popular Tag */}
        {item.popular && (
          <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Sparkles size={12} /> Popular
          </span>
        )}

        {/* Dietary Tags */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {item.dietary && item.dietary.map((tag, idx) => (
            <span key={idx} className={`badge ${getDietaryBadgeClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Details Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h3>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap' }}>
              ₹{item.price.toFixed(2)}
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {item.description}
          </p>
        </div>

        {/* Quantity Controls & Add to Cart */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2px 4px'
              }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  padding: '6px 8px',
                  cursor: 'pointer'
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  padding: '6px 8px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="btn btn-primary"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.88rem' }}
            >
              <ShoppingBag size={16} />
              <span>Add ₹{ (item.price * qty).toFixed(2) }</span>
            </button>
          </div>

          {/* If already in cart, show indicator */}
          {cartItem && (
            <div style={{ fontSize: '0.75rem', color: '#34d399', textAlign: 'center', marginTop: '6px', fontWeight: 600 }}>
              ✓ {cartItem.quantity} in cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
