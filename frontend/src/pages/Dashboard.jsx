import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchlist, fetchStocks } from '../features/stockSlice';
import { Link } from 'react-router-dom';
import { PieChart, List, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { totalValue, holdings } = useSelector((state) => state.portfolio);
  const { watchlist } = useSelector((state) => state.stocks);

  useEffect(() => {
    dispatch(fetchWatchlist());
    dispatch(fetchStocks());
  }, [dispatch]);

  const totalAccountValue = user.balance + totalValue;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}!</h1>
        <p className="text-slate-400">Here's a summary of your trading simulator account today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Account Summary */}
        <div className="col-span-1 lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-3xl opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Account Value</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex gap-4">
                <Link to="/portfolio" className="btn-primary py-2 px-6 bg-brand">
                  View Portfolio
                </Link>
                <Link to="/market" className="btn-secondary py-2 px-6">
                  Trade Market
                </Link>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                <span className="text-slate-400">Purchasing Power</span>
                <span className="font-bold text-emerald-400">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                <span className="text-slate-400">Invested Amount</span>
                <span className="font-bold text-white">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Holdings</span>
                <span className="font-bold text-white">{holdings.length} Assets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Getting Started */}
        <div className="col-span-1 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-brand w-5 h-5"/>
              Market Activity
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              The market is open. Start discovering new stocks and applying your trading strategies.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link to="/market" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors group">
              <div className="bg-brand/20 p-2 rounded-lg group-hover:bg-brand/30 transition-colors">
                <List className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Browse Market</p>
                <p className="text-xs text-slate-400">Explore real-time data</p>
              </div>
            </Link>
            
            <Link to="/portfolio" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors group">
              <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Analyze Portfolio</p>
                <p className="text-xs text-slate-400">Track your performance</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
