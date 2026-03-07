import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/authSlice';
import { LayoutDashboard, LineChart, PieChart, Star, LogOut, Wallet } from 'lucide-react';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Market', path: '/market', icon: LineChart },
    { name: 'Portfolio', path: '/portfolio', icon: PieChart },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-slate-700/50 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-purple-400">
            SB Stocks
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-brand/20 text-brand border border-brand/30 shadow-lg shadow-brand/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Wallet className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Available Cash</span>
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {formatCurrency(user.balance)}
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden glass-panel py-4 px-6 flex justify-between items-center border-b border-slate-700/50">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-purple-400">
            SB Stocks
          </h1>
          <button onClick={onLogout} className="text-slate-400 hover:text-white">
            <LogOut className="w-6 h-6" />
          </button>
        </header>
        
        {/* Mobile Nav (Bottom) */}
        <nav className="md:hidden fixed bottom-0 w-full glass-panel border-t border-slate-700/50 flex justify-around p-3 z-50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                  isActive ? 'text-brand' : 'text-slate-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
