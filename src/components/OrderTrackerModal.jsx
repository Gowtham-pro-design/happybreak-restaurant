import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, ChefHat, X, RefreshCw, AlertTriangle, ShieldCheck, Utensils, ShoppingBag } from 'lucide-react';

export default function OrderTrackerModal({ isOpen, onClose, order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    if (!isOpen || !order?.orderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.orderId}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          // Check localStorage as fallback
          const localOrders = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
          const found = localOrders.find(o => o.orderId === order.orderId);
          if (found) setOrder(found);
        }
      } catch (err) {
        const localOrders = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
        const found = localOrders.find(o => o.orderId === order.orderId);
        if (found) setOrder(found);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, order?.orderId]);

  if (!isOpen || !order) return null;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${order.orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        const localOrders = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
        const found = localOrders.find(o => o.orderId === order.orderId);
        if (found) setOrder(found);
      }
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('happybreak_orders') || '[]');
      const found = localOrders.find(o => o.orderId === order.orderId);
      if (found) setOrder(found);
    } finally {
      setIsRefreshing(false);
    }
  };

  const steps = ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  const getPaymentBadge = (pStatus) => {
    switch (pStatus) {
      case 'PAID': return { label: 'PAID', cls: 'badge-primary', icon: <ShieldCheck size={14} /> };
      case 'PAY_AT_RESTAURANT': return { label: 'PAY AT RESTAURANT', cls: 'badge-warning', icon: <Clock size={14} /> };
      case 'FAILED': return { label: 'FAILED', cls: 'badge-danger', icon: <AlertTriangle size={14} /> };
      default: return { label: pStatus, cls: 'badge-info', icon: <Clock size={14} /> };
    }
  };

  const paymentBadge = getPaymentBadge(order.paymentStatus);

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
              LIVE ORDER STATUS TRACKER
            </div>
            <div className="modal-title" style={{ fontSize: '1.4rem', marginTop: '2px' }}>
              Order #{order.orderId}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleManualRefresh}
              className="btn-icon"
              title="Refresh Status"
              style={{ width: '34px', height: '34px' }}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            </button>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        {/* Dual Status Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: 'var(--glass-border)'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Kitchen Status</div>
            <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              <ChefHat size={14} /> {order.orderStatus}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Payment Status</div>
            <span className={`badge ${paymentBadge.cls}`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              {paymentBadge.icon} {paymentBadge.label}
            </span>
          </div>
        </div>

        {/* Progress Pipeline */}
        {order.orderStatus !== 'CANCELLED' && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '3px', background: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }}>
                <div style={{
                  height: '100%',
                  background: 'var(--primary)',
                  width: currentStepIndex < 0 ? '0%' : `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {steps.map((stepName, i) => {
                const isDone = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={stepName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isDone ? 'var(--primary)' : '#1e293b',
                      color: isDone ? '#0b0f19' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      border: isCurrent ? '3px solid #34d399' : '3px solid transparent',
                      boxShadow: isCurrent ? '0 0 16px rgba(16, 185, 129, 0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {isDone ? <CheckCircle2 size={20} /> : i + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500, color: isDone ? '#34d399' : 'var(--text-subtle)', marginTop: '8px' }}>
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Receipt */}
        <div style={{
          background: 'rgba(11, 15, 25, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.88rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <span>Type: <strong>{order.orderType === 'dine-in' ? `Dine-In Table #${order.tableNumber}` : `Takeaway`}</strong></span>
            <span>Customer: <strong>{order.customerName}</strong></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-main)' }}>{item.quantity}× {item.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.12)', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Total Paid / Due:</span>
            <span style={{ color: '#34d399' }}>₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <button className="btn btn-secondary btn-full" onClick={onClose}>
          Close Tracker
        </button>
      </div>
    </div>
  );
}
