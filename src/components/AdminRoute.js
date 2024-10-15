// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // Ambil data pengguna dari localStorage
  const storedUser = localStorage.getItem('user');
  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  // Periksa apakah pengguna ada dan memiliki peran 'admin'
  if (user && user.role === 'admin') {
    return children;
  } else {
    // Jika tidak, arahkan pengguna ke halaman utama atau halaman yang diinginkan
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
