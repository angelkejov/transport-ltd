import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllOrders, getAllGallery } from '../api';
// Add approve/reject API calls
import { approveOrder, rejectOrder } from '../api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    if (tab === 'orders') {
      getAllOrders()
        .then(data => {
          const ordersData = Array.isArray(data) ? data : (data.orders || []);
          setOrders(ordersData);
          setFilteredOrders(ordersData);
        })
        .catch(() => setError('Грешка при зареждане на поръчките.'))
        .finally(() => setLoading(false));
    } else if (tab === 'users') {
      getAllUsers()
        .then(data => setUsers(data))
        .catch(() => setError('Грешка при зареждане на потребителите.'))
        .finally(() => setLoading(false));
    } else if (tab === 'gallery') {
      getAllGallery()
        .then(data => setGallery(data))
        .catch(() => setError('Грешка при зареждане на галерията.'))
        .finally(() => setLoading(false));
    } else if (tab === 'ratings') {
      setRatingsLoading(true);
      setRatingsError('');
      fetch(`${API_URL}/rating`)
        .then(res => res.json())
        .then(data => {
          setRatings(Array.isArray(data) ? data : []);
          setRatingsCount(Array.isArray(data) ? data.length : 0);
        })
        .catch(() => {
          setRatingsError('Грешка при зареждане на оценките.');
          setRatingsCount(0);
        })
        .finally(() => setRatingsLoading(false));
      fetch(`${API_URL}/rating/average`)
        .then(res => res.json())
        .then(data => setAvgRating(data.average))
        .catch(() => setAvgRating(null));
    }
  }, [tab]);

  // Filter orders based on status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  // Approve order handler
  const handleApprove = async (id) => {
    setLoading(true);
    setError('');
    try {
      await approveOrder(id);
      setOrders(orders => orders.map(o => o.id === id ? { ...o, status: 'approved' } : o));
    } catch (err) {
      console.error('Approve error:', err);
      setError(`Грешка при одобряване на поръчката: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Reject order handler
  const handleReject = async (id) => {
    setLoading(true);
    setError('');
    try {
      await rejectOrder(id);
      setOrders(orders => orders.map(o => o.id === id ? { ...o, status: 'rejected' } : o));
    } catch (err) {
      console.error('Reject error:', err);
      setError(`Грешка при отказване на поръчката: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '2rem auto' }}>
      <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>Админ панел</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <button onClick={() => setTab('orders')} style={{ padding: '0.5rem 1.5rem', background: tab === 'orders' ? '#ffd600' : '#fff', border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}>Поръчки</button>
        <button onClick={() => setTab('users')} style={{ padding: '0.5rem 1.5rem', background: tab === 'users' ? '#ffd600' : '#fff', border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}>Потребители</button>
        <button onClick={() => setTab('gallery')} style={{ padding: '0.5rem 1.5rem', background: tab === 'gallery' ? '#ffd600' : '#fff', border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}>Галерия</button>
        <button onClick={() => setTab('ratings')} style={{ padding: '0.5rem 1.5rem', background: tab === 'ratings' ? '#ffd600' : '#fff', border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}>Оценки</button>
      </div>
      {error && (
        <div style={{ background: '#ffebee', padding: '1rem', borderRadius: 8, marginBottom: '1rem', color: '#d32f2f', textAlign: 'center' }}>{error}</div>
      )}
      {ratingsError && (
        <div style={{ background: '#ffebee', padding: '1rem', borderRadius: 8, marginBottom: '1rem', color: '#d32f2f', textAlign: 'center' }}>{ratingsError}</div>
      )}
      {loading || ratingsLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Зареждане...</div>
      ) : (
        <>
          {tab === 'orders' && (
            <div>
              {/* Status Filter */}
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333' }}>Филтър по статус:</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ 
                    padding: '0.5rem', 
                    border: '1px solid #ccc', 
                    borderRadius: 6, 
                    fontSize: '14px',
                    minWidth: '150px'
                  }}
                >
                  <option value="all">Всички поръчки</option>
                  <option value="pending">В изчакване</option>
                  <option value="approved">Одобрени</option>
                  <option value="rejected">Отказани</option>
                </select>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Показване на {filteredOrders.length} от {orders.length} поръчки
                </span>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderCollapse: 'collapse', marginTop: '2rem' }}>
                  <thead>
                    <tr style={{ background: '#ffd600', color: '#222' }}>
                      <th style={{ padding: '1rem' }}>ID</th>
                      <th style={{ padding: '1rem' }}>Потребител</th>
                      <th style={{ padding: '1rem' }}>Имейл</th>
                      <th style={{ padding: '1rem' }}>Телефон</th>
                      <th style={{ padding: '1rem' }}>Услуга</th>
                      <th style={{ padding: '1rem' }}>Детайли</th>
                      <th style={{ padding: '1rem' }}>Дата</th>
                      <th style={{ padding: '1rem' }}>Статус</th>
                      <th style={{ padding: '1rem' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                        {statusFilter === 'all' ? 'Няма поръчки.' : `Няма поръчки със статус "${statusFilter === 'pending' ? 'В изчакване' : statusFilter === 'approved' ? 'Одобрени' : 'Отказани'}"`}
                      </td></tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>{order.id}</td>
                          <td style={{ padding: '1rem' }}>{order.userName || order.userId}</td>
                          <td style={{ padding: '1rem' }}>{order.userEmail}</td>
                          <td style={{ padding: '1rem' }}>{order.phone}</td>
                          <td style={{ padding: '1rem' }}>{order.service}</td>
                          <td style={{ padding: '1rem' }}>{order.details}</td>
                          <td style={{ padding: '1rem' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('bg-BG') : ''}</td>
                          <td style={{ padding: '1rem', color: order.status === 'approved' ? '#388e3c' : order.status === 'rejected' ? '#d32f2f' : '#888' }}>{order.status === 'approved' ? 'Одобрена' : order.status === 'rejected' ? 'Отказана' : 'В изчакване'}</td>
                          <td style={{ padding: '1rem' }}>
                            {order.status === 'pending' && (
                              <>
                                <button onClick={() => handleApprove(order.id)} style={{ marginRight: 8, padding: '0.5rem 1rem', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>Одобри</button>
                                <button onClick={() => handleReject(order.id)} style={{ padding: '0.5rem 1rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>Откажи</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {tab === 'users' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderCollapse: 'collapse', marginTop: '2rem' }}>
                <thead>
                  <tr style={{ background: '#ffd600', color: '#222' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Име</th>
                    <th style={{ padding: '1rem' }}>Имейл</th>
                    <th style={{ padding: '1rem' }}>Админ</th>
                    <th style={{ padding: '1rem' }}>Потвърден</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Няма потребители.</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem' }}>{user.id}</td>
                        <td style={{ padding: '1rem' }}>{user.name}</td>
                        <td style={{ padding: '1rem' }}>{user.email}</td>
                        <td style={{ padding: '1rem' }}>{user.isAdmin ? 'Да' : 'Не'}</td>
                        <td style={{ padding: '1rem' }}>{user.isVerified ? 'Да' : 'Не'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {tab === 'gallery' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {gallery.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center', gridColumn: '1/-1' }}>Няма изображения.</div>
              ) : (
                gallery.map(img => (
                  <div key={img.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={img.url} alt={img.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                    <div style={{ padding: '1rem', color: '#388e3c', fontWeight: 500, textAlign: 'center' }}>{img.title}</div>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'ratings' && (
            <div>
              <h3 style={{ textAlign: 'center', color: '#222', marginBottom: '1rem' }}>
                Средна оценка: {typeof avgRating === 'number' && !isNaN(avgRating) ? avgRating.toFixed(2) : '—'} ★<br/>
                <span style={{ fontSize: 16, color: '#888' }}>
                  {ratingsCount} {ratingsCount === 1 ? 'ревю' : 'ревюта'}
                </span>
              </h3>
              {ratingsError && <div style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '1rem' }}>{ratingsError}</div>}
              {ratingsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Зареждане...</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderCollapse: 'collapse', marginTop: '2rem' }}>
                    <thead>
                      <tr style={{ background: '#ffd600', color: '#222' }}>
                        <th style={{ padding: '1rem' }}>Звезди</th>
                        <th style={{ padding: '1rem' }}>Описание</th>
                        <th style={{ padding: '1rem' }}>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratings.length === 0 ? (
                        <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Няма оценки.</td></tr>
                      ) : (
                        ratings.map(rating => (
                          <tr key={rating.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem', fontSize: 20, color: '#ffd600', textAlign: 'center' }}>{'★'.repeat(rating.stars)}</td>
                            <td style={{ padding: '1rem', color: '#333' }}>{rating.description || <span style={{ color: '#aaa' }}>—</span>}</td>
                            <td style={{ padding: '1rem', color: '#888' }}>{new Date(rating.createdAt).toLocaleString('bg-BG')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard; 