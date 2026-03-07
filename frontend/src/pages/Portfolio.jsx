import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio, sellStock } from '../features/portfolioSlice';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { DollarSign, Briefcase, TrendingUp, TrendingDown, Clock } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = () => {
  const dispatch = useDispatch();
  const { holdings, totalValue, isLoading } = useSelector((state) => state.portfolio);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedStock, setSelectedStock] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const handleSell = async (e) => {
    e.preventDefault();
    setSellLoading(true);
    await dispatch(sellStock({ symbol: selectedStock.symbol, quantity: Number(sellQuantity) }));
    setSellLoading(false);
    setSelectedStock(null);
    setSellQuantity(1);
    alert('Sale successful!');
  };

  const totalAccountValue = user.balance + totalValue;

  if (isLoading) return <div className="text-center p-10">Loading portfolio data...</div>;

  const chartData = {
    labels: holdings.map(h => h.symbol),
    datasets: [
      {
        data: holdings.map(h => h.totalValue),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'right', labels: { color: '#94a3b8' } }
    },
    cutout: '70%',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">My Portfolio</h2>
        <p className="text-slate-400">Manage your holdings and track performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-brand relative overflow-hidden">
          <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-brand opacity-10" />
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Account Value</h3>
          <p className="text-3xl font-bold text-white">${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-purple-500 relative overflow-hidden">
          <Briefcase className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-500 opacity-10" />
          <h3 className="text-sm font-medium text-slate-400 mb-1">Invested Value</h3>
          <p className="text-3xl font-bold text-white">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-emerald-500 relative overflow-hidden">
          <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500 opacity-10" />
          <h3 className="text-sm font-medium text-slate-400 mb-1">Purchasing Power</h3>
          <p className="text-3xl font-bold text-white">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart Section */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-1 flex flex-col justify-center items-center min-h-[300px]">
          <h3 className="font-bold text-lg text-white mb-6 self-start w-full">Asset Allocation</h3>
          {holdings.length > 0 ? (
            <div className="w-full max-w-[250px] aspect-square">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-slate-500 text-center">No assets to visualize.</div>
          )}
        </div>

        {/* Holdings Table */}
        <div className="glass-panel rounded-xl overflow-hidden lg:col-span-2 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <h3 className="font-bold text-lg text-white">Current Holdings</h3>
          </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm">
                <th className="p-4 font-semibold">Asset</th>
                <th className="p-4 font-semibold text-right">Shares</th>
                <th className="p-4 font-semibold text-right">Avg Price</th>
                <th className="p-4 font-semibold text-right">Current Price</th>
                <th className="p-4 font-semibold text-right">Total Value</th>
                <th className="p-4 font-semibold text-right">Return</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No holdings in your portfolio. Go to the Market to start trading!
                  </td>
                </tr>
              ) : (
                holdings.map((holding) => {
                  const isPositive = holding.pnl >= 0;
                  return (
                    <tr key={holding.symbol} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{holding.symbol}</div>
                        <div className="text-xs text-slate-400">{holding.name}</div>
                      </td>
                      <td className="p-4 text-right font-medium">{holding.quantity}</td>
                      <td className="p-4 text-right">${holding.averageBuyPrice.toFixed(2)}</td>
                      <td className="p-4 text-right">${holding.currentPrice.toFixed(2)}</td>
                      <td className="p-4 text-right font-bold text-white">${holding.totalValue.toFixed(2)}</td>
                      <td className={`p-4 text-right font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          ${Math.abs(holding.pnl).toFixed(2)} ({holding.pnlPercentage.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedStock(holding)}
                          className="px-3 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded transition-colors text-sm font-semibold"
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Sell Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl relative">
            <h3 className="text-xl font-bold mb-4">Sell {selectedStock.symbol}</h3>
            
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl mb-6">
              <div>
                <p className="text-sm text-slate-400">Current Price</p>
                <p className="text-xl font-bold">${selectedStock.currentPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Available Shares</p>
                <p className="text-xl font-bold text-brand">{selectedStock.quantity}</p>
              </div>
            </div>

            <form onSubmit={handleSell} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity to Sell</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedStock.quantity}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-700">
                <span className="text-slate-400">Estimated Return</span>
                <span className="font-bold text-lg text-emerald-400">+${(selectedStock.currentPrice * sellQuantity).toFixed(2)}</span>
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
                  disabled={sellLoading}
                  className="btn-primary flex-1 bg-rose-500 hover:bg-rose-600 shadow-rose-500/30"
                >
                  {sellLoading ? 'Processing...' : 'Execute Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
