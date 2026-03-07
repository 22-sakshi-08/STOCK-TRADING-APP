import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  historicalData: [{
    date: Date,
    price: Number,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
