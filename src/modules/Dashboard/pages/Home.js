// src/modules/Dashboard/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Datos quemados (mock)
  const indicadores = [
    { titulo: 'Ventas del Día', valor: '$4,550.32' },
    { titulo: 'Pedidos Pendientes', valor: '12' },
    { titulo: 'Productos Bajas en Stock', valor: '7' },
    { titulo: 'Créditos por Vencer', valor: '5' },
  ];

  const ventasRecientes = [
    {
      cliente: 'Constructora Ramírez',
      ventaId: 'VNT-2023-0462',
      monto: '$2,500.00',
      estado: 'Pagado',
    },
    {
      cliente: 'Ferretería El Constructor',
      ventaId: 'VNT-2023-0463',
      monto: '$3,450.00',
      estado: 'Pendiente',
    },
    {
      cliente: 'Juan Pérez',
      ventaId: 'VNT-2023-0464',
      monto: '$850.00',
      estado: 'Pendiente',
    },
    {
      cliente: 'Constructora Edificar',
      ventaId: 'VNT-2023-0465',
      monto: '$2,000.00',
      estado: 'Crédito',
    },
  ];

  const notificacionesAlertas = [
    {
      tipo: 'Alerta',
      mensaje: 'Stock bajo: Cemento Portland (queda menos de 50).',
    },
    {
      tipo: 'Mensaje',
      mensaje: 'Crédito por vencer: Constructora Edificar (saldo $2,000).',
    },
  ];

  return (
    <div className="home-container">
      {/* Menú lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">VentaPro</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link active">
            <i className="icon-home" /> Dashboard
          </Link>
          <Link to="#!" className="nav-link">
            <i className="icon-users" /> Clientes
          </Link>
          <Link to="#!" className="nav-link">
            <i className="icon-box" /> Inventario
          </Link>
          <Link to="#!" className="nav-link">
            <i className="icon-credit-card" /> Pagos / Créditos
          </Link>
          <Link to="#!" className="nav-link">
            <i className="icon-truck" /> Logística / Rastras
          </Link>
          <Link to="#!" className="nav-link">
            <i className="icon-file" /> Mantenimiento
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Barra superior */}
        <header className="topbar">
          <div className="search-container">
            <input type="text" placeholder="Buscar..." />
            <button type="button">
              <i className="icon-search" />
            </button>
          </div>
          <div className="topbar-user">
            <span>Usuario Admin</span>
            <img
              src="https://via.placeholder.com/40"
              alt="Perfil"
              className="user-avatar"
            />
          </div>
        </header>

        {/* Sección de Dashboard */}
        <div className="dashboard-content">
          {/* Indicadores principales */}
          <div className="indicadores-container">
            {indicadores.map((item, idx) => (
              <div className="indicador-card" key={idx}>
                <p className="indicador-titulo">{item.titulo}</p>
                <p className="indicador-valor">{item.valor}</p>
              </div>
            ))}
          </div>

          {/* Contenedor de columnas (Ventas recientes / Acciones rápidas) */}
          <div className="content-row">
            <div className="column-left">
              {/* Ventas recientes */}
              <div className="ventas-recientes-card">
                <h3>Ventas Recientes</h3>
                <ul>
                  {ventasRecientes.map((venta, index) => (
                    <li key={index} className="venta-item">
                      <div>
                        <strong>{venta.cliente}</strong>
                        <p>{venta.ventaId}</p>
                      </div>
                      <div className="venta-estado">
                        <span className="venta-monto">{venta.monto}</span>
                        <span className={`estado-tag estado-${venta.estado.toLowerCase()}`}>
                          {venta.estado}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="column-right">
              {/* Acciones rápidas */}
              <div className="acciones-rapidas-card">
                <h3>Acciones Rápidas</h3>
                <button className="accion-button">Nueva Venta</button>
                <button className="accion-button">Registrar Pago</button>
                <button className="accion-button">Consultar Inventario</button>
                <button className="accion-button">Registrar Rastra</button>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="notificaciones-card">
            <h3>Notificaciones</h3>
            <div className="notificaciones-tabs">
              <button className="tab-button active">Alertas</button>
              <button className="tab-button">Mensajes</button>
            </div>
            <div className="notificaciones-list">
              {notificacionesAlertas.map((notif, i) => (
                <div key={i} className="notif-item">
                  <strong>{notif.tipo}:</strong> {notif.mensaje}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
