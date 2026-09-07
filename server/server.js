import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'HAPPYBREAK Backend Server',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Serve static frontend assets from Vite dist in production or built mode
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA Fallback for Client-Side Routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🥗 HAPPYBREAK Backend Server running on port ${PORT}`);
  console.log(` 🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
