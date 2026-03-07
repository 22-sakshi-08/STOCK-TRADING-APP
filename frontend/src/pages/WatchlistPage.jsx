import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchlist, toggleWatchlist } from '../features/stockSlice';
import { Star, TrendingUp, TrendingDown, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const WatchlistPage = () => {
  const dispatch = useDispatch();
  const { watchlist, isLoading } = useSelector((state) => state.stocks);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  if (isLoading) return <div className="text-center p-10">Loading watchlist...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">My Watchlist</h2>
        <p className="text-slate-400">Keep an eye on potential investment opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {watchlist.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl flex flex-col items-center justify-center">
            <EyeOff className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">Your watchlist is empty</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Save stocks you're interested in monitoring by clicking the star icon in the Market view.
            </p>
            <Link to="/market" className="btn-primary">
              Explore Market
            </Link>
          </div>
        ) : (
          watchlist.map((stock) => {
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
                    className="text-yellow-400 hover:text-slate-400 transition-colors"
                  >
                    <Star className="w-6 h-6 fill-yellow-400" />
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
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
