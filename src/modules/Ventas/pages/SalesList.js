// src/modules/Ventas/pages/SalesList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";

import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/Select";
import { Badge } from "../../../shared/components/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../shared/components/Popover";
import { Card, CardContent } from "../../../shared/components/Card";
import { Calendar } from "../../../shared/components/Calendar";

function SalesList() {
  const navigate = useNavigate();

  // Datos que vienen de la DB
  const [sales, setSales] = useState([]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [date, setDate] = useState(null);

  // Para controlar popover de calendario
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Cargar ventas desde la API
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/ventas", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((resp) => {
        setSales(resp.data); // resp.data debe ser un array de Ventas
      })
      .catch((error) => {
        console.error("Error al obtener ventas:", error);
      });
  }, []);

  // Función para asignar color al estado
  const getStatusColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Pagado":
        return "bg-green-100 text-green-800";
      case "Entregado":
        return "bg-blue-100 text-blue-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar
  const filteredSales = sales.filter((sale) => {
    // sale.FechaVenta es un string o Date? Asumimos string convertible
    const saleDate = new Date(sale.FechaVenta);

    const matchesSearch =
      sale.IdVenta?.toString().includes(searchTerm) ||
      (sale.IdCliente?.toString() || "").includes(searchTerm); // o lo que prefieras filtrar
    const matchesStatus = statusFilter === "todos" || sale.Estado === statusFilter;
    const matchesDate = !date || saleDate.toDateString() === date.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetail = (id) => {
    navigate(`/ventas/detalle/${id}`);
  };

  const handleEdit = (id) => {
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
        {/* FILTROS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Input de búsqueda */}
          <div className="relative w-full md:w-96">
            <img
              src="/search.png"
              alt="Buscar"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700"
            />
            <Input
              placeholder="Buscar por ID de venta o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-[#A5B4FC] focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Select para estado */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-[#A5B4FC]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            {/* Botón de FECHA con popover manual */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-[#A5B4FC] flex items-center gap-2 px-3 py-2 hover:border-[#3B82F6]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCalendarOpen(true);
                  }}
                >
                  <img src="/fecha.png" alt="Calendario" className="h-4 w-4 text-gray-500" />
                  <span>Fecha</span>
                </Button>
              </PopoverTrigger>
              {calendarOpen && (
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    selected={date}
                    onSelect={(sel) => {
                      setDate(sel);
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              )}
            </Popover>

            {/* Botón Limpiar */}
            {(searchTerm || statusFilter !== "todos" || date) && (
              <Button variant="ghost" onClick={clearFilters} className="text-[#3B82F6]">
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* TABLA */}
        <div className="rounded-md border border-[#A5B4FC]">
          <Table>
            <TableHeader className="bg-[#F3F4F6]">
              <TableRow>
                <TableHead className="text-[#111827] font-semibold">ID Venta</TableHead>
                <TableHead className="text-[#111827] font-semibold">Fecha</TableHead>
                <TableHead className="text-[#111827] font-semibold">Cliente</TableHead>
                <TableHead className="text-[#111827] font-semibold text-right">Total</TableHead>
                <TableHead className="text-[#111827] font-semibold">Estado</TableHead>
                <TableHead className="text-[#111827] font-semibold text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.IdVenta} className="hover:bg-[#F3F4F6]">
                    <TableCell className="font-medium">{sale.IdVenta}</TableCell>
                    <TableCell>{format(new Date(sale.FechaVenta), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>{sale.IdCliente}</TableCell>
                    <TableCell className="text-right">${sale.Total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`font-normal ${getStatusColor(sale.Estado)}`}>
                        {sale.Estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {/* Botones de acciones */}
                      <div className="flex gap-2 justify-center">
                        <Button variant="ghost" onClick={() => handleViewDetail(sale.IdVenta)}>
                          <img src="/ver.png" alt="Ver" className="h-4 w-4" />
                        </Button>
                        {/* Solo permitir editar si está Pendiente */}
                        {sale.Estado === "Pendiente" && (
                          <Button variant="ghost" onClick={() => handleEdit(sale.IdVenta)}>
                            <img src="/editar.png" alt="Editar" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
