import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TeamLanding from './pages/TeamLanding';
import GodownToSite from './pages/GodownToSite';
import SiteToGodown from './pages/SiteToGodown';
import TeamHeader from './components/TeamHeader';

const NavBar = () => {
  return <TeamHeader />;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <NavBar />
        <main style={{ minHeight: '100vh', background: '#020617' }}>
          <Routes>
            <Route path="/" element={<TeamLanding />} />
            <Route path="/team" element={<TeamLanding />} />
            <Route path="/team/site/:siteId/outbound" element={<GodownToSite />} />
            <Route path="/team/site/:siteId/inbound" element={<SiteToGodown />} />

            {/* Catch-all to prevent 404s */}
            <Route path="*" element={<TeamLanding />} />
          </Routes>
        </main>
      </Router>
    </AppProvider>
  );
};

export default App;
