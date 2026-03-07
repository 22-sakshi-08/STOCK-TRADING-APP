import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, toggleWatchlist, fetchWatchlist } from '../features/stockSlice';
import { buyStock } from '../features/portfolioSlice';
import { Search, TrendingUp, TrendingDown, Star, ShoppingCart } from 'lucide-react';

const Market = () => {
  const dispatch = useDispatch();
  const { stocks, watchlist, isLoading } = useSelector((state) => state.stocks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isWatched = (symbol) => {
    return watchlist.some(s => s.symbol === symbol);
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setTradeLoading(true);
    await dispatch(buyStock({ symbol: selectedStock.symbol, quantity: Number(tradeQuantity) }));
    setTradeLoading(false);
    setSelectedStock(null);
    setTradeQuantity(1);
    alert('Purchase successful!');
  };

  if (isLoading) return <div className="text-center p-10">Loading market data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Market Overview</h2>
          <p className="text-slate-400">Discover and trade real-time stocks</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search symbol or name..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStocks.map((stock) => {
          // Calculate mock 24h change for UI
          const mockChange = ((Math.random() * 5) - 2.5).toFixed(2);
          const isPositive = mockChange >= 0;

          return (
            <div key={stock.symbol} className="glass-panel p-5 rounded-xl hover:border-brand/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1">{stock.name}</p>
                </div>
                <button 
                  onClick={() => dispatch(toggleWatchlist(stock.symbol))}
                  className="text-slate-400 hover:text-yellow-400 transition-colors"
                >
                  <Star className={`w-6 h-6 ${isWatched(stock.symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </button>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">${stock.currentPrice.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? '+' : ''}{mockChange}%
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedStock(stock)}
                  className="bg-brand/10 hover:bg-brand hover:text-white text-brand p-2 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trade Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl relative">
            <h3 className="text-xl font-bold mb-4">Trade {selectedStock.symbol}</h3>
            
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl mb-6">
              <div>
                <p className="text-sm text-slate-400">Current Price</p>
                <p className="text-2xl font-bold">${selectedStock.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            <form onSubmit={handleTrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity (Shares)</label>
                <input 
                  type="number" 
                  min="1"
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-700">
                <span className="text-slate-400">Total Cost</span>
                <span className="font-bold text-lg">${(selectedStock.currentPrice * tradeQuantity).toFixed(2)}</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={tradeLoading}
                  className="btn-primary flex-1 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                >
                  {tradeLoading ? 'Processing...' : 'Buy Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
