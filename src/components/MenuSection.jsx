import React, { useState } from 'react';
import FoodCard from './FoodCard';
import { Search, Filter, Utensils, Salad, Beef, Sandwich, Coffee, Cake } from 'lucide-react';

function WrapIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  );
}

export default function MenuSection({ categories, menuItems, onAddToCart, cart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'salads': return <Salad size={18} />;
      case 'burgers': return <Beef size={18} />;
      case 'sandwiches': return <Sandwich size={18} />;
      case 'wraps': return <WrapIcon size={18} />;
      case 'drinks': return <Coffee size={18} />;
      case 'desserts': return <Cake size={18} />;
      default: return <Utensils size={18} />;
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (dietaryFilter !== 'all') {
      if (!item.dietary || !item.dietary.some(d => d.toLowerCase() === dietaryFilter.toLowerCase())) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <section id="menu-section" style={{ marginTop: '1rem' }}>
      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '1.5rem',
          scrollbarWidth: 'none'
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#34d399' : 'var(--text-muted)'
              }}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Dietary Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'rgba(19, 27, 46, 0.6)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--glass-border)'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search items, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Dietary:
          </span>
          {['all', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Chef Special', 'Spicy'].map((d) => (
            <button
              key={d}
              onClick={() => setDietaryFilter(d)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: dietaryFilter === d ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                color: dietaryFilter === d ? '#0b0f19' : 'var(--text-muted)'
              }}
            >
              {d === 'all' ? 'All Items' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Utensils size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3>No dishes found matching your search.</h3>
          <p style={{ fontSize: '0.88rem' }}>Try clearing filters or searching for something else.</p>
        </div>
      ) : (
        <div className="food-grid">
          {filteredItems.map(item => {
            const cartItem = cart.find(c => c.id === item.id);
            return (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                cartItem={cartItem}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
