import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await API.post('/auth/verify', {
        email,
        verificationCode,
      });
      if (response.data === 'Account verified successfully.') {
        setMessage('Успешно потвърдихте имейла!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data || 'Възникна грешка при потвърждаването на имейла.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <h2 style={{ color: '#1976d2' }}>Потвърждение на имейл</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Имейл адрес"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Код за потвърждение"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.75rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: '1rem' }}
        >
          {loading ? 'Изпращане...' : 'Потвърди'}
        </button>
      </form>
      {message && (
        <div style={{ marginTop: '1rem', color: message.includes('успешно') ? '#388e3c' : '#d32f2f' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail; 