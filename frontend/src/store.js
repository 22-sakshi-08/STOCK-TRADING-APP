import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice.js';
import portfolioReducer from './features/portfolioSlice.js';
import stockReducer from './features/stockSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    stocks: stockReducer,
  },
});
