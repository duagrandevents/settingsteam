import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Calendar, Package, ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { sites, addSite, deleteSite } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [newSite, setNewSite] = useState({ name: '', date: '' });
    const [newItems, setNewItems] = useState([{ name: '', count: '' }]); // Table based input
    const navigate = useNavigate();

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!newSite.name || !newSite.date) return;

        navigate('/shabeeradmindua/create-inventory', {
            state: { name: newSite.name, date: newSite.date }
        });
        setShowModal(false);
    };

    return (
        <div className="container pb-32">
            <header className="flex flex-col items-center justify-center mb-12 py-10 gap-6" style={{ position: 'sticky', top: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', zIndex: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        <span style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, textTransform: 'uppercase' }}>
                            DUA SETTINGS ADMIN
                        </span>
                    </h1>
                    <p className="text-text-muted text-lg font-medium">Control Center & Live Ops</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                    style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '100px', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)' }}
                >
                    <Plus size={24} /> Deploy New Site
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(sites) && sites.length > 0 ? sites.map(site => (
                    <div
                        key={site.id}
                        className="premium-glass card-hover"
                        style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                        onClick={() => navigate(`/shabeeradmindua/site/${site.id}`)}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'rgba(59, 130, 246, 0.5)' }}></div>

                        <div style={{ padding: '1.75rem' }}>
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingRight: '2rem' }}>
                                <h3 className="text-2xl font-black uppercase tracking-tight" style={{ margin: 0, lineHeight: 1.2 }}>{site.name || 'UNNAMED SITE'}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this site and all associated reports?')) {
                                            deleteSite(site.id);
                                        }
                                    }}
                                    style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', color: 'rgba(255, 255, 255, 0.4)', border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '100px',
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    border: '1px solid currentColor',
                                    backgroundColor: site.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : site.status === 'outbound_complete' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                    color: site.status === 'completed' ? '#10b981' : site.status === 'outbound_complete' ? '#f59e0b' : '#3b82f6'
                                }}>
                                    {site.status ? String(site.status).replace('_', ' ') : 'ASSIGNED'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem' }}>
                                        <Calendar size={16} style={{ color: '#60a5fa' }} />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                        {site.date && typeof site.date === 'string' ? site.date.split('-').reverse().join('-') : 'N/A'}
                                    </span>
                                </div>

                                {site.products && site.products.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <Package size={14} style={{ color: '#818cf8' }} />
                                            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.3)' }}>Inventory Checklist</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {site.products.slice(0, 3).map((p, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>{p.name}</span>
                                                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{p.count}</span>
                                                </div>
                                            ))}
                                            {site.products.length > 3 && (
                                                <div style={{ fontSize: '11px', fontWeight: 700, fontStyle: 'italic', color: 'rgba(59, 130, 246, 0.6)', marginTop: '2px' }}>
                                                    + {site.products.length - 3} more items
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.01)' }}>
                            <span className="text-primary" style={{ fontWeight: 900, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Command Center</span>
                            <ArrowRight size={16} className="text-primary" />
                        </div>
                    </div>
                )) : (
                    <div className="premium-glass p-12 text-center col-span-full border-dashed" style={{ opacity: 0.6, borderStyle: 'dashed' }}>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-white/5 rounded-full"><Plus size={40} className="text-text-dim" /></div>
                        </div>
                        <h3 className="text-xl font-bold text-text-muted mb-2 uppercase">No Deployments Active</h3>
                        <p className="text-text-dim max-w-xs mx-auto text-sm">Use the "Deploy New Site" button above to start your first mission assignment.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="premium-glass p-10 w-full animate-slide-up" style={{ maxWidth: '32rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center', margin: 'auto' }}>
                        <div className="flex flex-col items-center gap-4 mb-10">
                            <div className="p-4 bg-primary" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '1.5rem' }}>
                                <Plus size={40} className="text-primary" />
                            </div>
                            <h2 className="text-4xl font-black uppercase italic" style={{ tracking: '-0.05em', margin: 0 }}>Deploy Mission</h2>
                        </div>

                        <form onSubmit={handleNextStep} className="space-y-10">
                            <div className="space-y-8">
                                <div style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        required
                                        className="input-field py-5 text-xl font-bold"
                                        style={{ textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.03)' }}
                                        value={newSite.name}
                                        onChange={e => setNewSite({ ...newSite, name: e.target.value })}
                                        placeholder="ENTER SITE NAME"
                                    />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <input
                                        type="date"
                                        required
                                        className="input-field py-5 text-xl font-bold uppercase"
                                        style={{ textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.03)' }}
                                        value={newSite.date}
                                        onChange={e => setNewSite({ ...newSite, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-4 uppercase font-black tracking-widest text-xs">Abort</button>
                                <button type="submit" className="btn-primary flex-1 py-4 uppercase font-black tracking-widest text-xs justify-center shadow-primary/20">
                                    Next Phase <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
