import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, Plus, Save, ArrowRight } from 'lucide-react';

const GodownToSite = () => {
    const { siteId } = useParams();
    const { getSite, updateSite } = useApp();
    const navigate = useNavigate();
    const [site, setSite] = useState(null);
    const [localProducts, setLocalProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', count: '' });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        const data = getSite(siteId);
        if (data) {
            setSite(data);
            setLocalProducts(data.products.map(p => ({
                ...p,
                collected: p.collected !== undefined ? p.collected : 0
            })));
        }
    }, [siteId, getSite]);

    if (!site) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading mission data...</div>;

    const handleCollectChange = (index, val) => {
        const newProds = [...localProducts];
        newProds[index].collected = parseInt(val) || 0;
        setLocalProducts(newProds);
    };

    const handleAddNew = () => {
        if (!newProduct.name) return;
        const item = {
            name: newProduct.name.toUpperCase(),
            count: parseInt(newProduct.count) || 0,
            collected: parseInt(newProduct.count) || 0,
            isNew: true
        };
        setLocalProducts([...localProducts, item]);
        setNewProduct({ name: '', count: '' });
        setShowAdd(false);
    };

    const handleSave = () => {
        updateSite(siteId, {
            products: localProducts,
            status: 'outbound_complete'
        });
        navigate(`/team/site/${siteId}/inbound`);
    };

    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>{site.name}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Phase 1: Godown ➔ Site</p>
                </div>
                <button onClick={handleSave} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} /> NEXT PHASE
                </button>
            </header>

            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Item</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Req.</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pick</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localProducts.map((p, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: p.isNew ? 'rgba(245, 158, 11, 0.03)' : 'transparent' }}>
                                    <td style={{ padding: '20px 16px', fontWeight: 700 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {p.name}
                                            {p.isNew && <span style={{ fontSize: '8px', fontWeight: 900, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Field Add</span>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 16px', textAlign: 'center', fontWeight: 900, fontSize: '20px', color: '#94a3b8' }}>{p.count}</td>
                                    <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            value={p.collected || ''}
                                            onChange={e => handleCollectChange(i, e.target.value)}
                                            placeholder="0"
                                            style={{
                                                width: '80px', height: '50px',
                                                textAlign: 'center', fontSize: '20px', fontWeight: 900,
                                                background: 'rgba(0,0,0,0.2)', border: (p.collected === p.count && p.count > 0) ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                                color: (p.collected === p.count && p.count > 0) ? '#10b981' : 'white',
                                                borderRadius: '12px', outline: 'none'
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD UNLISTED BUTTON */}
            {!showAdd && (
                <button
                    onClick={() => setShowAdd(true)}
                    style={{ position: 'fixed', bottom: '32px', right: '32px', width: '64px', height: '64px', borderRadius: '24px', background: '#3b82f6', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)', cursor: 'pointer' }}
                >
                    <Plus size={32} />
                </button>
            )}

            {/* ADD MODAL */}
            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '360px' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 900, textTransform: 'uppercase' }}>New Entry</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                placeholder="ITEM DESCRIPTION"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: 700 }}
                            />
                            <input
                                type="number"
                                placeholder="QUANTITY"
                                value={newProduct.count}
                                onChange={e => setNewProduct({ ...newProduct, count: e.target.value })}
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: 700 }}
                            />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
                                <button onClick={handleAddNew} style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>ADD ITEM</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GodownToSite;
