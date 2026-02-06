import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Calendar, Package, ArrowRight, Trash2, LayoutDashboard, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const { sites, deleteSite, loading, dbError, appSettings, updateSetting } = useApp();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [newSite, setNewSite] = useState({ name: '', date: '' });
    const [copied, setCopied] = useState(false);

    // Settings Logic
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [pinInput, setPinInput] = useState('');

    useEffect(() => {
        if (showSettingsModal) {
            setPinInput(appSettings['team_pin'] || '1234');
        }
    }, [showSettingsModal, appSettings]);

    const handleCreateSite = (e) => {
        e.preventDefault();
        navigate('/create-inventory', { state: newSite });
    };

    const sqlScript = `create table if not exists sites (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  date text,
  status text default 'assigned',
  products jsonb default '[]'::jsonb
);

alter table sites disable row level security;
alter publication supabase_realtime add table sites;`;

    const handleCopySQL = () => {
        navigator.clipboard.writeText(sqlScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            {/* STICKY HEADER */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            DUA ADMIN
                        </span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 700, margin: '2px 0 0 0', textTransform: 'uppercase' }}>Control Center</p>
                </div>
                <button
                    onClick={() => setShowSettingsModal(true)}
                    style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1', padding: '10px', borderRadius: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Settings size={20} />
                </button>
            </header>

            {/* ERROR / SETUP NOTICES */}
            <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 24px' }}>
                {dbError && (dbError.code === 'PGRST116' || dbError.code === 'PGRST205' || dbError.message?.includes('relation "sites" does not exist')) && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '24px', padding: '24px', marginTop: '32px', textAlign: 'center'
                    }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Package size={32} color="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Database Error</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Table 'sites' missing.</p>

                        <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <pre style={{ margin: 0, fontSize: '11px', color: '#60a5fa', overflowX: 'auto' }}>
                                {sqlScript}
                            </pre>
                            <button
                                onClick={handleCopySQL}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: copied ? '#10b981' : 'rgba(255,255,255,0.1)',
                                    color: 'white', border: 'none', padding: '8px 16px',
                                    borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                {copied ? 'COPIED!' : 'COPY'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* SITES LIST */}
            <div style={{
                display: 'flex', flexDirection: 'column',
                gap: '16px', padding: '24px', maxWidth: '500px', margin: '0 auto'
            }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
                        <div className="animate-pulse" style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Connecting...</div>
                    </div>
                ) : !dbError && sites && sites.length > 0 ? sites.map(site => (
                    <div
                        key={site.id}
                        style={{
                            background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px',
                            padding: '20px', cursor: 'pointer', position: 'relative',
                            transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => navigate(`/site/${site.id}`)}
                        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2 }}>{site.name || 'Unnamed Site'}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                                    <Calendar size={13} style={{ color: '#60a5fa' }} />
                                    <span>{site.date.split('-').reverse().join('-')}</span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Delete this site?')) deleteSite(site.id);
                                }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* PRODUCT PREVIEW WITH PROGRESS */}
                        {site.products && site.products.length > 0 && (
                            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Progress</span>
                                    <span style={{
                                        color: site.status === 'completed' ? '#10b981' : site.status === 'outbound_complete' ? '#f59e0b' : '#3b82f6',
                                        fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'
                                    }}>
                                        {String(site.status || 'ASSIGNED').replace('_', ' ')}
                                    </span>
                                </div>
                                {site.products.slice(0, 3).map((p, i) => {
                                    const hasStarted = site.status === 'outbound_complete' || site.status === 'completed';
                                    return (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: i < site.products.slice(0, 3).length - 1 ? '4px' : 0 }}>
                                            <span style={{ color: '#cbd5e1' }}>{p.name}</span>
                                            <span style={{ fontWeight: 700, color: hasStarted && (p.collected || 0) < p.count ? '#f59e0b' : '#64748b' }}>
                                                {hasStarted ? `${p.collected || 0}/${p.count}` : p.count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.1)', opacity: 0.5 }}>
                        <LayoutDashboard size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>No Missions Active</h3>
                        <p style={{ fontSize: '13px' }}>Deploy a new site to get started.</p>
                    </div>
                )}
            </div>

            {/* FLOATING ACTION BUTTON */}
            {!dbError && (
                <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            border: 'none', color: 'white',
                            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                    >
                        <Plus size={32} />
                    </button>
                </div>
            )}

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

            {/* SETTINGS MODAL */}
            {showSettingsModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Settings size={32} color="#6366f1" />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px 0' }}>Security</h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Update Team App PIN code.</p>

                        <div style={{ marginBottom: '24px' }}>
                            <input
                                type="text"
                                maxLength={4}
                                pattern="\d*"
                                placeholder="0000"
                                value={pinInput}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setPinInput(val);
                                }}
                                style={{
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', padding: '16px', borderRadius: '16px',
                                    fontSize: '32px', fontWeight: 900, textAlign: 'center', letterSpacing: '0.2em',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" onClick={() => setShowSettingsModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
                            <button
                                onClick={() => {
                                    if (pinInput.length === 4) {
                                        updateSetting('team_pin', pinInput);
                                        setShowSettingsModal(false);
                                    }
                                }}
                                disabled={pinInput.length !== 4}
                                style={{ flex: 1, background: pinInput.length === 4 ? '#6366f1' : '#334155', border: 'none', color: pinInput.length === 4 ? 'white' : '#64748b', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: pinInput.length === 4 ? 'pointer' : 'not-allowed' }}
                            >
                                SAVE PIN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
