import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Truck, Calendar, ChevronRight, Bell, Download, X, Package, MapPin, Contact, IndianRupee } from 'lucide-react';

const TeamLanding = () => {
    const { sites, loading, completeSiteWithTeam } = useApp();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    const [isIOS, setIsIOS] = useState(false);
    const [prevSiteCount, setPrevSiteCount] = useState(0);

    // Terminalize Modal State
    const [showTerminalizeModal, setShowTerminalizeModal] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [teamMembers, setTeamMembers] = useState(['']);

    const handleTerminalize = (site) => {
        setSelectedSite(site);
        setShowTerminalizeModal(true);
        setTeamMembers(['']); // Reset with one empty input
    };

    const addTeamMemberInput = () => {
        setTeamMembers([...teamMembers, '']);
    };

    const removeTeamMemberInput = (index) => {
        const updated = teamMembers.filter((_, idx) => idx !== index);
        setTeamMembers(updated.length > 0 ? updated : ['']);
    };

    const updateTeamMember = (index, value) => {
        const updated = [...teamMembers];
        updated[index] = value;
        setTeamMembers(updated);
    };

    const submitTerminalize = async () => {
        const names = teamMembers.filter(name => name.trim() !== '');
        if (names.length === 0) {
            alert('Please enter at least one team member name');
            return;
        }

        const { error } = await completeSiteWithTeam(selectedSite.id, names);
        if (!error) {
            setShowTerminalizeModal(false);
            setSelectedSite(null);
            setTeamMembers(['']);
        } else {
            alert('Error completing site. Please try again.');
        }
    };

    // VAPID Public Key
    const publicVapidKey = 'BC6YTs1AcEQB1nhIp11jlDyL5cY7iHu8OS_g76_FrfWQv8maOLg0IoLDKJu4uMrJhJN_rs5n3gCXzywm3SwOXaI';

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Subscribe to Push
    const subscribeToPush = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                });

                // Save to Supabase
                // Note: User needs to create 'push_subscriptions' table: id (int8), subscription (jsonb), created_at (timestamptz)
                const { error } = await supabase.from('push_subscriptions').insert({ subscription });
                if (error) console.error('Subscription DB Error:', error);
                else console.log('Push Subscribed!');

            } catch (error) {
                console.error('Push Subscription Error:', error);
            }
        }
    };

    // Notification Logic (Client Side + Subscription Init)
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
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') subscribeToPush();
                });
            } else if (Notification.permission === 'granted') {
                subscribeToPush();
            }
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
        <>
            <div style={{ padding: '0 0 140px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
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
                                    onClick={() => {
                                        if (!site.status || site.status === 'assigned') {
                                            navigate(`/site/${site.id}/outbound`);
                                        }
                                    }}
                                    style={{
                                        background: site.status === 'completed'
                                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
                                            : site.status === 'outbound_complete'
                                                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))'
                                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                                        border: `2px solid ${site.status === 'completed' ? '#10b981' :
                                            site.status === 'outbound_complete' ? '#f59e0b' : '#3b82f6'
                                            }`,
                                        borderRadius: '24px', padding: '24px',
                                        display: 'flex', flexDirection: 'column', gap: '20px',
                                        transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        cursor: (!site.status || site.status === 'assigned') ? 'pointer' : 'default',
                                        position: 'relative'
                                    }}
                                    className={(!site.status || site.status === 'assigned') ? "touch-active hover:bg-white/5" : ""}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                                <Calendar size={24} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>{site.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 700 }}>
                                                    <Calendar size={14} /> <span>{site.date.split('-').reverse().join('-')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Paid Badge */}
                                        {site.payment_status === 'paid' && (
                                            <div style={{
                                                position: 'absolute', top: '16px', right: '16px',
                                                background: '#10b981', borderRadius: '50%',
                                                width: '28px', height: '28px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                                            }}>
                                                <span style={{ fontSize: '16px' }}>✓</span>
                                            </div>
                                        )}

                                        {(!site.status || site.status === 'assigned') && (
                                            <div style={{
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                borderRadius: '50%', width: '40px', height: '40px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <ChevronRight size={24} color="#3b82f6" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons - Always visible */}
                                    {site.status && site.status !== 'assigned' && (
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
                        <div style={{
                            textAlign: 'center', marginTop: '40px', paddingBottom: '20px', color: '#64748b', fontSize: '10px'
                        }}>
                            DUA LOGISTICS TEAM v1.2
                        </div>
                    </div>
                </div>
            </div>

            {/* Instagram-Style Docked Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-[99999]" style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
                backdropFilter: 'blur(20px)',
                borderTop: '0.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 -2px 20px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    padding: '8px 0 8px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    {/* Contact Button */}
                    <button
                        onClick={() => navigate('/contacts')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            color: '#ffffff'
                        }}
                        className="touch-active"
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Contact size={26} strokeWidth={1.5} />
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            opacity: 0.9
                        }}>Contact</span>
                    </button>

                    {/* Center Divider (optional) */}
                    <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)'
                    }}></div>

                    {/* Payment Button */}
                    <button
                        onClick={() => navigate('/payments')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            color: '#ffffff'
                        }}
                        className="touch-active"
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <IndianRupee size={26} strokeWidth={1.5} />
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            opacity: 0.9
                        }}>Payment</span>
                    </button>
                </div>
            </div>

            {/* Terminalize Modal */}
            {showTerminalizeModal && selectedSite && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '420px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#f59e0b' }}>Complete Site</h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Enter team member names for <strong>{selectedSite.name}</strong></p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {teamMembers.map((member, index) => (
                                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder={`Team Member ${index + 1}`}
                                        value={member}
                                        onChange={(e) => updateTeamMember(index, e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', padding: '12px', borderRadius: '12px',
                                            fontSize: '15px', fontWeight: 600
                                        }}
                                    />
                                    {teamMembers.length > 1 && (
                                        <button
                                            onClick={() => removeTeamMemberInput(index)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)', border: 'none',
                                                color: '#ef4444', padding: '12px', borderRadius: '12px',
                                                cursor: 'pointer', fontWeight: 700
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addTeamMemberInput}
                            style={{
                                width: '100%',
                                background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed rgba(59, 130, 246, 0.3)',
                                color: '#3b82f6', padding: '12px', borderRadius: '12px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                textTransform: 'uppercase', marginBottom: '24px'
                            }}
                        >
                            + Add Team Member
                        </button>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowTerminalizeModal(false)}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)', border: 'none',
                                    color: '#94a3b8', padding: '14px', borderRadius: '12px',
                                    fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitTerminalize}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    border: 'none', color: 'white', padding: '14px', borderRadius: '12px',
                                    fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase',
                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                                }}
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeamLanding;
