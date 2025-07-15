import React, { useEffect, useState } from 'react';
import { getProfile, getOrderHistory } from '../api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getProfile();
        setProfile(user);
        const orderList = await getOrderHistory();
        setOrders(orderList);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Зареждане...</p>;
  if (!profile) return <div>Не сте влезли в профила си или възникна грешка.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '2rem auto', background: '#f9f0ff', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0 1.5rem 0' }}>
        <Link to="/rate" style={{
          background: '#ffd600',
          color: '#222',
          padding: '0.75rem 2rem',
          borderRadius: 8,
          fontWeight: 'bold',
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          border: 'none',
          transition: 'background 0.2s',
          display: 'inline-block'
        }}>
          Оцени ни ★
        </Link>
      </div>
      <h2 style={{ color: '#43a047' }}>Моят профил</h2>
      <p><strong>Име:</strong> {profile.name}</p>
      <p><strong>Имейл:</strong> {profile.email}</p>

      <h3 style={{ marginTop: '1.5rem' }}>История на поръчките</h3>
      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={order.id || index} style={{ background: '#fff', padding: '1rem', borderRadius: 8, margin: '0.5rem 0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <p><strong>Услуга:</strong> {order.service}</p>
            <p><strong>Дата:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('bg-BG') : ''}</p>
            <p><strong>Детайли:</strong> {order.details}</p>
          </div>
        ))
      ) : (
        <p>Няма поръчки.</p>
      )}
    </div>
  );
};

export default Profile;
