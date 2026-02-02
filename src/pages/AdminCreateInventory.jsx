import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Save, Plus, Trash2, ArrowLeft, Package, Check, X } from 'lucide-react';

const AdminCreateInventory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addSite, sites } = useApp();
    const siteDetails = location.state || {};

    const [items, setItems] = useState([{ name: '', count: '' }]);
    const [isSaving, setIsSaving] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Derive historical product names for autocomplete
    const [allProductNames, setAllProductNames] = useState([]);

    useEffect(() => {
        const names = new Set();
        sites.forEach(site => {
            (site.products || []).forEach(p => {
                if (p.name) names.add(p.name.toUpperCase());
            });
        });
        setAllProductNames(Array.from(names).sort());
    }, [sites]);

    useEffect(() => {
        if (!siteDetails.name) {
            navigate('/');
        }
    }, [siteDetails, navigate]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'name' ? value.toUpperCase() : value;
        setItems(newItems);

        if (field === 'name') {
            setFocusedIndex(index);
            setShowSuggestions(value.length > 0);
        }
    };

    const selectSuggestion = (index, name) => {
        const newItems = [...items];
        newItems[index].name = name;
        setItems(newItems);
        setShowSuggestions(false);
    };

    const addItemRow = () => {
        setItems([...items, { name: '', count: '' }]);
    };

    const removeItemRow = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        } else {
            setItems([{ name: '', count: '' }]);
        }
    };

    const handleFinalSave = async () => {
        setIsSaving(true);
        const products = items
            .filter(item => item.name.trim() !== '')
            .map(item => ({
                name: item.name.toUpperCase(),
                count: parseInt(item.count) || 0,
                collected: 0,
                returned: 0,
                isNew: false
            }));

        const { error } = await addSite({
            name: siteDetails.name,
            date: siteDetails.date,
            products: products
        });

        if (error) {
            setIsSaving(false);
            alert('DEPLOYMENT FAILED: ' + (error.message || 'Check your database connection.'));
        } else {
            // Trigger Push Notification
            fetch('/api/send-push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'New Mission Deployed!',
                    body: `Site: ${siteDetails.name} is ready for pickup.`,
                    url: '/'
                })
            }).catch(err => console.error('Push Trigger Error:', err));

            setTimeout(() => {
                navigate('/');
            }, 1200);
        }
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
                    <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, textTransform: 'uppercase' }}>{siteDetails.name || 'Setup Inventory'}</h2>
                        <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Phase 2: Warehouse Checklist</p>
                    </div>
                </div>
                <button
                    onClick={handleFinalSave}
                    disabled={isSaving}
                    style={{
                        background: '#3b82f6', color: 'white', border: 'none', padding: '14px 32px',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.7 : 1
                    }}
                >
                    {isSaving ? 'DEPLOYING...' : <><Save size={20} /> DEPLOY SITE</>}
                </button>
            </header>

            <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', overflow: 'visible' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Package size={20} color="#3b82f6" />
                        <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Item List</h3>
                    </div>

                    <div style={{ padding: '24px' }}>
                        {items.map((item, index) => {
                            const matchingSuggestions = showSuggestions && focusedIndex === index
                                ? allProductNames.filter(n => n.includes(item.name.toUpperCase()) && n !== item.name.toUpperCase()).slice(0, 5)
                                : [];

                            return (
                                <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', position: 'relative' }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <input
                                                placeholder="ITEM NAME (E.G. CHAIRS)"
                                                value={item.name}
                                                onFocus={() => { setFocusedIndex(index); setShowSuggestions(item.name.length > 0); }}
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                onChange={e => handleItemChange(index, 'name', e.target.value)}
                                                style={{
                                                    background: 'rgba(2, 6, 23, 0.5)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    padding: '16px 40px 16px 16px', // Extra padding for X button
                                                    borderRadius: '12px',
                                                    width: '100%',
                                                    fontSize: '16px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                            {item.name.length > 0 && (
                                                <button
                                                    onClick={() => handleItemChange(index, 'name', '')}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '12px',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        color: '#94a3b8'
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {/* AUTOCOMPLETE DROPDOWN */}
                                        {matchingSuggestions.length > 0 && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                                                background: '#1e293b', borderRadius: '12px', marginTop: '4px',
                                                border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                            }}>
                                                {matchingSuggestions.map((suggestion, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => selectSuggestion(index, suggestion)}
                                                        style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: i < matchingSuggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontWeight: 700, fontSize: '14px' }}
                                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        {suggestion}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={item.count}
                                            onChange={e => handleItemChange(index, 'count', e.target.value)}
                                            style={{ background: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px', borderRadius: '12px', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: 700 }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeItemRow(index)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                                            color: '#ef4444', height: '54px', width: '54px',
                                            borderRadius: '12px', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            );
                        })}

                        <button onClick={addItemRow} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                            <Plus size={20} /> ADD ANOTHER ITEM
                        </button>
                    </div>
                </div>
            </div>

            {isSaving && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div>
                        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '30px', borderRadius: '100px', display: 'inline-block', marginBottom: '24px' }}>
                            <Check size={64} color="#3b82f6" />
                        </div>
                        <h2 style={{ fontSize: '36px', fontWeight: 900, textTransform: 'uppercase' }}>MISSION DEPLOYED!</h2>
                        <p style={{ color: '#94a3b8', fontWeight: 500, marginTop: '8px' }}>Inventory assigned to site database.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCreateInventory;
