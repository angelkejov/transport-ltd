import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <span>"Транспорт Груп 25" ООД &copy; {new Date().getFullYear()}</span>
      <span>Тел: 0888880851 / 0878509163</span>
      <span>Email: transport.group25@abv.bg</span>
    </div>
  </footer>
);

export default Footer; 