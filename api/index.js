import express from 'express';
import cors from 'cors';
import menuRoutes from '../server/routes/menuRoutes.js';
import orderRoutes from '../server/routes/orderRoutes.js';
import paymentRoutes from '../server/routes/paymentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'HAPPYBREAK Serverless API',
    time: new Date().toISOString()
  });
});

export default app;
