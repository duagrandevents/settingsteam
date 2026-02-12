import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Truck, Save, LogOut, Phone, MapPin } from 'lucide-react';

const TeamHeader = () => {
    const { getSite, sites, updateSite } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPopup, setShowPopup] = useState(false);

    const isOperationPage = location.pathname.includes('/outbound') || location.pathname.includes('/inbound');
    const isLandingPage = location.pathname === '/' || location.pathname.endsWith('/team');

    // Extract siteId from path: /site/:siteId/...
    const siteId = location.pathname.startsWith('/site/') ? location.pathname.split('/')[2] : null;
    const currentSite = siteId ? getSite(siteId) : null;

    useEffect(() => {
        if (siteId && !currentSite) {
            console.log('Debug: Site ID found in URL but not in Context', siteId, sites);
        }
    }, [siteId, currentSite, sites]);

    const handleHeaderClick = () => {
        if (isOperationPage) setShowPopup(true);
        else if (!isLandingPage) navigate('/');
    };

    const handleConfirm = (action) => {
        setShowPopup(false);
        navigate('/');
    };

    return (
        <>
            <header style={{
                position: 'sticky', top: 0, zIndex: 500,
                background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div
                    onClick={handleHeaderClick}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                >
                    <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                        <Truck size={24} color="#3b82f6" />
                    </div>
                    <h1 style={{
                        margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em',
                        background: 'linear-gradient(to right, #60a5fa, #818cf8)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase'
                    }}>
                        DUA SETTINGS TEAM
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {currentSite && (
                        currentSite.location ? (
                            <a
                                href={currentSite.location}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '10px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderRadius: '50%',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                                    flexShrink: 0,
                                    textDecoration: 'none'
                                }}
                                title="VIEW MAP"
                            >
                                <MapPin size={20} />
                            </a>
                        ) : (
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!navigator.geolocation) {
                                        alert('Geolocation is not supported by your browser');
                                        return;
                                    }
                                    const btn = e.currentTarget;
                                    const originalContent = btn.innerHTML;
                                    btn.innerHTML = '...';

                                    navigator.geolocation.getCurrentPosition(async (position) => {
                                        const { latitude, longitude } = position.coords;
                                        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

                                        await updateSite(currentSite.id, { location: url });
                                        alert('Location Saved!');
                                    }, (error) => {
                                        alert('Unable to retrieve your location. Please allow GPS access.');
                                        btn.innerHTML = originalContent;
                                    });
                                }}
                                style={{
                                    padding: '10px',
                                    background: 'rgba(234, 179, 8, 0.1)',
                                    border: '1px solid rgba(234, 179, 8, 0.2)',
                                    borderRadius: '50%',
                                    color: '#ca8a04',
                                    display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(234, 179, 8, 0.2)',
                                    flexShrink: 0
                                }}
                                title="ADD LOCATION"
                            >
                                <MapPin size={20} />
                            </button>
                        )
                    )}
                    <a
                        href="tel:+918606339671"
                        style={{
                            padding: '10px', background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '50%', color: '#10b981', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                            flexShrink: 0
                        }}
                        title="CALL HQ"
                    >
                        <Phone size={20} fill="currentColor" style={{ opacity: 0.2, position: 'absolute' }} />
                        <Phone size={20} />
                    </a>
                </div>
            </header>

            {/* EXIT CONFIRMATION MODAL */}
            {showPopup && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px 32px', borderRadius: '32px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Save size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 900 }}>SAVE PROGRESS?</h3>
                        <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>You are about to leave the current operation. Ensure you have saved your changes before returning home.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => handleConfirm('save')}
                                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                <Save size={18} /> I'VE SAVED & RETURN
                            </button>
                            <button
                                onClick={() => handleConfirm('exit')}
                                style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                <LogOut size={18} /> DISCARD & RETURN
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                style={{ background: 'none', border: 'none', color: '#64748b', marginTop: '12px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                            >
                                STAY ON PAGE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeamHeader;
