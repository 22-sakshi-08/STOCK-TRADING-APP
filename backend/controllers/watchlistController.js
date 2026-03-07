import Watchlist from '../models/Watchlist.js';
import Stock from '../models/Stock.js';

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
export const getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id }).populate('stocks');
    
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user._id, stocks: [] });
    }
    
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
export const addStockToWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user._id, stocks: [stock._id] });
    } else {
      if (!watchlist.stocks.includes(stock._id)) {
        watchlist.stocks.push(stock._id);
        await watchlist.save();
      }
    }

    const updatedWatchlist = await Watchlist.findById(watchlist._id).populate('stocks');
    res.json(updatedWatchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
export const removeStockFromWatchlist = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const stock = await Stock.findOne({ symbol });
    
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (watchlist) {
      watchlist.stocks = watchlist.stocks.filter(s => s.toString() !== stock._id.toString());
      await watchlist.save();
    }

    const updatedWatchlist = await Watchlist.findById(watchlist._id).populate('stocks');
    res.json(updatedWatchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
