// src/routes/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Revisa si existe un token

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza el componente protegido
  return children;
};

export default ProtectedRoute;
