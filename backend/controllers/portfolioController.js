import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';
import Stock from '../models/Stock.js';

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id })
      .populate({
        path: 'holdings.stock',
        select: 'currentPrice name symbol'
      });

    if (!portfolio || portfolio.holdings.length === 0) {
      return res.json({ holdings: [], totalValue: 0 });
    }

    // Calculate current total value
    let totalValue = 0;
    const enrichedHoldings = portfolio.holdings.map(holding => {
      // Handle case where stock might have been deleted but is in portfolio
      const currentPrice = holding.stock ? holding.stock.currentPrice : 0;
      const value = holding.quantity * currentPrice;
      totalValue += value;
      
      const pnl = value - (holding.quantity * holding.averageBuyPrice);
      const pnlPercentage = (pnl / (holding.quantity * holding.averageBuyPrice)) * 100;

      return {
        _id: holding._id,
        symbol: holding.symbol,
        name: holding.stock ? holding.stock.name : 'Unknown',
        quantity: holding.quantity,
        averageBuyPrice: holding.averageBuyPrice,
        currentPrice: currentPrice,
        totalValue: value,
        pnl,
        pnlPercentage
      };
    });

    res.json({
      holdings: enrichedHoldings,
      totalValue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user transaction history
// @route   GET /api/portfolio/transactions
// @access  Private
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
