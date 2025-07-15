import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  let userInfo = null;
  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (e) {
      // Invalid token, treat as logged out
    }
  }
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('jwt'));
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleStorageChange);
    window.addEventListener('login', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleStorageChange);
      window.removeEventListener('login', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.dispatchEvent(new Event('logout'));
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Транспорт Груп 25</div>
      <ul className="navbar-links">
        <li><Link to="/">Услуги</Link></li>
        <li><Link to="/about">За нас</Link></li>
        <li><Link to="/gallery">Галерия</Link></li>
        {userInfo && (userInfo.isAdmin === 1 || userInfo.isAdmin === true) && (
          <li><Link to="/admin">Админ</Link></li>
        )}
        {token && <li><Link to="/dashboard">Поръчай</Link></li>}
        {token && <li><Link to="/profile">{userInfo?.name || userInfo?.email || 'Профил'}</Link></li>}
        {token && <li><button onClick={handleLogout}>Изход</button></li>}
        {!token && <li><Link to="/auth">Вход</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar; 