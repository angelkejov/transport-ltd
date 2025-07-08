import React, { useEffect, useState } from 'react';
import API from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Зареждане...</p>;
  if (!profile) return <div>Не сте влезли в профила си или възникна грешка.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '2rem auto', background: '#f9f0ff', borderRadius: 12 }}>
      <h2 style={{ color: '#43a047' }}>Моят профил</h2>
      <p><strong>Име:</strong> {profile.name}</p>
      <p><strong>Имейл:</strong> {profile.email}</p>

      <h3 style={{ marginTop: '1.5rem' }}>История на поръчките</h3>
      {profile.orders && profile.orders.length > 0 ? (
        profile.orders.map((order, index) => (
          <div key={order.id || index} style={{ background: '#fff', padding: '1rem', borderRadius: 8, margin: '0.5rem 0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <p><strong>Услуга:</strong> {order.serviceName}</p>
            <p><strong>Дата:</strong> {new Date(order.date).toLocaleDateString('bg-BG')}</p>
            <p><strong>Статус:</strong> 
              <span style={{ 
                color: order.status === 'PENDING' ? '#ff9800' : 
                       order.status === 'APPROVED' ? '#4caf50' : 
                       order.status === 'REJECTED' ? '#f44336' : 
                       order.status === 'COMPLETED' ? '#2196f3' : '#666',
                fontWeight: 'bold',
                marginLeft: '0.5rem'
              }}>
                {order.status === 'PENDING' ? 'Чакаща' :
                 order.status === 'APPROVED' ? 'Одобрена' :
                 order.status === 'REJECTED' ? 'Отхвърлена' :
                 order.status === 'COMPLETED' ? 'Завършена' : order.status}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p>Няма поръчки.</p>
      )}
    </div>
  );
};

export default Profile;
