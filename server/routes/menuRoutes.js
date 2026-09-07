import express from 'express';
import { categories, menuItems } from '../data/menuData.js';

const router = express.Router();

// GET /api/menu - Get categories and menu items
router.get('/', (req, res) => {
  const { category, search } = req.query;

  let filtered = [...menuItems];

  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      item => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    categories,
    items: filtered,
    total: filtered.length,
  });
});

export default router;
