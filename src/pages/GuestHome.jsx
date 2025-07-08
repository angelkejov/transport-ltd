import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  'Извозване на строителни отпадъци и ненужни вещи',
  'Транспорт на инертни материали (чакъл, пясък, баластра, компост и др.)',
  'Извозване на метални отпадъци до база',
  'Доставка на строителни материали',
  'Почистване и косене на дворове',
  'Доставка на пелети и въглища',
  'Превоз на арматура и профили',
  'Дървен материал',
  'Палети товари',
];

const GuestHome = () => (
  <div style={{ padding: '2rem 0', background: '#fffde7', minHeight: '80vh' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#d32f2f', fontSize: '2.5rem', marginBottom: '1rem' }}>Добре дошли в "Транспорт Груп 25" ООД</h1>
        <p style={{ fontSize: '1.2rem', color: '#333', maxWidth: 700, margin: '0 auto' }}>
          Вашият доверен партньор за транспортни услуги със самосвал до 3.5 т в София и областта. Качество, отговорност и бързо обслужване за вашите нужди!
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/auth" style={{ background: '#ffd600', color: '#d32f2f', padding: '0.9rem 2.2rem', borderRadius: 8, fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', marginRight: 16 }}>Регистрирай се</Link>
          <Link to="/auth" style={{ background: '#388e3c', color: '#fff', padding: '0.9rem 2.2rem', borderRadius: 8, fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>Поръчай услуга</Link>
        </div>
        <div style={{ marginTop: '1rem', color: '#d32f2f', fontWeight: 500, fontSize: '1.05rem' }}>
          За да поръчате услуга, е необходима регистрация.
        </div>
      </div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ color: '#388e3c', marginBottom: '1rem' }}>Нашите услуги</h2>
        <ul style={{ columns: 2, fontSize: '1.1rem', color: '#222', maxWidth: 800, margin: '0 auto', listStyle: 'disc inside' }}>
          {services.map((s, i) => <li key={i} style={{ marginBottom: 8 }}>{s}</li>)}
        </ul>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
        <b>Контакти:</b> 0888880851 / 0878509163 &nbsp; | &nbsp; <b>Email:</b> transport.group25@abv.bg
      </div>
    </div>
  </div>
);

export default GuestHome; 