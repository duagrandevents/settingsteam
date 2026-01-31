import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Save, Plus, Trash2, ArrowLeft, Edit2, AlertTriangle, Printer, Share2 } from 'lucide-react';

const AdminSiteDetail = () => {
    const { siteId } = useParams();
    const { getSite, updateSite } = useApp();
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

    if (!site) return <div className="p-10 text-center">Loading...</div>;

    const handleEditChange = (index, field, value) => {
        const newProds = [...editProducts];
        newProds[index] = { ...newProds[index], [field]: value };
        setEditProducts(newProds);
    };

    const handleDeleteProduct = (index) => {
        const newProds = editProducts.filter((_, i) => i !== index);
        setEditProducts(newProds);
    };

    const handleAddProduct = () => {
        setEditProducts([...editProducts, { name: '', count: 0, collected: 0, isNew: false }]);
    };

    const handleSave = () => {
        updateSite(siteId, { products: editProducts });
        setSite({ ...site, products: editProducts });
        setIsEditing(false);
    };

    const handlePrintAndShare = () => {
        const reportText = `*COLLECTION REPORT - ${site.name}*\n` +
            `Date: ${site.date && typeof site.date === 'string' ? site.date.split('-').reverse().join('-') : 'N/A'}\n\n` +
            `*ITEMS COLLECTED:*\n` +
            (site.products || []).map(p => `- ${p.name || 'Item'}: ${p.collected || 0}`).join('\n') +
            `\n\n_Generated from DUA Setting_`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handlePrintReturnReport = () => {
        const reportText = `*RETURN REPORT - ${site.name}*\n` +
            `Date: ${site.date && typeof site.date === 'string' ? site.date.split('-').reverse().join('-') : 'N/A'}\n\n` +
            `*ITEMS RETURNED:*\n` +
            (site.products || []).map(p => {
                const taken = p.collected || 0;
                const returned = p.returned || 0;
                const missing = taken - returned;
                return `- ${p.name || 'Item'}: Taken ${taken}, Returned ${returned}${missing > 0 ? ` (Missing ${missing})` : ''}`;
            }).join('\n') +
            `\n\n_Generated from DUA Setting_`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
        window.open(whatsappUrl, '_blank');
    };

    const isCollectionStarted = site.status === 'outbound_complete' || site.status === 'completed';
    const isReturnComplete = site.status === 'completed';

    return (
        <div className="container pb-32">
            <header className="flex items-center justify-between py-8 mb-10" style={{ position: 'sticky', top: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', zIndex: 30, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/shabeeradmindua')}
                        className="btn-secondary"
                        style={{ padding: '0.75rem', borderRadius: '1rem' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase" style={{ margin: 0 }}>{site.name}</h2>
                        <div className="flex items-center gap-3 text-sm text-text-muted mt-1 font-medium">
                            <Calendar size={16} />
                            <span>{site.date && typeof site.date === 'string' ? site.date.split('-').reverse().join('-') : 'No Date'}</span>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></span>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                {site.status ? String(site.status).replace('_', ' ') : 'Status Pending'}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="btn-primary"
                    style={isEditing ? { background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' } : {}}
                >
                    {isEditing ? <><Save size={20} /> Save Checklist</> : <><Edit2 size={20} /> Edit Inventory</>}
                </button>
            </header>

            <div className="premium-glass overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="text-left">Inventory Item</th>
                                <th className="text-center">Target</th>
                                <th className="text-center">Taken</th>
                                <th className="text-center">Returned</th>
                                <th className="text-center">Deficit</th>
                                {isEditing && <th className="text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {editProducts.map((product, index) => {
                                const taken = product.collected || 0;
                                const returned = product.returned || 0;
                                const missing = taken - returned;

                                return (
                                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: product.isNew ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                                        <td className="font-bold text-lg" style={{ padding: '1.25rem 1rem' }}>
                                            {isEditing ? (
                                                <input
                                                    className="input-field"
                                                    style={{ padding: '0.5rem 1rem' }}
                                                    value={product.name}
                                                    onChange={(e) => handleEditChange(index, 'name', e.target.value)}
                                                />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    {product.name || 'Unnamed Item'}
                                                    {product.isNew && (
                                                        <span style={{ fontSize: '9px', fontWeight: 900, background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            Team Added
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-center font-black text-xl text-text-muted" style={{ padding: '1.25rem 1rem' }}>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ width: '6rem', textAlign: 'center', padding: '0.5rem' }}
                                                    value={product.count}
                                                    onChange={(e) => handleEditChange(index, 'count', parseInt(e.target.value) || 0)}
                                                />
                                            ) : product.count || 0}
                                        </td>
                                        <td className="text-center font-bold text-text-muted" style={{ padding: '1.25rem 1rem' }}>{taken}</td>
                                        <td className="text-center font-bold text-text-muted" style={{ padding: '1.25rem 1rem' }}>{returned}</td>
                                        <td className="text-center" style={{ padding: '1.25rem 1rem' }}>
                                            {missing > 0 ? (
                                                <div className="inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '4px 12px', borderRadius: '100px', fontWeight: 900, fontSize: '0.875rem' }}>
                                                    {missing} <AlertTriangle size={14} />
                                                </div>
                                            ) : (
                                                <span style={{ opacity: 0.1 }}>-</span>
                                            )}
                                        </td>
                                        {isEditing && (
                                            <td className="text-center" style={{ padding: '1.25rem 1rem' }}>
                                                <button
                                                    onClick={() => handleDeleteProduct(index)}
                                                    style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.75rem', transition: 'all 0.2s' }}
                                                    onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                                    onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'; }}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {isEditing && (
                    <div className="p-6 bg-white/[0.02] border-t border-white/5">
                        <button onClick={handleAddProduct} className="btn-secondary w-full py-4 border-dashed flex justify-center items-center gap-3">
                            <Plus size={20} /> Add New Inventory Row
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div style={{ width: '8px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                        <h3 className="text-2xl font-black tracking-tight uppercase">COLLECTION REPORT</h3>
                    </div>
                    <button
                        onClick={handlePrintAndShare}
                        className="btn-primary"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}
                    >
                        <Share2 size={20} /> Share Report
                    </button>
                </div>
                <div className="premium-glass overflow-hidden" style={{ border: '1px solid rgba(59, 130, 246, 0.2)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                    <table className="premium-table">
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <th className="text-left" style={{ color: '#60a5fa' }}>Inventory Item</th>
                                <th className="text-center" style={{ color: '#60a5fa' }}>Collected Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(site.products || []).map((product, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td className="font-bold text-lg">{product.name || 'Item'}</td>
                                    <td className="text-center font-black text-2xl text-primary">{product.collected || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isReturnComplete && (
                <div className="mt-16 animate-slide-up">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div style={{ width: '8px', height: '32px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                            <h3 className="text-2xl font-black tracking-tight uppercase">RETURN REPORT</h3>
                        </div>
                        <button
                            onClick={handlePrintReturnReport}
                            className="btn-primary"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                        >
                            <Share2 size={20} /> Share Final Report
                        </button>
                    </div>
                    <div className="premium-glass overflow-hidden" style={{ border: '1px solid rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                        <table className="premium-table">
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                    <th className="text-left" style={{ color: '#34d399' }}>Inventory Item</th>
                                    <th className="text-center" style={{ color: '#34d399' }}>Taken</th>
                                    <th className="text-center" style={{ color: '#34d399' }}>Returned</th>
                                    <th className="text-center" style={{ color: '#34d399' }}>Gaps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(site.products || []).map((product, index) => {
                                    const taken = product.collected || 0;
                                    const returned = product.returned || 0;
                                    const missing = taken - returned;
                                    return (
                                        <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                            <td className="font-bold text-lg" style={{ padding: '1.25rem 1rem' }}>{product.name || 'Item'}</td>
                                            <td className="text-center font-bold text-text-dim" style={{ padding: '1.25rem 1rem' }}>{taken}</td>
                                            <td className="text-center font-black text-xl text-success" style={{ padding: '1.25rem 1rem' }}>{returned}</td>
                                            <td className="text-center" style={{ padding: '1.25rem 1rem' }}>
                                                {missing > 0 ? (
                                                    <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.25rem' }}>-{missing}</span>
                                                ) : (
                                                    <span style={{ opacity: 0.1 }}>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSiteDetail;
