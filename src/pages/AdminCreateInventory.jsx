import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Save, Plus, Trash2, ArrowLeft, Package, Check } from 'lucide-react';

const AdminCreateInventory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addSite } = useApp();
    const siteDetails = location.state || {};

    const [items, setItems] = useState([{ name: '', count: '' }]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!siteDetails.name) {
            navigate('/shabeeradmindua');
        }
    }, [siteDetails, navigate]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItemRow = () => {
        setItems([...items, { name: '', count: '' }]);
    };

    const removeItemRow = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleFinalSave = async () => {
        setIsSaving(true);
        const products = items
            .filter(item => item.name.trim() !== '')
            .map(item => ({
                name: item.name,
                count: parseInt(item.count) || 0,
                collected: 0,
                returned: 0,
                isNew: false
            }));

        addSite({
            name: siteDetails.name,
            date: siteDetails.date,
            products: products
        });

        // Small delay for effect
        setTimeout(() => {
            navigate('/shabeeradmindua');
        }, 800);
    };

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
                        <h2 className="text-2xl font-black tracking-tight uppercase" style={{ margin: 0 }}>{siteDetails.name || 'Setup Site'}</h2>
                        <p className="text-xs text-text-muted font-bold tracking-widest uppercase mt-1">
                            Phase 2: Inventory Configuration
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleFinalSave}
                    disabled={isSaving}
                    className="btn-primary"
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                            <div style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            Deploying...
                        </span>
                    ) : (
                        <><Save size={20} /> Deploy Site</>
                    )}
                </button>
            </header>

            <div className="premium-glass overflow-hidden border-white/5 shadow-2xl">
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
                    <Package className="text-primary" size={20} />
                    <h3 className="font-bold text-sm tracking-widest uppercase">Warehouse Checklist</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="text-left w-2/3">Item Description</th>
                                <th className="text-center w-32">Quantity</th>
                                <th className="text-center w-20">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        <input
                                            className="input-field h-14 text-lg font-bold"
                                            style={{ border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)' }}
                                            placeholder="e.g. Silk Table Runners"
                                            value={item.name}
                                            onChange={e => handleItemChange(index, 'name', e.target.value)}
                                            autoFocus={index === items.length - 1 && index > 0}
                                        />
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <input
                                            type="number"
                                            className="input-field h-14 text-center text-xl font-black"
                                            style={{ border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)' }}
                                            placeholder="0"
                                            value={item.count}
                                            onChange={e => handleItemChange(index, 'count', e.target.value)}
                                        />
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => removeItemRow(index)}
                                            style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer', padding: '0.75rem', borderRadius: '0.75rem', transition: 'all 0.2s' }}
                                            onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'; }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5">
                    <button
                        onClick={addItemRow}
                        className="btn-secondary w-full py-5 border-dashed flex justify-center items-center gap-3 hover:bg-primary/5 hover:border-primary/50 text-sm font-bold uppercase tracking-widest transition-all"
                    >
                        <Plus size={20} /> Add New Row
                    </button>
                </div>
            </div>

            {isSaving && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ margin: 'auto' }}>
                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '1rem', display: 'inline-block' }}>
                            <Check size={48} className="text-primary" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Mission Assigned!</h2>
                        <p className="text-text-muted font-medium mt-2 uppercase tracking-widest text-xs">Notifying Team Members...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCreateInventory;
