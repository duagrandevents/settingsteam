import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Send, AlertTriangle, Check, CheckCircle } from 'lucide-react';

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
            // Initialize return items based on what was collected in previous step
            setReturnItems(data.products.map(p => ({
                ...p,
                returned: p.returned !== undefined ? p.returned : 0 // Default 0
            })));
        }
    }, [siteId, getSite]);

    if (!site) return <div className="p-10 text-center">Loading...</div>;

    const handleReturnChange = (index, val) => {
        const newItems = [...returnItems];
        newItems[index].returned = parseInt(val) || 0;
        setReturnItems(newItems);
    };

    const handleSubmit = () => {
        updateSite(siteId, {
            products: returnItems,
            status: 'completed'
        });
        // Maybe notify admin or just go back to landing
        alert('Report Submitted to Admin!');
        navigate('/team');
    };

    const handleSave = () => {
        handleSubmit();
    };

    return (
        <div className="container animate-slide-up pb-32">
            <header className="mb-6 py-6 flex items-center justify-between border-b border-white/5">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        {site.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-secondary font-bold">{site.date.split('-').reverse().join('-')}</span>
                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Protocol: Site ➔ Godown</p>
                    </div>
                </div>
                <button onClick={handleSave} className="btn-primary from-success to-emerald-600 py-3 px-6">
                    <CheckCircle size={18} /> Terminalize
                </button>
            </header>

            <div className="premium-glass overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="text-left">Inventory Item</th>
                                <th className="text-center">Taken</th>
                                <th className="text-center">Returning</th>
                                <th className="text-center">Gaps</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnItems.map((product, index) => {
                                const taken = product.collected || 0;
                                const returning = product.returned || 0;
                                const missing = taken - returning;

                                return (
                                    <tr key={index} className="group transition-colors">
                                        <td className="font-bold text-lg">
                                            {product.name}
                                        </td>
                                        <td className="text-center font-black text-xl text-text-dim">
                                            {taken}
                                        </td>
                                        <td className="text-center">
                                            <input
                                                type="number"
                                                className={`input-field w-24 text-center font-black text-xl h-14 ${returning === taken && taken > 0
                                                    ? 'border-success text-success bg-success/5'
                                                    : missing > 0 ? 'border-danger/30 text-danger bg-danger/5' : ''
                                                    }`}
                                                value={product.returned === 0 ? '' : product.returned}
                                                onChange={(e) => handleReturnChange(index, e.target.value)}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="text-center">
                                            {missing > 0 ? (
                                                <div className="inline-flex items-center gap-2 text-danger font-black text-xl">
                                                    -{missing} <AlertTriangle size={16} />
                                                </div>
                                            ) : (
                                                <div className="flex justify-center">
                                                    {taken > 0 ? (
                                                        <div className="bg-success/20 p-2 rounded-full text-success border border-success/30">
                                                            <Check size={20} strokeWidth={3} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 border-2 border-dashed border-white/10 rounded-full"></div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {returnItems.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-text-muted">Nothing to return.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
};

export default SiteToGodown;
