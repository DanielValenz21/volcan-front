// src/modules/Ventas/pages/VentasPage.js
import React, { useState } from "react";
import SalesList from "./SalesList";
import SalesCreate from "./SalesCreate";

function VentasPage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Módulo de Ventas</h1>

      {/* Botones tipo switch para pestañas */}
      <div className="mb-6 flex rounded-md border overflow-hidden">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 px-6 py-3 text-lg font-medium transition-colors ${
            activeTab === "list"
              ? "bg-[#3B82F6] text-white"
              : "bg-white text-[#111827] hover:bg-gray-100"
          }`}
        >
          Listar Ventas
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`flex-1 px-6 py-3 text-lg font-medium transition-colors ${
            activeTab === "create"
              ? "bg-[#3B82F6] text-white"
              : "bg-white text-[#111827] hover:bg-gray-100"
          }`}
        >
          Nueva Venta
        </button>
      </div>

      {activeTab === "list" ? <SalesList /> : <SalesCreate />}
    </div>
  );
}

export default VentasPage;
