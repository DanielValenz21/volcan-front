// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../modules/Auth/pages/Login';
import Home from '../modules/Dashboard/pages/Home';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
