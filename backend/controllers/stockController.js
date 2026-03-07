import Stock from '../models/Stock.js';

// @desc    Get all active stocks
// @route   GET /api/stocks
// @access  Public (or Private depending on needs, setting Public for now)
export const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search for stocks by symbol or name
// @route   GET /api/stocks/search/:query
// @access  Public
export const searchStocks = async (req, res) => {
  try {
    const query = req.params.query;
    const regex = new RegExp(query, 'i');
    
    const stocks = await Stock.find({
      $or: [{ symbol: regex }, { name: regex }]
    });

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stock by symbol
// @route   GET /api/stocks/:symbol
// @access  Public
export const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });

    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
