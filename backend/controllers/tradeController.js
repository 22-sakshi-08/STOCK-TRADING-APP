import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
export const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user._id;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid trade details' });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const user = await User.findById(userId);
    const totalCost = stock.currentPrice * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient simulated funds' });
    }

    // Deduct funds
    user.balance -= totalCost;
    await user.save();

    // Record Transaction
    await Transaction.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'BUY',
      quantity,
      price: stock.currentPrice,
      totalAmount: totalCost,
    });

    // Update Portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: userId,
        holdings: [{
          stock: stock._id,
          symbol: stock.symbol,
          quantity,
          averageBuyPrice: stock.currentPrice
        }]
      });
    } else {
      const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === stock.symbol);
      
      if (holdingIndex > -1) {
        // Calculate new average price
        const existingHolding = portfolio.holdings[holdingIndex];
        const oldTotalValue = existingHolding.quantity * existingHolding.averageBuyPrice;
        
        existingHolding.quantity += quantity;
        existingHolding.averageBuyPrice = (oldTotalValue + totalCost) / existingHolding.quantity;
      } else {
        portfolio.holdings.push({
          stock: stock._id,
          symbol: stock.symbol,
          quantity,
          averageBuyPrice: stock.currentPrice
        });
      }
      await portfolio.save();
    }

    res.status(200).json({ message: 'Stock purchased successfully', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
export const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user._id;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid trade details' });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) return res.status(400).json({ message: 'No portfolio found' });

    const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === stock.symbol);
    
    if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }

    const totalValue = stock.currentPrice * quantity;

    // Add funds
    const user = await User.findById(userId);
    user.balance += totalValue;
    await user.save();

    // Record Transaction
    await Transaction.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'SELL',
      quantity,
      price: stock.currentPrice,
      totalAmount: totalValue,
    });

    // Update Portfolio
    portfolio.holdings[holdingIndex].quantity -= quantity;
    
    if (portfolio.holdings[holdingIndex].quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }
    
    await portfolio.save();

    res.status(200).json({ message: 'Stock sold successfully', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
