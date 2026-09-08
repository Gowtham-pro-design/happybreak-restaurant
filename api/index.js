import express from 'express';
import cors from 'cors';
import menuRoutes from '../server/routes/menuRoutes.js';
import orderRoutes from '../server/routes/orderRoutes.js';
import paymentRoutes from '../server/routes/paymentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes - support both with and without /api prefix for Vercel compatibility
app.use('/api/menu', menuRoutes);
app.use('/menu', menuRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/payment', paymentRoutes);

app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    app: 'HAPPYBREAK Serverless API',
    time: new Date().toISOString()
  });
});

export default (req, res) => {
  return app(req, res);
};
