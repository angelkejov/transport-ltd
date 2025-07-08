import React, { useState } from 'react';
import API from '../api';

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

const Dashboard = () => {
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Не сте влезли в профила си.');
        setLoading(false);
        return;
      }

      const orderData = {
        serviceName: selected,
        date: date,
        phoneNumber: phone
      };

      await API.post('/orders/create', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSubmitted(true);
      setSelected(null);
      setAddress('');
      setDate('');
      setPhone('');
    } catch (err) {
      setError(err.response?.data || 'Грешка при създаване на поръчката.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '2rem auto' }}>
      <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>Поръчайте услуга</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        {services.map((service, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(service)}
            style={{
              padding: '1rem',
              borderRadius: 8,
              border: selected === service ? '2px solid #388e3c' : '1px solid #ccc',
              background: selected === service ? '#ffd600' : '#fff',
              color: selected === service ? '#d32f2f' : '#222',
              fontWeight: 'bold',
              minWidth: 220,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
            }}
          >
            {service}
          </button>
        ))}
      </div>
      {selected && !submitted && (
        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#388e3c' }}>{selected}</h3>
          <input
            type="text"
            placeholder="Адрес за изпълнение"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="tel"
            placeholder="Телефон за връзка"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            pattern="[0-9]{10}"
            style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '0.75rem', 
              background: loading ? '#ccc' : '#d32f2f', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              fontWeight: 'bold', 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Изпращане...' : 'Поръчай'}
          </button>
        </form>
      )}
      {error && (
        <div style={{ background: '#ffebee', padding: '1rem', borderRadius: 8, marginTop: '1rem', color: '#d32f2f', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {submitted && (
        <div style={{ background: '#fffde7', padding: '2rem', borderRadius: 12, textAlign: 'center', marginTop: '2rem', color: '#388e3c', fontWeight: 'bold' }}>
          Вашата поръчка е приета! Ще се свържем с вас скоро.
        </div>
      )}
    </div>
  );
};

export default Dashboard; 