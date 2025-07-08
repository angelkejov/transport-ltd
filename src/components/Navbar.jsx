import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem('jwt');
  let userInfo = null;
  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (e) {
      // Invalid token, treat as logged out
    }
  }
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    // Dispatch custom event to notify App component about logout
    window.dispatchEvent(new Event('logout'));
    // Use replace to avoid navigation history issues and ensure proper redirect
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Транспорт Груп 25</div>
      <ul className="navbar-links">
        {!token && <li><Link to="/">Услуги</Link></li>}
        <li><Link to="/about">За нас</Link></li>
        <li><Link to="/gallery">Галерия</Link></li>
        {/* Show Admin only for admins */}
        {userInfo?.role === 'ADMIN' && <li><Link to="/admin">Админ</Link></li>}
        {/* Show Dashboard/Profile only for logged in users */}
        {token && <li><Link to="/dashboard">Поръчай</Link></li>}
        {token && <li><Link to="/profile">{userInfo?.name || userInfo?.email || 'Профил'}</Link></li>}
        {/* Show Вход only for guests */}
        {!token && <li><Link to="/auth">Вход</Link></li>}
        {/* Show Logout only for logged in users */}
        {token && <li><button onClick={handleLogout}>Изход</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar; 