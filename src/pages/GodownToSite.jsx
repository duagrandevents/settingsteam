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
        // Save to global state
        updateSite(siteId, {
            products: localProducts,
            status: 'outbound_complete'
        });

        // Navigate
        navigate(`/team/site/${siteId}/inbound`); // "The page turns to site to godown"
    };

    return (
        <div className="container animate-slide-up pb-32">
            <header className="mb-6 py-6 flex items-center justify-between border-b border-white/5">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        {site.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary font-bold">{site.date.split('-').reverse().join('-')}</span>
                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Protocol: Godown ➔ Site</p>
                    </div>
                </div>
                <button onClick={handleSave} className="btn-primary py-3 px-6">
                    <Save size={18} /> Next Phase
                </button>
            </header>

            <div className="premium-glass overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="text-left">Inventory Item</th>
                                <th className="text-center">Req.</th>
                                <th className="text-center">Collected</th>
                                <th className="text-center">Verify</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localProducts.map((product, index) => (
                                <tr key={index} className={`group transition-colors ${product.isNew ? 'bg-accent/5' : ''}`}>
                                    <td className="font-bold text-lg">
                                        <div className="flex items-center gap-3">
                                            {product.name}
                                            {product.isNew && (
                                                <span className="text-[9px] font-black bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    Manual
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-center font-black text-xl text-text-dim">
                                        {product.count}
                                    </td>
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            className={`input-field w-24 text-center font-black text-xl h-14 ${product.collected === product.count && product.count > 0
                                                ? 'border-success text-success bg-success/5'
                                                : ''
                                                }`}
                                            value={product.collected === 0 ? '' : product.collected}
                                            onChange={(e) => handleCollectChange(index, e.target.value)}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div className="flex justify-center">
                                            {product.collected === product.count && product.count > 0 ? (
                                                <div className="bg-success/20 p-2 rounded-full text-success border border-success/30">
                                                    <Check size={20} strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 border-2 border-dashed border-white/10 rounded-full"></div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                showAdd ? (
                    <div className="fixed inset-0 bg-bg-deep/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
                        <div className="premium-glass p-8 w-full max-w-sm animate-slide-up border-white/10">
                            <h3 className="text-2xl font-black mb-6">Unlisted Item</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Description</label>
                                    <input
                                        className="input-field"
                                        placeholder="Item Name"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Initial Count</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="Quantity"
                                        value={newProduct.count}
                                        onChange={e => setNewProduct({ ...newProduct, count: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Abort</button>
                                    <button onClick={handleAddNew} className="btn-primary flex-1 justify-center">Add Entry</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="fixed bottom-8 right-8 btn-primary h-16 w-16 p-0 rounded-2xl flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-transform"
                    >
                        <Plus size={32} />
                    </button>
                )
            }
        </div >
    );
};

export default GodownToSite;
