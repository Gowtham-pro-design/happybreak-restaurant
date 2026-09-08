import React, { useState, useEffect } from 'react';
import { ChefHat, Utensils, ShoppingBag, Clock, ShieldCheck, DollarSign, RefreshCw, Phone } from 'lucide-react';

export default function AdminDashboard({ onSwitchToCustomer }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) setOrders(prev => prev.map(o => o.orderId === orderId ? data.order : o));
    } catch (err) {
      alert(`Error updating order status: ${err.message}`);
    }
  };

  const handleMarkPaymentPaid = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' })
      });
      const data = await res.json();
      if (data.success) setOrders(prev => prev.map(o => o.orderId === orderId ? data.order : o));
    } catch (err) {
      alert(`Error updating payment status: ${err.message}`);
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
              Real-Time Order Pipeline • Dine-In &amp; Takeaway
            </p>
          </div>
        </div>
        <div className="admin-header-actions">
          <button
            onClick={() => { setIsRefreshing(true); fetchOrders(); }}
            className="btn btn-secondary admin-action-btn"
          >
            <RefreshCw size={16} />
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
    </div>
  );
}
