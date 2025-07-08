import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        // Login
        const response = await API.post('/auth/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('jwt', token);
        setMessage('Влязохте успешно!');
        navigate('/dashboard');
        // Optionally, redirect to dashboard
        const decoded = jwtDecode(token);
        localStorage.setItem('role', decoded.role); 
      } else {
        // Signup
        await API.post('/auth/signup', { username, email, password });
        setMessage('Успешна регистрация! Проверете имейла си за код за потвърждение.');
        navigate('/verify', { state: { email } });
      }
    } catch (err) {
      setMessage(err.response?.data || 'Грешка при заявката.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <h2 style={{ color: '#d32f2f' }}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input
          type="text"
          placeholder="Потребителско име"
          value={username}
          onChange={e => setUsername(e.target.value)}
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
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Нямате акаунт? Регистрирайте се' : 'Вече имате акаунт? Влезте'}
        </button>
      </div>
    </div>
  );
};

export default Auth; 