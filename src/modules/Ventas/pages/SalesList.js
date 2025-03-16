// src/modules/Ventas/pages/SalesList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// Componentes compartidos
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/Select";
import { Badge } from "../../../shared/components/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../shared/components/Popover";
import { Card, CardContent } from "../../../shared/components/Card";
import { Calendar } from "../../../shared/components/Calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../shared/components/DropdownMenu";

// Datos de ejemplo
const salesData = [
  { id: "VNT-001", fecha: new Date(2023, 6, 15), cliente: "Ferretería El Martillo", total: 1250.75, estado: "Pendiente" },
  { id: "VNT-002", fecha: new Date(2023, 6, 16), cliente: "Constructora Edificar", total: 3450.0, estado: "Pagado" },
  { id: "VNT-003", fecha: new Date(2023, 6, 17), cliente: "Juan Pérez", total: 450.25, estado: "Entregado" },
  { id: "VNT-004", fecha: new Date(2023, 6, 18), cliente: "Ferretería La Llave", total: 2100.5, estado: "Pendiente" },
  { id: "VNT-005", fecha: new Date(2023, 6, 19), cliente: "Constructora Moderna", total: 5670.0, estado: "Pagado" },
];

// Función para asignar color a la etiqueta de estado
const getStatusColor = (status) => {
  switch (status) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "Pagado":
      return "bg-green-100 text-green-800";
    case "Entregado":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function SalesList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [date, setDate] = useState(null);
  const [activeSaleId, setActiveSaleId] = useState(null);
  // Nuevo efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleDocumentClick() {
      setActiveSaleId(null);
    }
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Filtra las ventas según búsqueda, estado y fecha
  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || sale.estado === statusFilter;
    const matchesDate =
      !date || format(sale.fecha, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetail = (id, e) => {
    e.stopPropagation();
    navigate(`/ventas/detalle/${id}`);
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/ventas/editar/${id}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setDate(null);
  };

  return (
    <Card className="border-[#A5B4FC] shadow-md">
      <CardContent className="p-6">
        {/* FILTROS: Búsqueda y Estado */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Barra de Búsqueda */}
          <div className="relative w-full md:w-96">
            {/* Ícono de lupa dentro del input */}
            <img
              src="/ver.png"
              alt="Buscar"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50"
            />
            <Input
              placeholder="Buscar por cliente o ID de venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-[#A5B4FC] focus:border-[#3B82F6]"
            />
          </div>

          {/* Select de estado */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-[#A5B4FC]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>

            {/* Botón "Limpiar filtros" si hay algo aplicado */}
            {(searchTerm || statusFilter !== "todos" || date) && (
              <Button variant="ghost" onClick={clearFilters} className="text-[#3B82F6]">
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* TABLA DE VENTAS */}
        <div className="rounded-md border border-[#A5B4FC]">
          <Table>
            <TableHeader className="bg-[#F3F4F6]">
              <TableRow>
                <TableHead className="text-[#111827] font-semibold">ID Venta</TableHead>
                <TableHead className="text-[#111827] font-semibold">Fecha</TableHead>
                <TableHead className="text-[#111827] font-semibold">Cliente</TableHead>
                <TableHead className="text-[#111827] font-semibold text-right">Total</TableHead>
                <TableHead className="text-[#111827] font-semibold">Estado</TableHead>
                {/* Nueva columna "Acción" */}
                <TableHead className="text-[#111827] font-semibold text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale, index) => (
                  <TableRow key={sale.id} className="hover:bg-[#F3F4F6] relative">
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{format(sale.fecha, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{sale.cliente}</TableCell>
                    <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`font-normal ${getStatusColor(sale.estado)}`}>
                        {sale.estado}
                      </Badge>
                    </TableCell>
                    {/* Nueva celda para el botón "Acción" */}
                    <TableCell className="text-center relative">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSaleId(activeSaleId === sale.id ? null : sale.id);
                        }}
                        className="px-2 py-1 flex items-center gap-2" // Removed text "Acción", kept only the icon
                      >
                        <img src="/abajo.png" alt="Acción" className="h-6 w-6 filter brightness-0" />
                      </Button>
                      {activeSaleId === sale.id && (
                        <div className="absolute right-0 top-full mt-2 z-10 p-2 bg-white border rounded shadow">
                          <Button
                            variant="ghost"
                            onClick={(e) => handleViewDetail(sale.id, e)}
                            className="flex items-center gap-2"
                          >
                            <img src="/ver.png" alt="Ver" className="h-4 w-4" />
                            Ver detalle
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => handleEdit(sale.id, e)}
                            className="flex items-center gap-2 mt-2"
                          >
                            <img src="/editar.png" alt="Editar" className="h-4 w-4" />
                            Editar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SalesList;
