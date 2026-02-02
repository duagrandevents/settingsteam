import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Truck, Calendar, ChevronRight, Bell, Download, X, Package } from 'lucide-react';

const TeamLanding = () => {
    const { sites, loading } = useApp();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    const [isIOS, setIsIOS] = useState(false);
    const [prevSiteCount, setPrevSiteCount] = useState(0);

    // Notification Logic
    const playNotificationSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.error('Audio error', e);
        }
    };

    const triggerNotification = (siteName) => {
        playNotificationSound();
        if (Notification.permission === 'granted') {
            new Notification('New Mission Assigned!', {
                body: `${siteName} has been added to your list.`,
                icon: '/vite.svg',
                vibrate: [200, 100, 200]
            });
        }
        setShowNotification(true);
    };

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const lastSeenCount = parseInt(localStorage.getItem('team_last_seen_sites')) || 0;

        // Track site count changes
        if (sites.length > 0) {
            // If we have more sites than before (and it's not the initial 0 -> N load if we want to avoid spam on refresh, 
            // but for "real time" we need to know if it's a *new* update. 
            // However, useApp loads initial data. We can check against lastSeenCount for the "Badge", 
            // but for the *Tone*, we want it only when the app receives a LIVE update.

            // Allow tone if sites.length > prevSiteCount AND prevSiteCount > 0 (meaning we already had data and got MORE)
            if (prevSiteCount > 0 && sites.length > prevSiteCount) {
                const newSite = sites[0];
                triggerNotification(newSite.name || 'New Site');
            } else if (sites.length > lastSeenCount) {
                // Just the badge on initial load
                setShowNotification(true);
            }
            setPrevSiteCount(sites.length);
        }

        // Check if installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        if (!isStandalone) {
            // Show banner after a slight delay for better UX
            setTimeout(() => setShowInstallBanner(true), 2000);
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, [sites.length]);

    const handleMarkAsSeen = () => {
        localStorage.setItem('team_last_seen_sites', sites.length.toString());
        setShowNotification(false);
    };

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setShowInstallBanner(false);
            }
        } else if (isIOS) {
            alert('To install on iOS:\n1. Tap the Share button below 👇\n2. Scroll down and tap "Add to Home Screen" ➕');
        }
    };

    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            {/* NOTIFICATION */}
            {showNotification && (
                <div
                    onClick={handleMarkAsSeen}
                    style={{
                        background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                        padding: '12px 24px', borderRadius: '100px',
                        position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 1000, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
                    }}
                >
                    <Bell size={18} color="white" />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>New Mission Assigned!</span>
                    <X size={16} style={{ opacity: 0.6 }} />
                </div>
            )}

            <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px' }}>
                {/* INSTALL BANNER */}
                {showInstallBanner && (
                    <div className="animate-fade-in" style={{
                        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '24px',
                        padding: '24px', marginBottom: '32px', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px' }}>
                                <Download size={32} color="#3b82f6" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>INSTALL APP</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                    {isIOS ? 'Tap Share → Add to Home Screen' : 'Add to home screen for best experience'}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleInstallClick} style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {isIOS ? 'HOW TO INSTALL' : 'INSTALL NOW'}
                            </button>
                            <button onClick={() => setShowInstallBanner(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px' }}>
                    <h2 style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px', paddingLeft: '8px' }}>Active Missions</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px 24px', opacity: 0.5 }}>
                                <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="animate-pulse">Connecting to DUA HQ...</p>
                            </div>
                        ) : sites && sites.length > 0 ? sites.map(site => (
                            <div
                                key={site.id}
                                style={{
                                    background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '24px', padding: '24px',
                                    display: 'flex', flexDirection: 'column', gap: '20px',
                                    transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                        <Calendar size={24} color="#3b82f6" />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>{site.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 700 }}>
                                            <Calendar size={14} /> <span>{site.date.split('-').reverse().join('-')}</span>
                                            <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                            <span style={{
                                                color: site.status === 'completed' ? '#10b981' :
                                                    site.status === 'outbound_complete' ? '#f59e0b' : '#3b82f6'
                                            }}>
                                                {String(site.status || 'ASSIGNED').replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {(!site.status || site.status === 'assigned') ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/site/${site.id}/outbound`);
                                        }}
                                        style={{
                                            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                            color: 'white', fontWeight: 900, cursor: 'pointer',
                                            textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.05em',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                        }}
                                    >
                                        <Truck size={20} /> START MISSION
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/site/${site.id}/outbound`);
                                            }}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)',
                                                background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 700, cursor: 'pointer',
                                                textTransform: 'uppercase', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <Truck size={14} /> From Godown
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/site/${site.id}/inbound`);
                                            }}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)',
                                                background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 700, cursor: 'pointer',
                                                textTransform: 'uppercase', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <Package size={14} /> From Site
                                        </button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.1)', opacity: 0.5 }}>
                                <Package size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                                <p style={{ margin: 0, fontWeight: 700 }}>No sites assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamLanding;
