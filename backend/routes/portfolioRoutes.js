import express from 'express';
import { getPortfolio, getTransactionHistory } from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getPortfolio);
router.get('/transactions', protect, getTransactionHistory);

export default router;
