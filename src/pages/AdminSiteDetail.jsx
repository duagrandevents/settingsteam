import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Save, Plus, Trash2, ArrowLeft, Edit2, AlertTriangle, Share2, Calendar, Copy } from 'lucide-react';

const AdminSiteDetail = () => {
    const { siteId } = useParams();
    const { getSite, updateSite, loading } = useApp();
    const navigate = useNavigate();
    const [site, setSite] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editProducts, setEditProducts] = useState([]);

    useEffect(() => {
        const data = getSite(siteId);
        if (data) {
            setSite(data);
            setEditProducts(data.products || []);
        }
    }, [siteId, getSite]);

    if (loading) {
        return (
            <div style={{ padding: '100px 24px', textAlign: 'center', color: '#94a3b8', background: '#020617', minHeight: '100vh' }}>
                <div className="animate-pulse" style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>Retrieving Cloud Data...</div>
            </div>
        );
    }

    if (!site) {
        return (
            <div style={{ padding: '100px 24px', textAlign: 'center', color: '#94a3b8', background: '#020617', minHeight: '100vh' }}>
                <AlertTriangle size={48} style={{ margin: '0 auto 16px', color: '#ef4444' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>Site Not Found</h2>
                <p style={{ margin: '8px 0 24px' }}>The requested deployment could not be located.</p>
                <button onClick={() => navigate('/admin')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>BACK TO DASHBOARD</button>
            </div>
        );
    }

    const handleSave = () => {
        updateSite(siteId, { products: editProducts });
        setSite({ ...site, products: editProducts });
        setIsEditing(false);
    };

    const generateReport = (type) => {
        const title = type === 'collection' ? 'COLLECTION REPORT' : 'RETURN REPORT';
        let reportText = `*${title} - ${site.name}*\nDate: ${site.date}\n\n`;

        editProducts.forEach(p => {
            const taken = p.collected || 0;
            const returned = p.returned || 0;
            if (type === 'collection') {
                reportText += `- ${p.name}: ${taken}\n`;
            } else {
                const missing = taken - returned;
                reportText += `- ${p.name}: Taken ${taken}, Ret ${returned}${missing > 0 ? ` (*MISSING ${missing}*)` : ''}\n`;
            }
        });
        return reportText;
    };

    const handleShareReport = (type) => {
        const reportText = generateReport(type);
        const url = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
        window.open(url, '_blank');
    };

    const handleCopyReport = (type) => {
        const reportText = generateReport(type);
        navigator.clipboard.writeText(reportText);
        alert('Report copied to clipboard!');
    };

    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '30px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, textTransform: 'uppercase' }}>{site.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                            <Calendar size={14} /> <span>{site.date}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    style={{
                        background: isEditing ? '#10b981' : '#3b82f6',
                        color: 'white', border: 'none', padding: '12px 24px',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    {isEditing ? <><Save size={18} /> SAVE CHANGES</> : <><Edit2 size={18} /> EDIT INVENTORY</>}
                </button>
            </header>

            <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Item</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Target</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Taken</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ret</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Gap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editProducts.map((p, i) => {
                                const taken = p.collected || 0;
                                const returned = p.returned || 0;
                                const gap = taken - returned;
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '16px', fontWeight: 700 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {isEditing ? (
                                                    <input value={p.name} onChange={e => {
                                                        const newP = [...editProducts];
                                                        newP[i].name = e.target.value;
                                                        setEditProducts(newP);
                                                    }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px', borderRadius: '8px', width: '100%' }} />
                                                ) : (
                                                    <>
                                                        {p.name}
                                                        {p.isNew && (
                                                            <span style={{ fontSize: '9px', fontWeight: 900, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>
                                                                Team Added
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: 900, color: '#94a3b8' }}>{isEditing ? <input type="number" value={p.count} onChange={e => {
                                            const newP = [...editProducts];
                                            newP[i].count = parseInt(e.target.value) || 0;
                                            setEditProducts(newP);
                                        }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px', borderRadius: '8px', width: '60px', textAlign: 'center' }} /> : p.count}</td>
                                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700 }}>{taken}</td>
                                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700 }}>{returned}</td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            {gap > 0 ? <span style={{ color: '#ef4444', fontWeight: 900 }}>{gap}</span> : <span style={{ opacity: 0.2 }}>-</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* REPORTS SECTION */}
                <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase' }}>Reports Area</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleShareReport('collection')} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <Share2 size={16} /> SHARE
                                </button>
                                <button onClick={() => handleCopyReport('collection')} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <Copy size={16} /> COPY
                                </button>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }}></div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleShareReport('return')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <Share2 size={16} /> SHARE
                                </button>
                                <button onClick={() => handleCopyReport('return')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <Copy size={16} /> COPY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSiteDetail;
