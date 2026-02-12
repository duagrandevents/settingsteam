import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TeamLanding from './pages/TeamLanding';
import TeamContacts from './pages/TeamContacts';
import TeamPayments from './pages/TeamPayments';
import GodownToSite from './pages/GodownToSite';
import SiteToGodown from './pages/SiteToGodown';
import TeamHeader from './components/TeamHeader';
import PinLock from './components/PinLock';

const App = () => {
    return (
        <AppProvider>
            <Router>
                <TeamHeader />
                <main style={{ minHeight: '100vh', background: '#020617' }}>
                    <Routes>
                        <Route path="/" element={
                            <PinLock>
                                <TeamLanding />
                            </PinLock>
                        } />
                        <Route path="/contacts" element={
                            <PinLock>
                                <TeamContacts />
                            </PinLock>
                        } />
                        <Route path="/payments" element={
                            <PinLock>
                                <TeamPayments />
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
                        <Route path="*" element={
                            <PinLock>
                                <TeamLanding />
                            </PinLock>
                        } />
                    </Routes>
                </main>
            </Router>
        </AppProvider>
    );
};

export default App;
