import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const STOCK_API = 'http://localhost:5000/api/stocks/';
const WATCHLIST_API = 'http://localhost:5000/api/watchlist/';

const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(STOCK_API, getConfig(thunkAPI));
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchWatchlist = createAsyncThunk('stocks/fetchWatchlist', async (_, thunkAPI) => {
  try {
    const response = await axios.get(WATCHLIST_API, getConfig(thunkAPI));
    return response.data.stocks || [];
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const toggleWatchlist = createAsyncThunk('stocks/toggleWatchlist', async (symbol, thunkAPI) => {
  try {
    const currentWatchlist = thunkAPI.getState().stocks.watchlist;
    const isWatched = currentWatchlist.some(s => s.symbol === symbol);
    
    if (isWatched) {
      const response = await axios.delete(WATCHLIST_API + symbol, getConfig(thunkAPI));
      return response.data.stocks || [];
    } else {
      const response = await axios.post(WATCHLIST_API, { symbol }, getConfig(thunkAPI));
      return response.data.stocks || [];
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocks: [],
    watchlist: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(toggleWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      });
  }
});

export default stockSlice.reducer;
