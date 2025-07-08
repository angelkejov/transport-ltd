import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/auth" replace />;
  const { role } = jwtDecode(token);
  if (role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;