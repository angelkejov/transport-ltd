import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/auth" replace />;
  let isAdmin = false;
  try {
    const decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin === 1 || decoded.isAdmin === true;
  } catch (e) {
    isAdmin = false;
  }
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;