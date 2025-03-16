import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../modules/Auth/pages/Login";
import Dashboard from "../modules/Dashboard/pages/Dashboard";
// Importamos vistas de Ventas
import VentasPage from "../modules/Ventas/pages/VentasPage";
import SalesDetail from "../modules/Ventas/pages/SalesDetail";
import SalesCreate from "../modules/Ventas/pages/SalesCreate";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* VENTAS */}
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/ventas/detalle/:id" element={<SalesDetail />} />
        <Route path="/ventas/editar/:id" element={<SalesCreate />} />

        {/* ... otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
