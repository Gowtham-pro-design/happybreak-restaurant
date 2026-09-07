import React, { useState } from 'react';
import { CreditCard, DollarSign, Lock, X, CheckCircle, AlertCircle, QrCode, Smartphone, Copy, Check, ShieldCheck } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  orderType,
  tableNumber,
  customerName,
  customerPhone,
  taxRate,
  onOrderSuccess
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'stripe_online' | 'pay_at_restaurant'
  const [cardHolder, setCardHolder] = useState(customerName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // UPI states
  const [upiIdInput, setUpiIdInput] = useState('');
  const [utrRef, setUtrRef] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const restaurantUpiId = 'happybreak@upi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(restaurantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFormatCard = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Validation based on payment method
      if (paymentMethod === 'stripe_online') {
        if (!cardHolder.trim()) {
          throw new Error('Please enter cardholder name.');
        }
        if (cardNumber.replace(/\s/g, '').length < 15) {
          throw new Error('Please enter a valid card number.');
        }
      } else if (paymentMethod === 'upi') {
        if (upiIdInput && !upiIdInput.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g. name@upi).');
        }
      }

      // Prepare order payload
      const payload = {
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : null,
        customerName: orderType === 'takeaway' ? customerName : `Table ${tableNumber}`,
        customerPhone: orderType === 'takeaway' ? customerPhone : '',
        items: cart,
        taxRate,
        paymentMethod,
        notes: notes + (paymentMethod === 'upi' && utrRef ? ` [UPI Ref/UTR: ${utrRef}]` : '')
      };

      // Call Backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Call parent handler with newly created order
      onOrderSuccess(data.order);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing your checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // QR Code generator URL using public QR API encoding standard upi://pay URL
  const upiQrString = `upi://pay?pa=${restaurantUpiId}&pn=HAPPYBREAK%20KITCHEN&am=${total.toFixed(2)}&cu=USD&tn=Order%20Payment`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiQrString)}&color=10b981&bgcolor=0f172a`;

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">Checkout & Payment</div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.88rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Summary Recap Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order Type:</span>
            <strong style={{ color: orderType === 'dine-in' ? '#34d399' : '#fbbf24' }}>
              {orderType === 'dine-in' ? `Dine-In Table #${tableNumber}` : `Takeaway (${customerName})`}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <span>Total Items:</span>
            <strong style={{ color: 'white' }}>{cart.reduce((s, i) => s + i.quantity, 0)} items</strong>
          </div>
          <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Grand Total:</span>
            <span style={{ color: '#34d399' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Payment Method</label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {/* Option A: UPI Payment */}
              <div
                onClick={() => setPaymentMethod('upi')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'upi' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'upi' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={22} style={{ color: paymentMethod === 'upi' ? '#10b981' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>UPI Pay</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>GPay / PhonePe</div>
                </div>
              </div>

              {/* Option B: Stripe Online */}
              <div
                onClick={() => setPaymentMethod('stripe_online')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'stripe_online' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'stripe_online' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={22} style={{ color: paymentMethod === 'stripe_online' ? '#10b981' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Card / Stripe</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Credit & Debit</div>
                </div>
              </div>

              {/* Option C: Pay at Restaurant */}
              <div
                onClick={() => setPaymentMethod('pay_at_restaurant')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'pay_at_restaurant' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: paymentMethod === 'pay_at_restaurant' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px'
                }}
              >
                <DollarSign size={22} style={{ color: paymentMethod === 'pay_at_restaurant' ? '#f59e0b' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Pay at Spot</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cash / Counter</div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Payment UI */}
          {paymentMethod === 'upi' ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} /> Instant UPI Transfer & QR Code
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Zero Fee</span>
              </div>

              {/* UPI ID Copy Card */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Restaurant Official UPI ID</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.03em', marginTop: '2px' }}>
                    {restaurantUpiId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedUpi ? <Check size={14} style={{ color: '#34d399' }} /> : <Copy size={14} />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* QR Code and App Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ textAlign: 'center', background: '#0f172a', padding: '8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <img
                    src={qrImageUrl}
                    alt="UPI Payment QR Code"
                    style={{ width: '124px', height: '124px', borderRadius: '6px', display: 'block', margin: '0 auto' }}
                    onError={(e) => {
                      // Fallback placeholder if offline
                      e.target.onerror = null;
                      e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=happybreak@upi';
                    }}
                  />
                  <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '4px', fontWeight: 600 }}>Scan with any UPI App</div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 600, color: 'white', marginBottom: '6px' }}>Supported Payment Apps:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'CRED', 'Amazon Pay'].map((app) => (
                      <span key={app} style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', color: 'white' }}>
                        {app}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                    Scan the QR code or enter <strong style={{ color: '#34d399' }}>happybreak@upi</strong> in your UPI app to complete payment of <strong>${total.toFixed(2)}</strong>.
                  </p>
                </div>
              </div>

              {/* Customer UPI Details (Optional) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Your VPA / UPI ID (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. name@gpay"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>UPI Ref / UTR No. (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="12-digit UTR Number"
                    maxLength={14}
                    value={utrRef}
                    onChange={(e) => setUtrRef(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>
          ) : paymentMethod === 'stripe_online' ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} /> Stripe Encrypted Secure Payment
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Visa, Mastercard, Amex</span>
              </div>

              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="4532 •••• •••• 8901"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(handleFormatCard(e.target.value))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="12/28"
                    maxLength={5}
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVC / CVC2</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="123"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                color: '#fef3c7'
              }}
            >
              <h4 style={{ color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={18} /> Pay at Restaurant Selected
              </h4>
              <p>
                Your order will be sent to our kitchen immediately! You can pay using cash, credit/debit card, or UPI when staff arrives at your table (Dine-In) or when you arrive for pickup (Takeaway).
              </p>
            </div>
          )}

          {/* Kitchen Notes */}
          <div className="form-group">
            <label className="form-label">Special Kitchen Notes (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Allergy info, extra napkins, dressing on side..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>
                    {paymentMethod === 'upi'
                      ? `Confirm & Pay with UPI ($${total.toFixed(2)})`
                      : paymentMethod === 'stripe_online'
                      ? `Pay Card ($${total.toFixed(2)})`
                      : `Place Order ($${total.toFixed(2)})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
