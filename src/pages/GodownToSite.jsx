import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, Plus, Save, Share2, ArrowRight } from 'lucide-react';

const GodownToSite = () => {
    const { siteId } = useParams();
    const { getSite, updateSite } = useApp();
    const navigate = useNavigate();
    const [site, setSite] = useState(null);
    const [localProducts, setLocalProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', count: '' });
    const [showAdd, setShowAdd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const data = getSite(siteId);
        if (data) {
            setSite(data);
            // Initialize with existing data if revisiting, or default collected to 0
            setLocalProducts(data.products.map(p => ({
                ...p,
                collected: p.collected !== undefined ? p.collected : 0
            })));
        }
    }, [siteId, getSite]);

    if (!site) return <div className="p-10 text-center">Loading...</div>;

    const handleCollectChange = (index, val) => {
        const newProds = [...localProducts];
        newProds[index].collected = parseInt(val) || 0;
        setLocalProducts(newProds);
    };

    const handleAddNew = () => {
        if (!newProduct.name) return;
        const item = {
            name: newProduct.name,
            count: parseInt(newProduct.count) || 0, // Admin count is basically 0 or what they claim? User said "adding option for team if any product needed"
            // Usually team adds what they picked which wasn't on list. So target might be 0, collected is X.
            // Or maybe they just add a request? User said: "it willshows to admin page in another colour"
            // I'll assume they are adding what they are taking.
            collected: parseInt(newProduct.count) || 0,
            isNew: true
        };
        setLocalProducts([...localProducts, item]);
        setNewProduct({ name: '', count: '' });
        setShowAdd(false);
    };

    const handleSave = () => {
        setShowConfirm(true);
    };

    const handleFinalSave = async () => {
        // Save to global state (and Supabase via AppContext)
        await updateSite(siteId, {
            products: localProducts,
            status: 'outbound_complete'
        });

        // Navigate directly to From Site (Inbound) page
        // No WhatsApp redirect
        setShowConfirm(false);
        navigate(`/site/${siteId}/inbound`);
    };

    return (
        <div className="container animate-fade-in pb-20">
            <header className="mb-6 py-4 flex justify-between items-center sticky top-0 bg-bg-primary/95 backdrop-blur z-10 border-b border-white/5">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide">
                        {site.name} <span className="text-text-secondary opacity-70 ml-2 text-xl">{site.date.split('-').reverse().join('-')}</span>
                    </h2>
                    <p className="text-sm text-text-secondary">Godown ➔ Site (Picking)</p>
                </div>
                <div className="text-right">
                    <button onClick={handleSave} className="btn-primary text-sm px-3 py-2 flex items-center gap-2">
                        <Save size={16} /> Save & Next
                    </button>
                </div>
            </header>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-text-secondary text-sm uppercase tracking-wider">
                                <th className="p-4">Item Name</th>
                                <th className="p-4 text-center">Target</th>
                                <th className="p-4 text-center">Collected</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localProducts.map((product, index) => (
                                <tr key={index} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${product.isNew ? 'bg-yellow-500/5' : ''}`}>
                                    <td className="p-4 font-medium">
                                        {product.name}
                                        {product.isNew && <span className="ml-2 text-xs text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded">NEW</span>}
                                    </td>
                                    <td className="p-4 text-center text-text-secondary font-mono">
                                        {product.count}
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="number"
                                            className={`input-field w-20 text-center font-bold mx-auto ${product.collected === product.count ? 'text-green-400 border-green-500/50' : ''
                                                }`}
                                            value={product.collected === 0 ? '' : product.collected}
                                            onChange={(e) => handleCollectChange(index, e.target.value)}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center h-6">
                                            {product.collected === product.count && product.count > 0 && (
                                                <div className="text-green-400 animate-bounce">
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {localProducts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-text-secondary">No items in list. Add some!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="glass-panel p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Add Extra Product</h3>
                        <input
                            className="input-field mb-3"
                            placeholder="Item Name"
                            value={newProduct.name}
                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                            type="number"
                            className="input-field mb-4"
                            placeholder="Count Picked"
                            value={newProduct.count}
                            onChange={e => setNewProduct({ ...newProduct, count: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleAddNew} className="btn-primary flex-1">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Save size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 900 }}>SUBMIT TO ADMIN?</h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
                            This will sync the picked list to the HQ Dashboard for printing. WhatsApp sharing is disabled.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 700, cursor: 'pointer', border: 'none' }}
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleFinalSave}
                                style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer', border: 'none' }}
                            >
                                CONFIRM
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!showAdd && (
                <button
                    onClick={() => setShowAdd(true)}
                    className="fixed bottom-6 right-6 btn-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                >
                    <Plus size={28} />
                </button>
            )}
        </div>
    );
};

export default GodownToSite;
