import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminSiteDetail from './pages/AdminSiteDetail';
import TeamLanding from './pages/TeamLanding';
import GodownToSite from './pages/GodownToSite';
import SiteToGodown from './pages/SiteToGodown';
import TeamHeader from './components/TeamHeader';

const NavBar = () => {
    const location = useLocation();
    const isTeam = location.pathname.startsWith('/team');
    // Only show TeamHeader on team routes, or create an AdminHeader?
    // For now, let's keep TeamHeader for team, and maybe nothing or existing header for Admin?
    // The Admin pages have their own headers inside them.

    if (isTeam) return <TeamHeader />;
    return null;
};

const App = () => {
    return (
        <AppProvider>
            <Router>
                <NavBar />
                <main style={{ minHeight: '100vh', background: '#020617' }}>
                    <Routes>
                        {/* Admin Routes */}
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/shabeeradmindua" element={<AdminDashboard />} />
                        <Route path="/shabeeradmindua/site/:siteId" element={<AdminSiteDetail />} />

                        {/* Team Routes */}
                        <Route path="/team" element={<TeamLanding />} />
                        <Route path="/team/site/:siteId/outbound" element={<GodownToSite />} />
                        <Route path="/team/site/:siteId/inbound" element={<SiteToGodown />} />

                        {/* Fallback */}
                        <Route path="*" element={<AdminDashboard />} />
                    </Routes>
                </main>
            </Router>
        </AppProvider>
    );
};

export default App;
