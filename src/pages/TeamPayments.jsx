import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Calendar, Users, ArrowLeft, IndianRupee } from 'lucide-react';

const TeamPayments = () => {
    const { sites, loading } = useApp();
    const navigate = useNavigate();

    // Filter paid sites
    const paidSites = sites.filter(site => site.payment_status === 'paid');

    return (
        <div style={{ padding: '0 0 100px 0', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
                <button
                    onClick={() => navigate('/team')}
                    style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1', padding: '10px', borderRadius: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            PAYMENTS
                        </span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 700, margin: '2px 0 0 0', textTransform: 'uppercase' }}>Completed Sites</p>
                </div>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px' }}>
                <h2 style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px', paddingLeft: '8px' }}>
                    Payment History
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 24px', opacity: 0.5 }}>
                            <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="animate-pulse">Loading...</p>
                        </div>
                    ) : paidSites && paidSites.length > 0 ? paidSites.map(site => (
                        <div
                            key={site.id}
                            style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                border: '2px solid #10b981',
                                borderRadius: '24px', padding: '24px',
                                display: 'flex', flexDirection: 'column', gap: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}
                        >
                            {/* Success Badge */}
                            <div style={{
                                position: 'absolute', top: '16px', right: '16px',
                                background: '#10b981', borderRadius: '50%',
                                width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <CheckCircle2 size={18} color="white" />
                            </div>

                            {/* Site Info */}
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>{site.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 700 }}>
                                    <Calendar size={14} /> <span>{site.date ? site.date.split('-').reverse().join('-') : ''}</span>
                                </div>
                            </div>

                            {/* Team Members */}
                            {site.team_members && site.team_members.length > 0 && (
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: '16px', padding: '16px',
                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Users size={16} color="#10b981" />
                                        <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#10b981' }}>Team Members</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {site.team_members.map((member, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    background: 'rgba(16, 185, 129, 0.15)',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    fontWeight: 700,
                                                    color: '#10b981',
                                                    border: '1px solid rgba(16, 185, 129, 0.3)'
                                                }}
                                            >
                                                {member}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Paid Status */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px', background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                                <CheckCircle2 size={18} color="#10b981" />
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                                    Payment Completed
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.1)', opacity: 0.5 }}>
                            <IndianRupee size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                            <p style={{ margin: 0, fontWeight: 700 }}>No payments recorded yet.</p>
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#64748b' }}>Completed sites will appear here once payment is processed.</p>
                        </div>
                    )}
                </div>

                <div style={{
                    textAlign: 'center', marginTop: '40px', paddingBottom: '20px', color: '#64748b', fontSize: '10px'
                }}>
                    DUA LOGISTICS PAYMENT TRACKER v1.0
                </div>
            </div>
        </div>
    );
};

export default TeamPayments;
