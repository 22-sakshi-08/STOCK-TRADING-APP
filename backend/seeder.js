import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from './models/Stock.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150.25 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2800.75 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 3400.10 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 299.50 },
  { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 750.30 },
  { symbol: 'META', name: 'Meta Platforms Inc.', currentPrice: 330.15 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 220.60 },
  { symbol: 'NFLX', name: 'Netflix Inc.', currentPrice: 590.20 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', currentPrice: 280.90 },
  { symbol: 'JPM', name: 'JPMorgan Chase', currentPrice: 160.40 }
];

const generateHistoricalData = (basePrice) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk for price
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    currentPrice = Math.max(1, currentPrice + change);
    
    data.push({
      date,
      price: Number(currentPrice.toFixed(2))
    });
  }
  return data;
};

const importData = async () => {
  try {
    await Stock.deleteMany(); // Clear existing
    
    const stocksWithHistory = mockStocks.map(stock => {
      const history = generateHistoricalData(stock.currentPrice);
      // Ensure currentPrice matches the last historical price
      return {
        ...stock,
        currentPrice: history[history.length - 1].price,
        historicalData: history
      };
    });

    await Stock.insertMany(stocksWithHistory);
    console.log('Stock Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
