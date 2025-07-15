import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowVerifyButton(false);
    try {
      if (isLogin) {
        // Login
        const res = await login({ email, password });
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          window.dispatchEvent(new Event('login'));
          setMessage('Влязохте успешно!');
          navigate('/dashboard');
        } else {
          setMessage(res.message || 'Грешка при вход.');
          if (res.message && res.message.toLowerCase().includes('verify')) {
            setShowVerifyButton(true);
          }
        }
      } else {
        // Register
        const res = await register({ name, email, password });
        if (res.message && res.message.toLowerCase().includes('verify')) {
          setMessage('Успешна регистрация! Проверете имейла си за потвърждение.');
          navigate('/verify-email', { state: { email } });
        } else {
          setMessage(res.message || 'Грешка при регистрация.');
        }
      }
    } catch (err) {
      setMessage(err.message || 'Грешка при заявката.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <h2 style={{ color: '#d32f2f' }}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Име"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
        )}
        <input type="email" placeholder="Имейл" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }} />
        <input type="password" placeholder="Парола" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '0.75rem', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: '1rem' }}>
          {isLogin ? 'Вход' : 'Регистрация'}
        </button>
      </form>
      {message && <div style={{ marginTop: '1rem', color: message.includes('успеш') ? '#388e3c' : '#d32f2f' }}>{message}</div>}
      {showVerifyButton && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            style={{ padding: '0.5rem 1rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/verify-email', { state: { email } })}
          >
            Моля, потвърдете имейла си
          </button>
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Нямате акаунт? Регистрирайте се' : 'Вече имате акаунт? Влезте'}
        </button>
      </div>
    </div>
  );
};

export default Auth; 