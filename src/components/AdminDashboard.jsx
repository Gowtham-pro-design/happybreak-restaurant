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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }} className="fade-in">
      {/* Admin Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <ChefHat size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Kitchen & Service Admin Dashboard</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-Time Order Pipeline • Dine-In & Takeaway Management
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => { setIsRefreshing(true); fetchOrders(); }} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button onClick={onSwitchToCustomer} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Back to Ordering App
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Active Orders</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6' }}>{activeOrdersCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Dine-In vs Takeaway</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span style={{ color: '#34d399' }}>🍽️ {dineInCount} Dine-In</span>
            <span style={{ color: '#fbbf24' }}>🛍️ {takeawayCount} Takeaway</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Paid Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Pending Offline Payments</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{pendingOfflineCount}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'rgba(19, 27, 46, 0.7)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: 'var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Order Type:</span>
          {['all', 'dine-in', 'takeaway'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none',
              background: typeFilter === t ? '#8b5cf6' : 'rgba(255, 255, 255, 0.08)',
              color: typeFilter === t ? 'white' : 'var(--text-muted)', textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          {['all', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none',
              background: statusFilter === s ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
              color: statusFilter === s ? '#0b0f19' : 'var(--text-muted)'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading live orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <ChefHat size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3>No matching orders found</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredOrders.map(order => (
            <div key={order.orderId} className="glass-card" style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: order.orderType === 'dine-in' ? '4px solid #34d399' : '4px solid #f59e0b'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Order #{order.orderId}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {order.orderType === 'dine-in' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700 }}>
                      <Utensils size={16} /> Dine-In | Table #{order.tableNumber}
                    </div>
                  ) : (
                    <div style={{ color: '#fbbf24', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShoppingBag size={16} /> Takeaway | {order.customerName}
                      </div>
                      {order.customerPhone && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Phone size={12} /> {order.customerPhone}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>Status: {order.orderStatus}</span>
                  <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.75rem' }}>
                    Payment: {order.paymentStatus} ({order.paymentMethod === 'upi' ? 'UPI' : order.paymentMethod === 'stripe_online' ? 'Card' : 'Pay at Spot'})
                  </span>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>ORDERED ITEMS:</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                      <span><strong>{item.quantity}×</strong> {item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', marginTop: '6px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>Total Amount:</span>
                    <span style={{ color: '#34d399' }}>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontStyle: 'italic', marginBottom: '1rem' }}>
                    Note: "{order.notes}"
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.paymentStatus === 'PAY_AT_RESTAURANT' && (
                  <button onClick={() => handleMarkPaymentPaid(order.orderId)} className="btn" style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '8px 12px', fontSize: '0.85rem', width: '100%'
                  }}>
                    <DollarSign size={16} /> Mark Payment as PAID
                  </button>
                )}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {order.orderStatus === 'PENDING' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'CONFIRMED')} className="btn btn-primary" style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}>Accept Order</button>
                  )}
                  {order.orderStatus === 'CONFIRMED' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'PREPARING')} className="btn btn-primary" style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}>Start Preparing</button>
                  )}
                  {order.orderStatus === 'PREPARING' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'READY')} className="btn btn-primary" style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}>Mark Ready</button>
                  )}
                  {order.orderStatus === 'READY' && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'COMPLETED')} className="btn btn-primary" style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}>Complete Order</button>
                  )}
                  {!['COMPLETED', 'CANCELLED'].includes(order.orderStatus) && (
                    <button onClick={() => handleUpdateStatus(order.orderId, 'CANCELLED')} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#ef4444' }}>Cancel</button>
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
