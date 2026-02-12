import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Phone, ArrowLeft, User, ChevronRight, Truck, Car, Users } from 'lucide-react';

const TeamContacts = () => {
    const { contacts, loading } = useApp();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Group contacts by category
    const groupedContacts = useMemo(() => {
        const groups = {};
        contacts.forEach(contact => {
            const category = contact.category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(contact);
        });
        return groups;
    }, [contacts]);

    const categories = Object.keys(groupedContacts).sort();

    // Category colors for visual variety
    const categoryColors = {
        'dosth': { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' },
        'auto': { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' },
        'goods': { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981' },
        'Other': { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', color: '#a855f7' }
    };

    const getCategoryStyle = (category) => {
        return categoryColors[category] || categoryColors['Other'];
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'dosth':
                return Truck; // Lorry icon
            case 'auto':
                return Car; // Auto icon
            case 'goods':
                return Truck; // Goods truck icon
            default:
                return Users; // Other/Group icon
        }
    };


    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px' }}>
                {/* Header */}
                <header style={{
                    marginBottom: '32px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <button
                        onClick={() => selectedCategory ? setSelectedCategory(null) : navigate('/')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: 700,
                            marginBottom: '16px',
                            padding: 0
                        }}
                    >
                        <ArrowLeft size={20} /> {selectedCategory ? 'Back to Categories' : 'Back'}
                    </button>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {selectedCategory || 'Contacts'}
                    </h1>
                    <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                        {selectedCategory
                            ? `${groupedContacts[selectedCategory]?.length || 0} contact${groupedContacts[selectedCategory]?.length !== 1 ? 's' : ''}`
                            : 'Select a category to view contacts'
                        }
                    </p>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', opacity: 0.5 }}>
                        <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="animate-pulse">
                            Loading Contacts...
                        </p>
                    </div>
                ) : !selectedCategory ? (
                    // Show category cards
                    categories.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {categories.map(category => {
                                const style = getCategoryStyle(category);
                                const count = groupedContacts[category].length;
                                return (
                                    <div
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        style={{
                                            background: `linear-gradient(135deg, ${style.color}33, ${style.color}11)`,
                                            border: `2px solid ${style.color}`,
                                            borderRadius: '24px',
                                            padding: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '16px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            boxShadow: `0 8px 24px ${style.color}33, 0 0 0 1px ${style.color}22`,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        className="touch-active"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = `0 12px 32px ${style.color}55, 0 0 0 2px ${style.color}`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = `0 8px 24px ${style.color}33, 0 0 0 1px ${style.color}22`;
                                        }}
                                    >
                                        {/* Animated background gradient */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: `linear-gradient(135deg, ${style.color}22, transparent, ${style.color}11)`,
                                            backgroundSize: '200% 200%',
                                            animation: 'gradient-shift 4s ease infinite',
                                            opacity: 0.6,
                                            pointerEvents: 'none'
                                        }} />

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${style.color}, ${style.color}cc)`,
                                                border: `3px solid ${style.color}44`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 4px 16px ${style.color}66, inset 0 2px 4px rgba(255,255,255,0.2)`,
                                                transition: 'all 0.3s'
                                            }}>
                                                {React.createElement(getCategoryIcon(category), { size: 32, color: "white", strokeWidth: 2.5 })}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{
                                                    margin: 0,
                                                    fontSize: '22px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    color: 'white',
                                                    textShadow: `0 2px 8px ${style.color}88`,
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {category}
                                                </h3>
                                                <p style={{
                                                    margin: '6px 0 0',
                                                    color: '#cbd5e1',
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em'
                                                }}>
                                                    {count} Contact{count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${style.color}44, ${style.color}22)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            zIndex: 1,
                                            boxShadow: `0 0 16px ${style.color}55`
                                        }}>
                                            <ChevronRight size={28} color="white" strokeWidth={3} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 24px',
                            borderRadius: '24px',
                            border: '2px dashed rgba(255,255,255,0.1)',
                            opacity: 0.5
                        }}>
                            <User size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                            <p style={{ margin: 0, fontWeight: 700 }}>No contacts available yet.</p>
                            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                                Contacts will appear here once added by admin.
                            </p>
                        </div>
                    )
                ) : (
                    // Show contacts in selected category
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {groupedContacts[selectedCategory]?.map(contact => {
                            const style = getCategoryStyle(selectedCategory);
                            return (
                                <div
                                    key={contact.id}
                                    style={{
                                        background: `linear-gradient(135deg, ${style.bg}, rgba(15, 23, 42, 0.3))`,
                                        border: `2px solid ${style.border}`,
                                        borderRadius: '20px',
                                        padding: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: style.bg,
                                            border: `2px solid ${style.border}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <User size={24} color={style.color} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '18px',
                                                fontWeight: 900,
                                                textTransform: 'uppercase'
                                            }}>
                                                {contact.name}
                                            </h3>
                                            <p style={{
                                                margin: '4px 0 0',
                                                color: '#64748b',
                                                fontSize: '14px',
                                                fontWeight: 600
                                            }}>
                                                {contact.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Call Button */}
                                    <a
                                        href={`tel:${contact.phone}`}
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${style.color}, ${style.color}dd)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            boxShadow: `0 4px 12px ${style.border}`
                                        }}
                                        className="touch-active hover:scale-110"
                                    >
                                        <Phone size={24} color="white" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamContacts;
