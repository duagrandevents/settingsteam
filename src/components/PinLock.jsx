import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Delete } from 'lucide-react';

const PinLock = ({ children }) => {
    const { appSettings } = useApp();
    const [pin, setPin] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Check session storage to see if already unlocked in this session
        const unlocked = sessionStorage.getItem('team_app_unlocked');
        if (unlocked === 'true') {
            setIsUnlocked(true);
        }
    }, []);

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError(false);

            // Auto-check when 4th digit entered
            if (newPin.length === 4) {
                checkPin(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    const checkPin = (inputPin) => {
        const correctPin = appSettings['team_pin'] || '1234'; // Default to 1234 if not set
        if (inputPin === correctPin) {
            setIsUnlocked(true);
            sessionStorage.setItem('team_app_unlocked', 'true');
        } else {
            setError(true);
            setTimeout(() => {
                setPin('');
                setError(false);
            }, 500);
        }
    };

    if (isUnlocked) {
        return children;
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#020617', color: 'white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <Lock size={40} color="#3b82f6" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>ENTER PIN</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Access restricted to authorized personnel</p>
            </div>

            {/* PIN DOTS */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '48px' }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: i < pin.length ? (error ? '#ef4444' : '#3b82f6') : 'rgba(255,255,255,0.1)',
                        transition: 'all 0.2s'
                    }} />
                ))}
            </div>

            {/* NUMPAD */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '300px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num.toString())}
                        style={{
                            width: '72px', height: '72px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', fontSize: '24px', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        {num}
                    </button>
                ))}
                <div /> {/* Empty slot for alignment */}
                <button
                    onClick={() => handleNumberClick('0')}
                    style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', fontSize: '24px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    0
                </button>
                <button
                    onClick={handleDelete}
                    style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'transparent', border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Delete size={28} />
                </button>
            </div>

            <div style={{ marginTop: '40px', fontSize: '12px', color: '#475569' }}>
                DUA CATERING MANAGEMENT
            </div>
        </div>
    );
};

export default PinLock;
