import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const PORTFOLIO_API = 'http://localhost:5000/api/portfolio/';
const TRADE_API = 'http://localhost:5000/api/trade/';

// Helper to set token inside thunk
const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchPortfolio = createAsyncThunk('portfolio/fetch', async (_, thunkAPI) => {
  try {
    const response = await axios.get(PORTFOLIO_API, getConfig(thunkAPI));
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const buyStock = createAsyncThunk('portfolio/buy', async (tradeData, thunkAPI) => {
  try {
    const response = await axios.post(TRADE_API + 'buy', tradeData, getConfig(thunkAPI));
    // Trigger portfolio re-fetch
    thunkAPI.dispatch(fetchPortfolio());
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const sellStock = createAsyncThunk('portfolio/sell', async (tradeData, thunkAPI) => {
  try {
    const response = await axios.post(TRADE_API + 'sell', tradeData, getConfig(thunkAPI));
    // Trigger portfolio re-fetch
    thunkAPI.dispatch(fetchPortfolio());
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    holdings: [],
    totalValue: 0,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetPortfolioMessage: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.holdings = action.payload.holdings;
        state.totalValue = action.payload.totalValue;
        state.isError = false;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetPortfolioMessage } = portfolioSlice.actions;
export default portfolioSlice.reducer;
