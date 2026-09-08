import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import OrderTypeModal from './components/OrderTypeModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import AdminDashboard from './components/AdminDashboard';
import { categories as defaultCategories, menuItems as defaultMenuItems } from './data/menuData.js';
import './App.css';

export default function App() {
  // State
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const [tableNumber, setTableNumber] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [categories, setCategories] = useState(defaultCategories);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(0.05); // Standard Restaurant GST 5%

  const [activeOrder, setActiveOrder] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);

  // Modals
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Auto detect Table Number from URL query parameter (e.g. ?table=12 for Dine-In QR scanning)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setOrderType('dine-in');
      setTableNumber(tableParam);
    }
  }, []);

  // Fetch Menu from API
  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.categories) setCategories(data.categories);
          if (data.items) setMenuItems(data.items);
        }
      })
      .catch(err => console.log('Using local fallback menu:', err));
  }, []);

  // Cart operations
  const handleAddToCart = (item, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + qty } : c);
      } else {
        return [...prev, { ...item, quantity: qty }];
      }
    });
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order Fulfillment Type
  const handleSaveOrderType = (config) => {
    setOrderType(config.orderType);
    if (config.tableNumber) setTableNumber(config.tableNumber);
    if (config.customerName) setCustomerName(config.customerName);
    if (config.customerPhone) setCustomerPhone(config.customerPhone);
  };

  // Checkout & Ordering
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder) => {
    setActiveOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsTrackerOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        orderType={orderType}
        tableNumber={tableNumber}
        customerName={customerName}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenOrderTypeModal={() => setIsOrderTypeModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        activeOrder={activeOrder}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main View: Customer Ordering or Staff Admin Dashboard */}
      {isAdminView ? (
        <main className="main-content">
          <AdminDashboard onSwitchToCustomer={() => setIsAdminView(false)} />
        </main>
      ) : (
        <main className="main-content">
          <Hero
            orderType={orderType}
            tableNumber={tableNumber}
            customerName={customerName}
            onOpenOrderTypeModal={() => setIsOrderTypeModalOpen(true)}
          />

          <MenuSection
            categories={categories}
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            cart={cart}
          />
        </main>
      )}

      {/* Mobile Sticky Floating Cart Bar */}
      {!isAdminView && cart.length > 0 && (
        <div className="mobile-cart-bottom-bar" onClick={() => setIsCartOpen(true)}>
          <div className="mobile-cart-info">
            <div className="mobile-cart-pill-icon">
              🛒
            </div>
            <div>
              <div className="mobile-cart-items-text">
                {cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'}
              </div>
              <div className="mobile-cart-price-text">
                ₹{cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mobile-cart-cta">
            <span>View Cart</span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* Footer */}
      {!isAdminView && (
        <footer className="footer">
          <div className="footer-content">
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.02em' }}>HAPPYBREAK</div>
            <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
              Fresh &amp; Artisanal Kitchen • Dine-In &amp; Takeaway
            </div>

            <div className="footer-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', margin: '1.75rem 0', textAlign: 'left', width: '100%' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: '6px', fontSize: '0.9rem' }}>📍 Location &amp; Contact</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  42 Artisanal Avenue, Food Street<br />
                  Bangalore, Karnataka 560001<br />
                  Phone: +91 98765 43210
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: '6px', fontSize: '0.9rem' }}>⏰ Service Hours</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Monday – Sunday: 10:00 AM – 11:00 PM<br />
                  Kitchen Last Order: 10:30 PM<br />
                  Dine-In • Counter Pickup
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: '6px', fontSize: '0.9rem' }}>💳 Payment Modes</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Instant UPI (GPay, PhonePe, Paytm)<br />
                  Visa, Mastercard &amp; RuPay<br />
                  Pay at Counter Accepted
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', width: '100%' }}>
              © {new Date().getFullYear()} HAPPYBREAK Artisanal Kitchen. All Rights Reserved. Standard 5% GST Included.
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <OrderTypeModal
        isOpen={isOrderTypeModalOpen}
        onClose={() => setIsOrderTypeModalOpen(false)}
        currentOrderType={orderType}
        currentTableNumber={tableNumber}
        currentCustomerName={customerName}
        currentCustomerPhone={customerPhone}
        onSaveOrderType={handleSaveOrderType}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        tableNumber={tableNumber}
        customerName={customerName}
        onProceedToCheckout={handleProceedToCheckout}
        taxRate={taxRate}
        onUpdateTaxRate={setTaxRate}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        orderType={orderType}
        tableNumber={tableNumber}
        customerName={customerName}
        customerPhone={customerPhone}
        taxRate={taxRate}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={activeOrder}
      />
    </div>
  );
}
