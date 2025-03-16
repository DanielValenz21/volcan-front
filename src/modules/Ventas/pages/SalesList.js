// src/modules/Ventas/pages/SalesList.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// ICONOS (usa react-feather o quita si no te interesan)
import { Search as SearchIcon } from "react-feather";

// Componentes compartidos (stubs) – AJUSTA las rutas si difieren
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/Select";
import { Badge } from "../../../shared/components/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../shared/components/Popover";
import { Card, CardContent } from "../../../shared/components/Card";
import { Calendar } from "../../../shared/components/Calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../shared/components/DropdownMenu";

// Datos de ejemplo
const salesData = [
  { id: "VNT-001", fecha: new Date(2023, 6, 15), cliente: "Ferretería El Martillo", total: 1250.75, estado: "Pendiente" },
  { id: "VNT-002", fecha: new Date(2023, 6, 16), cliente: "Constructora Edificar", total: 3450.0, estado: "Pagado" },
  { id: "VNT-003", fecha: new Date(2023, 6, 17), cliente: "Juan Pérez", total: 450.25, estado: "Entregado" },
  { id: "VNT-004", fecha: new Date(2023, 6, 18), cliente: "Ferretería La Llave", total: 2100.5, estado: "Pendiente" },
  { id: "VNT-005", fecha: new Date(2023, 6, 19), cliente: "Constructora Moderna", total: 5670.0, estado: "Pagado" },
];

// Badge de colores
const getStatusColor = (status) => {
  switch (status) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Pagado":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Entregado":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

function SalesList() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [date, setDate] = useState(null);

  // Filtra las ventas
  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "todos" || sale.estado === statusFilter;

    // Comparación de fecha
    const matchesDate =
      !date ||
      format(sale.fecha, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetail = (id) => {
    // /ventas/detalle/:id
    navigate(`/ventas/detalle/${id}`);
  };

  const handleEdit = (id) => {
    // /ventas/editar/:id
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por cliente o ID de venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#A5B4FC] focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Select estado */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 border-[#A5B4FC]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>

            {/* Popover con calendario */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`border-[#A5B4FC] ${date ? "text-[#1E3A8A]" : ""}`}>
                  <span className="mr-2">📅</span>
                  {date ? format(date, "dd/MM/yyyy") : "Fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

            {/* Limpiar */}
            {(searchTerm || statusFilter !== "todos" || date) && (
              <Button variant="ghost" onClick={clearFilters} className="text-[#3B82F6]">
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-md border border-[#A5B4FC] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#F3F4F6]">
              <TableRow>
                <TableHead className="text-[#111827] font-semibold">ID Venta</TableHead>
                <TableHead className="text-[#111827] font-semibold">Fecha</TableHead>
                <TableHead className="text-[#111827] font-semibold">Cliente</TableHead>
                <TableHead className="text-[#111827] font-semibold text-right">Total</TableHead>
                <TableHead className="text-[#111827] font-semibold">Estado</TableHead>
                <TableHead className="text-[#111827] font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-[#F3F4F6]">
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{format(sale.fecha, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{sale.cliente}</TableCell>
                    <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`font-normal ${getStatusColor(sale.estado)}`}>
                        {sale.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            ⋮
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetail(sale.id)}>
                            Ver detalle
                          </DropdownMenuItem>
                          {sale.estado === "Pendiente" && (
                            <DropdownMenuItem onClick={() => handleEdit(sale.id)}>
                              Editar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
