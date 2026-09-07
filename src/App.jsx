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
  const [taxRate, setTaxRate] = useState(0.08875); // US default tax rate 8.875%

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
    } else {
      setCart(prev => prev.map(c => c.id === itemId ? { ...c, quantity: newQty } : c));
    }
  };

  const handleRemoveItem = (itemId) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSaveOrderType = (data) => {
    setOrderType(data.orderType);
    if (data.tableNumber) setTableNumber(data.tableNumber);
    if (data.customerName) setCustomerName(data.customerName);
    if (data.customerPhone) setCustomerPhone(data.customerPhone);
  };

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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        orderType={orderType}
        tableNumber={tableNumber}
        customerName={customerName}
        cartCount={totalCartCount}
        onOpenOrderTypeModal={() => setIsOrderTypeModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        activeOrder={activeOrder}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main View: Admin Dashboard OR Customer Ordering View */}
      {isAdminView ? (
        <AdminDashboard onSwitchToCustomer={() => setIsAdminView(false)} />
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

      {/* Footer */}
      {!isAdminView && (
        <footer className="footer">
          <div className="footer-content">
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>HAPPYBREAK</div>
            <div>Fresh & Artisanal Modern US Kitchen • Dine-In & Takeaway Platform</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '8px' }}>
              © {new Date().getFullYear()} HAPPYBREAK Inc. All Rights Reserved. US Sales Tax & Stripe Payments Compliant.
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
