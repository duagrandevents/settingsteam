import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Calendar, Package, ArrowRight, Trash2, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
    const { sites, deleteSite, loading } = useApp();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [newSite, setNewSite] = useState({ name: '', date: '' });

    const handleCreateSite = (e) => {
        e.preventDefault();
        navigate('/admin/create-inventory', { state: newSite });
    };

    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            {/* STICKY HEADER */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '40px 24px', textAlign: 'center'
            }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        DUA SETTINGS ADMIN
                    </span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 500, margin: '0 0 24px 0' }}>Control Center & Live Ops</p>

                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: 'white', border: 'none', padding: '16px 40px',
                        borderRadius: '100px', fontSize: '18px', fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                        display: 'inline-flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Plus size={24} /> Deploy New Site
                </button>
            </header>

            {/* SITES GRID */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px', padding: '32px 24px', maxWidth: '1200px', margin: '0 auto'
            }}>
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', opacity: 0.5 }}>
                        <div className="animate-pulse" style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Connecting to Cloud...</div>
                    </div>
                ) : sites && sites.length > 0 ? sites.map(site => (
                    <div
                        key={site.id}
                        style={{
                            background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px',
                            padding: '24px', cursor: 'pointer', position: 'relative',
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}
                        onClick={() => navigate(`/admin/site/${site.id}`)}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3b82f6', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2 }}>{site.name || 'Unnamed Site'}</h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Delete this site?')) deleteSite(site.id);
                                }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{
                                background: site.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : site.status === 'outbound_complete' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: site.status === 'completed' ? '#10b981' : site.status === 'outbound_complete' ? '#f59e0b' : '#3b82f6',
                                border: '1px solid currentColor',
                                padding: '4px 12px',
                                borderRadius: '100px', fontSize: '10px', fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: '0.1em'
                            }}>
                                {String(site.status || 'ASSIGNED').replace('_', ' ')}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} style={{ color: '#60a5fa' }} />
                                <span>{site.date || 'No Date'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={14} style={{ color: '#818cf8' }} />
                                <span>{(site.products || []).length} Items Logged</span>
                            </div>
                        </div>

                        {/* PRODUCT PREVIEW WITH PROGRESS */}
                        {site.products && site.products.length > 0 && (
                            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                {site.products.slice(0, 3).map((p, i) => {
                                    const hasStarted = site.status === 'outbound_complete' || site.status === 'completed';
                                    return (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: i < site.products.slice(0, 3).length - 1 ? '6px' : 0 }}>
                                            <span style={{ color: '#94a3b8' }}>{p.name}</span>
                                            <span style={{ fontWeight: 700, color: hasStarted && (p.collected || 0) < p.count ? '#f59e0b' : 'inherit' }}>
                                                {hasStarted ? `${p.collected || 0}/${p.count}` : p.count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: '#3b82f6', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Open Command Center</span>
                            <ArrowRight size={16} color="#3b82f6" />
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', borderRadius: '20px', border: '2px dashed rgba(255,255,255,0.1)', opacity: 0.5 }}>
                        <LayoutDashboard size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, textTransform: 'uppercase' }}>No Deployments Active</h3>
                        <p style={{ fontSize: '14px' }}>Start by deploying a new site mission.</p>
                    </div>
                )}
            </div>

            {/* DEPLOY MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 32px 0' }}>Deploy Mission</h2>
                        <form onSubmit={handleCreateSite} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <input
                                required
                                placeholder="SITE NAME"
                                value={newSite.name}
                                onChange={e => setNewSite({ ...newSite, name: e.target.value.toUpperCase() })}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 700, textAlign: 'center' }}
                            />
                            <input
                                required
                                type="date"
                                value={newSite.date}
                                onChange={e => setNewSite({ ...newSite, date: e.target.value })}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 700, textAlign: 'center' }}
                            />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>ABORT</button>
                                <button type="submit" style={{ flex: 1, background: '#3b82f6', border: 'none', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>START PHASE 2</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
