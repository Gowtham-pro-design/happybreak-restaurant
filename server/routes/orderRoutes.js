import express from 'express';
import { store } from '../data/store.js';
import { menuItems } from '../data/menuData.js';

const router = express.Router();

// GET /api/orders - Fetch all orders (Admin / Kitchen view)
router.get('/', (req, res) => {
  const { orderType, status, paymentStatus } = req.query;
  let orders = store.getAllOrders();

  if (orderType) {
    orders = orders.filter(o => o.orderType === orderType);
  }
  if (status) {
    orders = orders.filter(o => o.orderStatus === status);
  }
  if (paymentStatus) {
    orders = orders.filter(o => o.paymentStatus === paymentStatus);
  }

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

// GET /api/orders/:id - Fetch single order details
router.get('/:id', (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// POST /api/orders - Create a new order with Backend Validation
router.post('/', (req, res) => {
  try {
    const { orderType, tableNumber, customerName, customerPhone, items, taxRate = 0.08875, paymentMethod, notes } = req.body;

    // Validation
    if (!orderType || !['dine-in', 'takeaway'].includes(orderType)) {
      return res.status(400).json({ success: false, error: 'Valid orderType (dine-in or takeaway) is required.' });
    }

    if (orderType === 'dine-in' && !tableNumber) {
      return res.status(400).json({ success: false, error: 'Table number is required for Dine-In orders.' });
    }

    if (orderType === 'takeaway' && (!customerName || !customerPhone)) {
      return res.status(400).json({ success: false, error: 'Customer name and phone number are required for Takeaway orders.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart cannot be empty.' });
    }

    // Backend calculation & validation of item prices
    let calculatedSubtotal = 0;
    const validatedItems = items.map(cartItem => {
      const dbItem = menuItems.find(m => m.id === cartItem.id);
      const price = dbItem ? dbItem.price : (cartItem.price || 0);
      const qty = Math.max(1, parseInt(cartItem.quantity, 10) || 1);
      const itemTotal = price * qty;
      calculatedSubtotal += itemTotal;

      return {
        id: cartItem.id,
        name: dbItem ? dbItem.name : cartItem.name,
        price: price,
        quantity: qty,
        itemTotal: Number(itemTotal.toFixed(2)),
      };
    });

    const subtotal = Number(calculatedSubtotal.toFixed(2));
    const tax = Number((subtotal * taxRate).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    // Determine initial payment status
    let paymentStatus = 'PENDING';
    if (paymentMethod === 'pay_at_restaurant') {
      paymentStatus = 'PAY_AT_RESTAURANT';
    } else if (paymentMethod === 'stripe_online' || paymentMethod === 'upi') {
      paymentStatus = 'PAID'; // Confirmed online / instant UPI payment
    }

    const createdOrder = store.createOrder({
      orderType,
      tableNumber,
      customerName,
      customerPhone,
      items: validatedItems,
      subtotal,
      taxRate,
      tax,
      total,
      paymentStatus,
      paymentMethod,
      notes
    });

    // Automatically confirm new orders
    store.updateOrderStatus(createdOrder.orderId, 'CONFIRMED');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: store.getOrderById(createdOrder.orderId)
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: 'Server error creating order' });
  }
});

// PATCH /api/orders/:id/status - Update Order Status (Staff/Admin)
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = store.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, message: `Order status updated to ${status}`, order: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/payment - Update Payment Status (Staff/Admin)
router.patch('/:id/payment', (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updated = store.updatePaymentStatus(req.params.id, paymentStatus);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, message: `Payment status updated to ${paymentStatus}`, order: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
