import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateInventory from './pages/AdminCreateInventory';
import AdminSiteDetail from './pages/AdminSiteDetail';
import TeamLanding from './pages/TeamLanding';
import GodownToSite from './pages/GodownToSite';
import SiteToGodown from './pages/SiteToGodown';
import TeamHeader from './components/TeamHeader';

import PinLock from './components/PinLock';

const NavBar = () => {
    const location = useLocation();
    const isTeam = location.pathname.startsWith('/team');
    const isTeamDomain = window.location.hostname.includes('team') || window.location.hostname.includes('settingsteam');
    if (isTeam || isTeamDomain) return <TeamHeader />;
    return null;
};

// Handle routing based on domain (Admin vs Team)
const HomeRoute = () => {
    const isTeamDomain = window.location.hostname.includes('team') || window.location.hostname.includes('settingsteam');
    if (isTeamDomain) {
        return (
            <PinLock>
                <TeamLanding />
            </PinLock>
        );
    }
    return <AdminDashboard />;
};

const App = () => {
    return (
        <AppProvider>
            <Router>
                <NavBar />
                <main style={{ minHeight: '100vh', background: '#020617' }}>
                    <Routes>
                        {/* Admin Routes */}
                        <Route path="/" element={<HomeRoute />} />
                        <Route path="/create-inventory" element={<AdminCreateInventory />} />
                        <Route path="/site/:siteId" element={<AdminSiteDetail />} />

                        {/* Team Routes */}
                        <Route path="/team" element={
                            <PinLock>
                                <TeamLanding />
                            </PinLock>
                        } />
                        <Route path="/site/:siteId/outbound" element={
                            <PinLock>
                                <GodownToSite />
                            </PinLock>
                        } />
                        <Route path="/site/:siteId/inbound" element={
                            <PinLock>
                                <SiteToGodown />
                            </PinLock>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<HomeRoute />} />
                    </Routes>
                </main>
            </Router>
        </AppProvider>
    );
};

export default App;
