import express from 'express';
import { getStocks, searchStocks, getStockBySymbol } from '../controllers/stockController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Making these protected so that only logged-in users get stock data
router.get('/', protect, getStocks);
router.get('/search/:query', protect, searchStocks);
router.get('/:symbol', protect, getStockBySymbol);

export default router;
