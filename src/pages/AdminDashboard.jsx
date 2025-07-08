import React, { useState, useEffect } from 'react';
import API from '../api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Не сте влезли в профила си.');
        return;
      }

      let endpoint = '/orders/all';
      if (statusFilter !== 'all') {
        endpoint = `/orders/status/${statusFilter}`;
      }

      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Грешка при зареждане на поръчките.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Не сте влезли в профила си.');
        return;
      }

      await API.put('/orders/update-status', {
        orderId: orderId,
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh orders after update
      fetchOrders();
    } catch (err) {
      setError(err.response?.data || 'Грешка при обновяване на статуса.');
    }
  };

  const handleReject = (id) => {
    handleStatusUpdate(id, 'REJECTED');
  };

  const handleApprove = (id) => {
    handleStatusUpdate(id, 'APPROVED');
  };

  const handleComplete = (id) => {
    handleStatusUpdate(id, 'COMPLETED');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '2rem auto' }}>
      <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>Админ панел - Поръчки</h2>
      
      {/* Status Filter */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', marginRight: '1rem' }}
        >
          <option value="all">Всички поръчки</option>
          <option value="PENDING">Чакащи</option>
          <option value="APPROVED">Одобрени</option>
          <option value="REJECTED">Отхвърлени</option>
          <option value="COMPLETED">Завършени</option>
        </select>
      </div>

      {error && (
        <div style={{ background: '#ffebee', padding: '1rem', borderRadius: 8, marginBottom: '1rem', color: '#d32f2f', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Зареждане...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderCollapse: 'collapse', marginTop: '2rem' }}>
          <thead>
            <tr style={{ background: '#ffd600', color: '#222' }}>
              <th style={{ padding: '1rem' }}>Клиент</th>
              <th style={{ padding: '1rem' }}>Имейл</th>
              <th style={{ padding: '1rem' }}>Телефон</th>
              <th style={{ padding: '1rem' }}>Услуга</th>
              <th style={{ padding: '1rem' }}>Дата</th>
              <th style={{ padding: '1rem' }}>Статус</th>
              <th style={{ padding: '1rem' }}>Действие</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Няма активни поръчки.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{order.userName}</td>
                  <td style={{ padding: '1rem' }}>{order.userEmail}</td>
                  <td style={{ padding: '1rem' }}>{order.phoneNumber}</td>
                  <td style={{ padding: '1rem' }}>{order.serviceName}</td>
                  <td style={{ padding: '1rem' }}>{new Date(order.date).toLocaleDateString('bg-BG')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      color: order.status === 'PENDING' ? '#ff9800' : 
                             order.status === 'APPROVED' ? '#4caf50' : 
                             order.status === 'REJECTED' ? '#f44336' : 
                             order.status === 'COMPLETED' ? '#2196f3' : '#666',
                      fontWeight: 'bold'
                    }}>
                      {order.status === 'PENDING' ? 'Чакаща' :
                       order.status === 'APPROVED' ? 'Одобрена' :
                       order.status === 'REJECTED' ? 'Отхвърлена' :
                       order.status === 'COMPLETED' ? 'Завършена' : order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleApprove(order.id)} style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer', marginRight: 8 }}>Одобри</button>
                        <button onClick={() => handleReject(order.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer', marginRight: 8 }}>Откажи</button>
                      </>
                    )}
                    {order.status === 'APPROVED' && (
                      <button onClick={() => handleComplete(order.id)} style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>Завърши</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 