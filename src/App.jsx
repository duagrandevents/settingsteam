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
import { LayoutDashboard, Users } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // DOMAIN DETECTION FOR SEPARATE PORTALS
  const isTeamDomain = window.location.hostname.includes('settingsteam') || window.location.hostname.includes('vercel.app'); // Broader check for verified Team URLs if needed, but 'settingsteam' is key.
  // Actually, 'includes' might be risky for admin if it's on vercel too.
  // Let's stick to 'settingsteam' as per the user's setup.
  const isTeamPortal = window.location.hostname.includes('settingsteam');

  useEffect(() => {
    if (isTeamPortal && location.pathname === '/') {
      navigate('/team', { replace: true });
    }
  }, [isTeamPortal, location, navigate]);

  const isAdmin = (location.pathname.startsWith('/admin') || location.pathname === '/') && !isTeamPortal;
  const isTeam = location.pathname.startsWith('/team') || isTeamPortal; // Force Team Header on team portal

  if (isAdmin) {
    return (
      <nav className="premium-glass" style={{ borderRadius: '0 0 20px 20px', sticky: 'top', zIndex: 40, background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0 }}>
        <div className="container flex items-center justify-between py-3">
          <div className="font-bold text-xl tracking-tighter" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DUA SETTINGS ADMIN
          </div>
          <div className="flex bg-bg-surface p-1 rounded-lg border border-white/10">
            <Link to="/admin" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.825rem', borderRadius: '8px' }}>
              <LayoutDashboard size={14} /> <span className="hidden sm:inline">Admin</span>
            </Link>
            <a
              href="https://settingsteam.vercel.app/"
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.825rem', border: 'none', background: 'transparent', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Users size={14} /> <span className="hidden sm:inline">Team Portal</span>
            </a>
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
