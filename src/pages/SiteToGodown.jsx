import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, AlertTriangle, CheckCircle } from 'lucide-react';

const SiteToGodown = () => {
    const { siteId } = useParams();
    const { getSite, updateSite } = useApp();
    const navigate = useNavigate();
    const [site, setSite] = useState(null);
    const [returnItems, setReturnItems] = useState([]);

    useEffect(() => {
        const data = getSite(siteId);
        if (data) {
            setSite(data);
            setReturnItems(data.products.map(p => ({
                ...p,
                returned: p.returned !== undefined ? p.returned : 0
            })));
        }
    }, [siteId, getSite]);

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
        navigate('/team');
    };

    const isReadOnly = site.status === 'completed';

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
                    <p style={{ margin: '4px 0 0', fontSize: '10px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Phase 2: Site ➔ Godown</p>
                </div>
                {!isReadOnly && (
                    <button onClick={handleSave} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} /> TERMINALIZE
                    </button>
                )}
                {isReadOnly && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 16px', borderRadius: '100px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} strokeWidth={3} /> COMPLETED
                    </div>
                )}
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
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '20px 16px', fontWeight: 700 }}>{p.name}</td>
                                        <td style={{ padding: '20px 16px', textAlign: 'center', fontWeight: 900, fontSize: '20px', color: '#94a3b8' }}>{taken}</td>
                                        <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                value={p.returned || ''}
                                                onChange={e => handleReturnChange(i, e.target.value)}
                                                placeholder="0"
                                                disabled={isReadOnly}
                                                style={{
                                                    width: '80px', height: '50px',
                                                    textAlign: 'center', fontSize: '20px', fontWeight: 900,
                                                    background: 'rgba(0,0,0,0.2)', border: gap === 0 ? '2px solid #10b981' : gap > 0 ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                                    color: gap === 0 ? '#10b981' : gap > 0 ? '#ef4444' : 'white',
                                                    borderRadius: '12px', outline: 'none',
                                                    opacity: isReadOnly ? 0.7 : 1
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
    );
};

export default SiteToGodown;
