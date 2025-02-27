import React from "react";
import { Link } from "react-router-dom";
// Ejemplo usando react-feather para íconos:
import {
  ShoppingCart,
  Package,
  Truck,
  Users,
  CreditCard,
  Settings,
  Bell,
  Search,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart2,
} from "react-feather";

/**
 * Componente principal del Dashboard.
 * Replica la estética del prototipo:
 * - Header con logo, buscador y notificaciones
 * - Sidebar con opciones
 * - Tarjetas de indicadores
 * - Ventas recientes
 * - Acciones rápidas
 * - Notificaciones
 */
const Dashboard = () => {
  // Datos de ejemplo para "Ventas Recientes"
  const ventasRecientes = [
    {
      id: "VNT-2023-0542",
      cliente: "Constructora Ramírez",
      monto: "$1,250.00",
      estado: "Pagado",
      fecha: "Hoy, 10:23 AM",
    },
    {
      id: "VNT-2023-0541",
      cliente: "Ferretería El Constructor",
      monto: "$3,450.00",
      estado: "Pendiente",
      fecha: "Hoy, 9:15 AM",
    },
    {
      id: "VNT-2023-0540",
      cliente: "Juan Pérez",
      monto: "$450.00",
      estado: "Pagado",
      fecha: "Ayer, 4:30 PM",
    },
    {
      id: "VNT-2023-0539",
      cliente: "Constructora Edificar",
      monto: "$5,780.00",
      estado: "Crédito",
      fecha: "Ayer, 2:15 PM",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <Package className="h-5 w-5" />
          <span>VentasPro</span>
        </Link>

        {/* Buscador y notificaciones */}
        <div className="ml-auto flex items-center gap-4">
          {/* Buscador (oculto en pantallas muy pequeñas) */}
          <form className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-64 rounded-md border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          {/* Botón de notificaciones */}
          <button className="relative rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              3
            </span>
          </button>
          {/* Avatar o foto de perfil */}
          <div className="h-8 w-8 rounded-full bg-gray-300" />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <nav className="flex flex-col gap-1 p-4 text-sm">
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 font-medium text-white"
            >
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-muted"
            >
              <ShoppingCart className="h-4 w-4" />
              Ventas
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-muted"
            >
              <Package className="h-4 w-4" />
              Inventario
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-muted"
            >
              <CreditCard className="h-4 w-4" />
              Pagos / Créditos
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-muted"
            >
              <Truck className="h-4 w-4" />
              Logística / Rastras
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-muted"
            >
              <Users className="h-4 w-4" />
              Clientes
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              Mantenimiento
            </Link>
          </nav>
        </aside>

        {/* SECCIÓN PRINCIPAL DEL DASHBOARD */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Tarjetas de indicadores */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Ventas del Día</h3>
                <DollarSign className="h-4 w-4 text-secondary" />
              </div>
              <div className="text-2xl font-bold">$4,550.32</div>
              <p className="text-xs text-gray-500">+20.1% respecto a ayer</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Pedidos Pendientes</h3>
                <ShoppingCart className="h-4 w-4 text-secondary" />
              </div>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">3 requieren atención urgente</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Productos Bajos en Stock</h3>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-gray-500">2 en nivel crítico</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Créditos por Vencer</h3>
                <Clock className="h-4 w-4 text-secondary" />
              </div>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">$12,450.00 en los próximos 7 días</p>
            </div>
          </div>

          {/* Ventas recientes + Acciones rápidas */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Ventas Recientes */}
            <div className="rounded-lg border bg-white p-4 shadow-sm lg:col-span-4">
              <h3 className="text-base font-semibold">Ventas Recientes</h3>
              <p className="text-sm text-gray-500">Últimas transacciones registradas</p>
              <div className="mt-4 space-y-4">
                {ventasRecientes.map((venta) => (
                  <div
                    key={venta.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{venta.cliente}</p>
                      <p className="text-xs text-gray-500">{venta.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{venta.monto}</p>
                        <p className="text-xs text-gray-500">{venta.fecha}</p>
                      </div>
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-xs font-semibold " +
                          (venta.estado === "Pagado"
                            ? "bg-primary text-white"
                            : venta.estado === "Pendiente"
                            ? "border border-secondary text-secondary bg-white"
                            : "bg-accent text-primary")
                        }
                      >
                        {venta.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="rounded-lg border bg-white p-4 shadow-sm lg:col-span-3">
              <h3 className="text-base font-semibold">Acciones Rápidas</h3>
              <p className="text-sm text-gray-500">Accede rápidamente a las funciones más utilizadas</p>
              <div className="mt-4 space-y-3">
                <button className="flex w-full items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
                  <ShoppingCart className="h-4 w-4" />
                  Nueva Venta
                </button>
                <button className="flex w-full items-center gap-2 rounded-md border border-secondary px-4 py-2 text-secondary hover:bg-muted">
                  <CreditCard className="h-4 w-4" />
                  Registrar Pago
                </button>
                <button className="flex w-full items-center gap-2 rounded-md border border-secondary px-4 py-2 text-secondary hover:bg-muted">
                  <Package className="h-4 w-4" />
                  Consultar Inventario
                </button>
                <button className="flex w-full items-center gap-2 rounded-md border border-secondary px-4 py-2 text-secondary hover:bg-muted">
                  <Truck className="h-4 w-4" />
                  Registrar Rastra
                </button>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold">Notificaciones</h3>
            <p className="text-sm text-gray-500">Alertas y mensajes importantes</p>
            {/* Tabs simulados (simple) */}
            <div className="mt-4 flex gap-2">
              <button className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-primary">
                Alertas
              </button>
              <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-muted">
                Mensajes
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2 rounded-lg border p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Stock bajo: Cemento Portland</p>
                  <p className="text-sm text-gray-500">
                    Quedan solo 15 unidades, mínimo recomendado 50.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border p-3">
                <Clock className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Crédito por vencer: Constructora Edificar</p>
                  <p className="text-sm text-gray-500">
                    El crédito #CRD-2023-0089 vence en 2 días.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
