import express from 'express';
import { getWatchlist, addStockToWatchlist, removeStockFromWatchlist } from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWatchlist);
router.post('/', protect, addStockToWatchlist);
router.delete('/:symbol', protect, removeStockFromWatchlist);

export default router;
