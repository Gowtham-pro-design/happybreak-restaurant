import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless (Vercel), only /tmp is writable. In local dev, use project directory.
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
const DB_FILE = isServerless
  ? path.join('/tmp', 'orders_db.json')
  : path.join(__dirname, 'orders_db.json');

// Seed DB file path (read-only, bundled with deployment)
const SEED_FILE = path.join(__dirname, 'orders_db.json');

// Initial sample seed orders
const defaultOrders = [
  {
    orderId: 'HB-1024',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    orderType: 'dine-in',
    tableNumber: '12',
    customerName: 'Sarah Jenkins',
    customerPhone: '',
    items: [
      { id: 'sal-1', name: 'Classic Caesar Salad', price: 12.99, quantity: 2 },
      { id: 'sal-2', name: 'Mediterranean Greek Bowl', price: 14.49, quantity: 1 }
    ],
    subtotal: 40.47,
    taxRate: 0.08875,
    tax: 3.59,
    total: 44.06,
    orderStatus: 'PREPARING',
    paymentStatus: 'PAID',
    paymentMethod: 'stripe_online',
    notes: 'Extra dressing on the side please.'
  },
  {
    orderId: 'HB-1025',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    orderType: 'takeaway',
    tableNumber: null,
    customerName: 'John Miller',
    customerPhone: '(555) 234-5678',
    items: [
      { id: 'brg-1', name: 'Happybreak Prime Angus Burger', price: 16.99, quantity: 1 },
      { id: 'drk-1', name: 'Fresh House Citrus Mint Lemonade', price: 4.99, quantity: 2 }
    ],
    subtotal: 26.97,
    taxRate: 0.08875,
    tax: 2.39,
    total: 29.36,
    orderStatus: 'CONFIRMED',
    paymentStatus: 'PAY_AT_RESTAURANT',
    paymentMethod: 'pay_at_restaurant',
    notes: 'Pickup at 7:30 PM'
  }
];

class OrderStore {
  constructor() {
    this.orders = [];
    this.loadOrders();
  }

  loadOrders() {
    try {
      // Try reading from the writable DB_FILE first
      if (fs.existsSync(DB_FILE)) {
        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        this.orders = JSON.parse(rawData);
      } else if (isServerless && fs.existsSync(SEED_FILE)) {
        // On first serverless cold start, copy seed data to /tmp
        const rawData = fs.readFileSync(SEED_FILE, 'utf-8');
        this.orders = JSON.parse(rawData);
        this.saveOrders();
      } else {
        this.orders = [...defaultOrders];
        this.saveOrders();
      }
    } catch (err) {
      console.error('Error reading order DB file, resetting to default:', err);
      this.orders = [...defaultOrders];
    }
  }

  saveOrders() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.orders, null, 2), 'utf-8');
    } catch (err) {
      // In serverless, /tmp writes can occasionally fail — log but don't crash
      console.error('Error writing order DB file:', err);
    }
  }

  getAllOrders() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.orders.find(o => o.orderId.toLowerCase() === id.toLowerCase());
  }

  createOrder(orderData) {
    // Generate sequential unique order ID
    const count = this.orders.length + 1026;
    const orderId = `HB-${count}`;

    const newOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      orderType: orderData.orderType || 'dine-in', // 'dine-in' | 'takeaway'
      tableNumber: orderData.tableNumber || null,
      customerName: orderData.customerName || (orderData.orderType === 'dine-in' ? `Table ${orderData.tableNumber}` : 'Guest'),
      customerPhone: orderData.customerPhone || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal,
      taxRate: orderData.taxRate || 0.08875,
      tax: orderData.tax,
      total: orderData.total,
      orderStatus: 'PENDING', // PENDING -> CONFIRMED -> PREPARING -> READY -> COMPLETED -> CANCELLED
      paymentStatus: orderData.paymentStatus || 'PENDING', // PENDING, PAID, FAILED, PAY_AT_RESTAURANT
      paymentMethod: orderData.paymentMethod || 'pay_at_restaurant',
      notes: orderData.notes || ''
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status ${status}`);
    }

    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    this.saveOrders();
    return order;
  }

  updatePaymentStatus(orderId, paymentStatus) {
    const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PAY_AT_RESTAURANT'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new Error(`Invalid payment status ${paymentStatus}`);
    }

    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.paymentStatus = paymentStatus;
    order.paymentUpdatedAt = new Date().toISOString();
    this.saveOrders();
    return order;
  }
}

export const store = new OrderStore();
