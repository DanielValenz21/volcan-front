// src/modules/Ventas/pages/VentasPage.js
import React, { useState } from "react";
import SalesList from "./SalesList";
import SalesCreate from "./SalesCreate";

function VentasPage() {
  // Tab local: "list" o "create"
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Módulo de Ventas</h1>

      {/* Botones para cambiar de Tab */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            activeTab === "list" ? "bg-[#3B82F6] text-white" : "bg-white text-[#111827]"
          }`}
        >
          Listar Ventas
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            activeTab === "create" ? "bg-[#3B82F6] text-white" : "bg-white text-[#111827]"
          }`}
        >
          Nueva Venta
        </button>
      </div>

      {/* Render condicional */}
      {activeTab === "list" ? <SalesList /> : <SalesCreate />}
    </div>
  );
}

export default VentasPage;
