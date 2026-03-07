import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
// Will create these pages next
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Market from './pages/Market';
import WatchlistPage from './pages/WatchlistPage';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected layout wraps these routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="market" element={<Market />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="watchlist" element={<WatchlistPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
