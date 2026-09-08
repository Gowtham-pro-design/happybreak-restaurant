import React, { useState, useEffect } from 'react';
import { ChefHat, Utensils, ShoppingBag, Clock, ShieldCheck, DollarSign, RefreshCw, Phone, QrCode, X, Copy, Printer, Check, ExternalLink } from 'lucide-react';

export default function AdminDashboard({ onSwitchToCustomer }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Table QR Code Generator Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrTable, setSelectedQrTable] = useState('1');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchOrders = async () => {
    let combined = [];
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        combined = [...data.orders];
      }
    } catch (err) {
      console.warn('API fetch orders error, falling back to persistent storage:', err);
    }

    // Merge with localStorage orders for resilient offline/serverless persistence
    try {
      const local = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
      local.forEach(lo => {
        if (!combined.some(o => o.orderId === lo.orderId)) {
          combined.push(lo);
        }
      });
      // Save combined back to localStorage
      localStorage.setItem('happybreak_orders', JSON.stringify(combined));
    } catch (e) {
      console.warn('localStorage read/write error:', e);
    }

    // Sort newest first
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(combined);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));

    // Update in localStorage
    try {
      const local = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
      const updated = local.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem('happybreak_orders', JSON.stringify(updated));
    } catch (e) {}

    // Call API
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn('Status update API call failed, saved locally:', err);
    }
  };

  const handleMarkPaymentPaid = async (orderId) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, paymentStatus: 'PAID' } : o));

    // Update in localStorage
    try {
      const local = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
      const updated = local.map(o => o.orderId === orderId ? { ...o, paymentStatus: 'PAID' } : o);
      localStorage.setItem('happybreak_orders', JSON.stringify(updated));
    } catch (e) {}

    // Call API
    try {
      await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' })
      });
    } catch (err) {
      console.warn('Payment update API call failed, saved locally:', err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (typeFilter !== 'all' && o.orderType !== typeFilter) return false;
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    return true;
  });

  const activeOrdersCount = orders.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.orderStatus)).length;
  const dineInCount = orders.filter(o => o.orderType === 'dine-in').length;
  const takeawayCount = orders.filter(o => o.orderType === 'takeaway').length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0);
  const pendingOfflineCount = orders.filter(o => o.paymentStatus === 'PAY_AT_RESTAURANT').length;

  // QR URL for current domain
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://happybreak-xb9j.vercel.app';
  const currentTableUrl = `${baseUrl}/?table=${selectedQrTable}`;
  const tableQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentTableUrl)}&color=10b981&bgcolor=0e1424`;

  const copyTableLink = () => {
    navigator.clipboard.writeText(currentTableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="admin-dashboard-container fade-in">
      {/* Admin Header Banner */}
      <div className="admin-header-banner">
        <div className="admin-header-left">
          <div className="admin-header-icon">
            <ChefHat size={26} />
          </div>
          <div>
            <h2 className="admin-header-title">Kitchen &amp; Service Dashboard</h2>
            <p className="admin-header-subtitle">
              Real-Time Order Pipeline • Dine-In &amp; Takeaway Management
            </p>
          </div>
        </div>
        <div className="admin-header-actions">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="btn btn-secondary admin-action-btn"
            style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}
            title="Generate Dining Table QR Codes"
          >
            <QrCode size={16} />
            <span>Table QRs</span>
          </button>
          <button
            onClick={() => { setIsRefreshing(true); fetchOrders(); }}
            className="btn btn-secondary admin-action-btn"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={onSwitchToCustomer} className="btn btn-primary admin-action-btn">
            ← Customer App
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="admin-stats-grid">
        <div className="glass-card admin-stat-card">
          <div className="admin-stat-label">Active Orders</div>
          <div className="admin-stat-value" style={{ color: '#3b82f6' }}>{activeOrdersCount}</div>
        </div>
        <div className="glass-card admin-stat-card">
          <div className="admin-stat-label">Dine-In vs Takeaway</div>
          <div className="admin-stat-split">
            <span style={{ color: '#34d399' }}>🍽️ {dineInCount} Dine-In</span>
            <span style={{ color: '#fbbf24' }}>🛍️ {takeawayCount} Takeaway</span>
          </div>
        </div>
        <div className="glass-card admin-stat-card">
          <div className="admin-stat-label">Total Paid Revenue</div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>₹{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-card admin-stat-card">
          <div className="admin-stat-label">Pending Payments</div>
          <div className="admin-stat-value" style={{ color: '#f59e0b' }}>{pendingOfflineCount}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-toolbar">
        <div className="admin-filter-group">
          <span className="admin-filter-label">Type:</span>
          {['all', 'dine-in', 'takeaway'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`admin-filter-btn ${typeFilter === t ? 'active-purple' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="admin-filter-group admin-status-group">
          <span className="admin-filter-label">Status:</span>
          <div className="admin-status-pills">
            {['all', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`admin-filter-btn admin-status-btn ${statusFilter === s ? 'active-green' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="admin-empty-state">Loading live orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <ChefHat size={48} style={{ margin: '0 auto 12px', opacity: 0.4, display: 'block' }} />
          <h3>No matching orders found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            New customer orders will appear here automatically every 4 seconds.
          </p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {filteredOrders.map(order => (
            <div
              key={order.orderId}
              className="glass-card admin-order-card"
              style={{ borderLeft: order.orderType === 'dine-in' ? '4px solid #34d399' : '4px solid #f59e0b' }}
            >
              <div>
                {/* Order Header */}
                <div className="admin-order-header">
                  <div className="admin-order-id">Order #{order.orderId}</div>
                  <div className="admin-order-time">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Order Type */}
                <div className="admin-order-type-row">
                  {order.orderType === 'dine-in' ? (
                    <div className="admin-order-type-dine">
                      <Utensils size={16} /> Dine-In | Table #{order.tableNumber}
                    </div>
                  ) : (
                    <div>
                      <div className="admin-order-type-takeaway">
                        <ShoppingBag size={16} /> Takeaway | {order.customerName}
                      </div>
                      {order.customerPhone && (
                        <div className="admin-order-phone">
                          <Phone size={12} /> {order.customerPhone}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="admin-badges-row">
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                    Status: {order.orderStatus}
                  </span>
                  <span
                    className={`badge ${order.paymentStatus === 'PAID' ? 'badge-primary' : 'badge-warning'}`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {order.paymentStatus === 'PAID' ? '✓ PAID' : '⏳ Pending'}{' '}
                    ({order.paymentMethod === 'upi' ? 'UPI' : order.paymentMethod === 'stripe_online' ? 'Card' : 'At Spot'})
                  </span>
                </div>

                {/* Items */}
                <div className="admin-items-box">
                  <div className="admin-items-header">ORDERED ITEMS:</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="admin-item-row">
                      <span><strong>{item.quantity}×</strong> {item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="admin-item-total">
                    <span>Total Amount:</span>
                    <span style={{ color: '#34d399' }}>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="admin-order-notes">Note: "{order.notes}"</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="admin-order-actions">
                {order.paymentStatus === 'PAY_AT_RESTAURANT' && (
                  <button
                    onClick={() => handleMarkPaymentPaid(order.orderId)}
                    className="btn admin-pay-btn"
                  >
                    <DollarSign size={16} /> Mark Payment as PAID
                  </button>
                )}
                <div className="admin-status-actions">
                  {order.orderStatus === 'PENDING' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'CONFIRMED')} className="btn btn-primary admin-sm-btn">Accept Order</button>
                  )}
                  {order.orderStatus === 'CONFIRMED' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'PREPARING')} className="btn btn-primary admin-sm-btn">Start Preparing</button>
                  )}
                  {order.orderStatus === 'PREPARING' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'READY')} className="btn btn-primary admin-sm-btn">Mark Ready</button>
                  )}
                  {order.orderStatus === 'READY' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'COMPLETED')} className="btn btn-primary admin-sm-btn">Complete Order</button>
                  )}
                  {!['COMPLETED', 'CANCELLED'].includes(order.orderStatus) && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'CANCELLED')} className="btn btn-secondary admin-sm-btn admin-cancel-btn">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table QR Code Generator Modal */}
      {isQrModalOpen && (
        <div className="modal-overlay fade-in">
          <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={20} style={{ color: '#34d399' }} />
                <div className="modal-title">Table QR Code Generator</div>
              </div>
              <button className="close-btn" onClick={() => setIsQrModalOpen(false)}><X size={20} /></button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'left' }}>
              Customers who scan this QR code on their phone will instantly open the menu with their table number pre-selected.
            </p>

            {/* Table Selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Select Dining Table:</label>
              <select
                className="form-select"
                value={selectedQrTable}
                onChange={(e) => setSelectedQrTable(e.target.value)}
                style={{ width: '130px', fontWeight: 700, color: '#34d399' }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Table #{i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Printable QR Card Frame */}
            <div
              id="printable-qr-card"
              style={{
                background: '#0e1424',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                margin: '0 auto 1.25rem',
                maxWidth: '280px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 800, letterSpacing: '0.1em' }}>HAPPYBREAK</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '4px 0 12px' }}>
                TABLE #{selectedQrTable}
              </div>

              <img
                src={tableQrImg}
                alt={`Table ${selectedQrTable} QR`}
                style={{ width: '180px', height: '180px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'block', margin: '0 auto' }}
              />

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                Scan with camera to view menu &amp; order
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={copyTableLink} className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.85rem' }}>
                {copiedLink ? <Check size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Table Link'}</span>
              </button>
              <button
                onClick={() => window.open(currentTableUrl, '_blank')}
                className="btn btn-primary"
                style={{ padding: '9px 16px', fontSize: '0.85rem' }}
              >
                <ExternalLink size={16} />
                <span>Test Live Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
