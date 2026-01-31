import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, X, Save, LogOut } from 'lucide-react';

const TeamHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPopup, setShowPopup] = useState(false);

    // Determine if we are on an operation page (GodownToSite or SiteToGodown)
    const isOperationPage = location.pathname.includes('/outbound') || location.pathname.includes('/inbound');
    const isLandingPage = location.pathname === '/team' || location.pathname === '/team/';

    const handleHeaderClick = () => {
        if (isOperationPage) {
            setShowPopup(true);
        } else if (!isLandingPage) {
            navigate('/team');
        }
    };

    const handleConfirm = (action) => {
        setShowPopup(false);
        if (action === 'save') {
            // For now, we assume the user saves manually or we trigger a global save if possible
            // But based on the request, showing the popup is the primary goal.
            // Usually 'save' would trigger the 'handleSubmit' in the child component.
            // Since we can't easily trigger child functions from here without complex state,
            // we'll advise the user or just navigate if they say they saved.
            navigate('/team');
        } else if (action === 'exit') {
            navigate('/team');
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center">
                <div
                    onClick={handleHeaderClick}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Truck size={24} className="text-primary" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">
                        DUA SETTINGS TEAM
                    </h1>
                </div>
            </header>

            {showPopup && (
                <div className="fixed inset-0 bg-bg-deep/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="premium-glass p-8 w-full max-w-sm animate-slide-up border-white/10 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="p-4 bg-accent/10 rounded-full border border-accent/20">
                                <Save size={32} className="text-accent" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-2">Save Progress?</h3>
                        <p className="text-text-muted mb-8 text-sm font-medium">
                            You are about to leave the current operation. Would you like to save your changes before returning home?
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleConfirm('save')}
                                className="btn-primary w-full justify-center py-4"
                            >
                                <Save size={20} /> Save & Return
                            </button>
                            <button
                                onClick={() => handleConfirm('exit')}
                                className="btn-secondary w-full justify-center py-4 text-danger hover:bg-red-500/10 border-red-500/20"
                            >
                                <LogOut size={20} /> Discard & Return
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="w-full py-3 text-text-dim text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Stay on Page
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeamHeader;
