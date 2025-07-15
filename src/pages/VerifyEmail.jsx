import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerification, verifyByCode } from '../api';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [showCodeUI, setShowCodeUI] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setMessage('Моля, проверете имейла си за връзка за потвърждение. Ако имате код, въведете имейл и кода по-долу.');
      setShowCodeUI(true);
      setLoading(false);
      return;
    }
    verifyEmail(token)
      .then(res => {
        if (res.message && res.message.toLowerCase().includes('verified')) {
          setMessage('Имейлът е потвърден успешно! Може да влезете.');
          setTimeout(() => navigate('/auth'), 2000);
        } else {
          setMessage(res.message || 'Грешка при потвърждаване на имейла.');
          setShowCodeUI(true);
        }
      })
      .catch(() => {
        setMessage('Грешка при потвърждаване на имейла.');
        setShowCodeUI(true);
      })
      .finally(() => setLoading(false));
  }, [location, navigate]);

  const handleResend = async () => {
    if (!email) {
      setMessage('Моля, въведете имейл за изпращане на нов код.');
      return;
    }
    setLoading(true);
    setMessage('');
    const res = await resendVerification({ email });
    setMessage(res.message || 'Изпратен е нов код, ако имейлът съществува.');
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!email || !code) {
      setMessage('Моля, въведете имейл и код.');
      return;
    }
    setLoading(true);
    setMessage('');
    const res = await verifyByCode({ email, code });
    if (res.message && res.message.toLowerCase().includes('verified')) {
      setMessage('Имейлът е потвърден успешно! Може да влезете.');
      setTimeout(() => navigate('/auth'), 2000);
    } else {
      setMessage(res.message || 'Грешка при потвърждаване на имейла.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <h2 style={{ color: '#1976d2' }}>Потвърждение на имейл</h2>
      {loading ? (
        <div>Потвърждаване...</div>
      ) : (
        <>
          <div style={{ marginTop: '1rem', color: message.includes('успеш') ? '#388e3c' : '#d32f2f' }}>{message}</div>
          {showCodeUI && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="email"
                placeholder="Имейл"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
              />
              <input
                type="text"
                placeholder="Код за потвърждение"
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleResend}
                  style={{ flex: 1, padding: '0.75rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: '1rem' }}
                >
                  Изпрати нов код
                </button>
                <button
                  onClick={handleConfirm}
                  style={{ flex: 1, padding: '0.75rem', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: '1rem' }}
                >
                  Потвърди
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyEmail; 