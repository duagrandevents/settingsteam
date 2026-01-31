import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Truck, Calendar, ChevronRight, Bell, Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const TeamLanding = () => {
    const { sites } = useApp();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    useEffect(() => {
        // Notification Logic
        const lastSeenCount = parseInt(localStorage.getItem('team_last_seen_sites')) || 0;
        if (sites.length > lastSeenCount) {
            setShowNotification(true);
        }

        // Install Prompt Logic
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [sites.length]);

    const handleMarkAsSeen = () => {
        localStorage.setItem('team_last_seen_sites', sites.length.toString());
        setShowNotification(false);
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallBanner(false);
        }
    };

    return (
        <div className="container animate-slide-up max-w-lg mx-auto pb-24">
            {showNotification && (
                <div
                    className="status-notification flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform"
                    onClick={handleMarkAsSeen}
                >
                    <div className="bg-white/20 p-2 rounded-full animate-pulse">
                        <Bell size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-sm">New Mission Assigned!</span>
                    <X size={16} className="opacity-50 group-hover:opacity-100" />
                </div>
            )}

            <div className="pt-8"></div>

            {showInstallBanner && (
                <div className="premium-glass install-banner mb-8 border-primary/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <Download className="text-primary relative z-10" size={32} />
                    <div className="relative z-10">
                        <h4 className="font-bold text-lg">Native Experience</h4>
                        <p className="text-xs text-text-muted">Add to home screen for instant access</p>
                    </div>
                    <div className="flex gap-3 w-full relative z-10">
                        <button onClick={handleInstallClick} className="btn-primary flex-1 py-3 text-xs">Install Now</button>
                        <button
                            onClick={() => setShowInstallBanner(false)}
                            className="btn-secondary py-3 px-4 hover:bg-white/10"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim px-2">Assigned Site</h2>
                {sites.length === 0 ? (
                    <div className="text-center py-16 premium-glass border-dashed border-white/10">
                        <Package size={48} className="mx-auto mb-4 text-white/10" />
                        <p className="text-text-dim font-medium">No sites assigned yet.</p>
                    </div>
                ) : (
                    sites.map(site => (
                        <div
                            key={site.id}
                            onClick={() => navigate(`/team/site/${site.id}/outbound`)}
                            className="premium-glass p-6 flex items-center justify-between cursor-pointer active:scale-95 hover:bg-white/[0.02] group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                    <Calendar size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{site.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-text-dim font-medium uppercase tracking-wider">
                                        <span>{site.date && typeof site.date === 'string' ? site.date.split('-').reverse().join('-') : 'No Date'}</span>
                                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                        <span className={`text-[10px] ${site.status === 'completed' ? 'text-success' :
                                            site.status === 'outbound_complete' ? 'text-accent' :
                                                'text-primary'
                                            }`}>
                                            {site.status ? String(site.status).replace('_', ' ') : 'ASSIGNED'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-text-dim group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamLanding;
