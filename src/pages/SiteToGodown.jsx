import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

const SiteToGodown = () => {
    const { siteId } = useParams();
    const { getSite, updateSite, sites } = useApp();
    const navigate = useNavigate();

    // Derive site directly from context
    const site = sites.find(s => String(s.id) === String(siteId));

    const [returnItems, setReturnItems] = useState([]);

    // Initialize return items when site is loaded
    useEffect(() => {
        if (site && returnItems.length === 0) {
            setReturnItems(site.products.map(p => ({
                ...p,
                returned: p.returned !== undefined ? p.returned : 0
            })));
        }
    }, [site]); // Only depend on site

    if (!site) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading mission data...</div>;

    const handleReturnChange = (index, val) => {
        const newItems = [...returnItems];
        newItems[index].returned = parseInt(val) || 0;
        setReturnItems(newItems);
    };

    const handleSave = () => {
        updateSite(siteId, {
            products: returnItems,
            status: 'completed'
        });
        alert('Mission Logistic Report Submitted!');
        navigate('/');
    };

    return (
        <>
            <div style={{ padding: '0 0 140px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                <header style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>{site.name}</h2>
                        <p style={{ margin: '4px 0 0', fontSize: '10px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Phase 2: Site ➔ Godown</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>


                    </div>
                </header>

                <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Item</th>
                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Taken</th>
                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Back</th>
                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Gaps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnItems.map((p, i) => {
                                    const taken = p.collected || 0;
                                    const back = p.returned || 0;
                                    const gap = taken - back;
                                    return (
                                        <tr key={i} className="animate-enter" style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                                            background: p.isAdminAdded ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                                            animationDelay: `${i * 0.03}s`
                                        }}>
                                            <td style={{ padding: '20px 16px', fontWeight: 700 }}>
                                                <div>
                                                    {p.name}
                                                    {p.isAdminAdded && (
                                                        <div style={{ fontSize: '10px', color: '#3b82f6', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 900 }}>
                                                            Management Request
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 16px', textAlign: 'center', fontWeight: 900, fontSize: '20px', color: '#94a3b8' }}>{taken}</td>
                                            <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                                <input
                                                    type="number"
                                                    value={p.returned || ''}
                                                    onChange={e => handleReturnChange(i, e.target.value)}
                                                    placeholder="0"
                                                    style={{
                                                        width: '80px', height: '50px',
                                                        textAlign: 'center', fontSize: '20px', fontWeight: 900,
                                                        background: 'rgba(0,0,0,0.2)', border: gap === 0 ? '2px solid #10b981' : gap > 0 ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                                        color: gap === 0 ? '#10b981' : gap > 0 ? '#ef4444' : 'white',
                                                        borderRadius: '12px', outline: 'none'
                                                    }}
                                                />
                                            </td>
                                            <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                                {gap > 0 ? (
                                                    <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                        -{gap} <AlertTriangle size={14} />
                                                    </div>
                                                ) : (
                                                    <div style={{ color: '#10b981' }}>
                                                        <Check size={24} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-[99999] bg-bg-primary/98 backdrop-blur-xl border-t border-white/10">
                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 hover:from-emerald-500 hover:via-emerald-300 hover:to-emerald-500 text-white py-5 pb-9 text-xl font-black shadow-[0_-4px_40px_rgba(16,185,129,0.6)] flex items-center justify-center gap-3 uppercase tracking-wider transition-all duration-500 active:scale-[0.96] hover:shadow-[0_-8px_60px_rgba(16,185,129,0.9)]"
                    style={{
                        borderRadius: 0,
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 2s ease infinite, pulse-glow 2s ease-in-out infinite',
                        boxShadow: '0 -4px 40px rgba(16,185,129,0.6), inset 0 2px 20px rgba(255,255,255,0.2)'
                    }}
                >
                    <CheckCircle size={26} className="animate-pulse" />
                    <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>TERMINALIZE</span>
                </button>
            </div>
        </>
    );
};

export default SiteToGodown;
