// src/routes/AppRoutes.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../modules/Auth/pages/Login";        // Importa tu Login
import Dashboard from "../modules/Dashboard/pages/Dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Muestra el Login en la ruta raíz */}
        <Route path="/" element={<Login />} />

        {/* Dashboard en /dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
