import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminSiteDetail from './pages/AdminSiteDetail';
import TeamLanding from './pages/TeamLanding';
import GodownToSite from './pages/GodownToSite';
import SiteToGodown from './pages/SiteToGodown';
import AdminCreateInventory from './pages/AdminCreateInventory';
import TeamHeader from './components/TeamHeader';
import { LayoutDashboard, Users, Share2, Check } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/shabeeradmindua') || location.pathname === '/';
  const isTeam = location.pathname.startsWith('/team');

  // Admin Header
  const [copied, setCopied] = React.useState(false);

  const handleShareTeam = (e) => {
    e.preventDefault();
    const teamUrl = window.location.origin + '/team';
    navigator.clipboard.writeText(teamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAdmin) {
    return (
      <nav className="premium-glass" style={{ borderRadius: '0 0 20px 20px', sticky: 'top', zIndex: 40, background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0 }}>
        <div className="container flex items-center justify-between py-3">
          <div className="font-bold text-xl tracking-tighter" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DUA SETTINGS ADMIN
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-bg-surface p-1 rounded-lg border border-white/10">
              <Link to="/admin" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.825rem', borderRadius: '8px' }}>
                <LayoutDashboard size={14} /> <span className="hidden sm:inline">Admin</span>
              </Link>
              <Link to="/team" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.825rem', border: 'none', background: 'transparent' }}>
                <Users size={14} /> <span className="hidden sm:inline">Team Portal</span>
              </Link>
            </div>
            <button
              onClick={handleShareTeam}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', borderColor: copied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)' }}
            >
              {copied ? <Check size={14} className="text-success" /> : <Share2 size={14} />}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: copied ? '#10b981' : 'inherit' }}>{copied ? 'Copied!' : 'Share Team'}</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Team Header
  if (isTeam) {
    return <TeamHeader />;
  }

  return null;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <NavBar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create-inventory" element={<AdminCreateInventory />} />
            <Route path="/admin/site/:siteId" element={<AdminSiteDetail />} />

            <Route path="/team" element={<TeamLanding />} />
            <Route path="/team/site/:siteId/outbound" element={<GodownToSite />} />
            <Route path="/team/site/:siteId/inbound" element={<SiteToGodown />} />

            {/* Catch-all to prevent 404s */}
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </main>
      </Router>
    </AppProvider>
  );
};

export default App;
