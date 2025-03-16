// src/modules/Ventas/pages/SalesDetail.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Íconos (ej: react-feather) => EJEMPLO:
import { Printer, Edit, ArrowLeft } from "react-feather";

import { Button } from "../../../shared/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Badge } from "../../../shared/components/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "../../../shared/components/Card";
import { Separator } from "../../../shared/components/Separator";

// Datos simulados
const ventaData = {
  id: "VNT-001",
  fecha: "15/07/2023",
  cliente: {
    id: "CLI-001",
    nombre: "Ferretería El Martillo",
    tipoCliente: "Ferretería",
    direccion: "Av. Principal #123, Zona Industrial",
    telefono: "555-1234",
  },
  estado: "Pendiente",
  detalles: [
    {
      idProducto: "PRD-001",
      nombre: "Cemento Portland 42.5kg",
      cantidad: 10,
      precioUnitario: 80.0,
      subtotal: 800.0,
    },
    {
      idProducto: "PRD-004",
      nombre: "Pintura látex blanca 19L",
      cantidad: 2,
      precioUnitario: 210.0,
      subtotal: 420.0,
    },
  ],
  subtotal: 1220.0,
  descuento: 0,
  total: 1220.0,
  vendedor: "Juan Rodríguez",
  fechaCreacion: "15/07/2023 10:25:30",
};

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

function SalesDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venta] = useState(ventaData);

  const handleBack = () => {
    navigate("/ventas");
  };

  const handleEdit = () => {
    navigate(`/ventas/editar/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" onClick={handleBack} className="border-[#A5B4FC]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint} className="border-[#A5B4FC]">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>

          {venta.estado === "Pendiente" && (
            <Button variant="outline" onClick={handleEdit} className="border-[#A5B4FC]">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <Card className="border-[#A5B4FC] shadow-md">
        <CardHeader className="bg-[#F3F4F6] border-b border-[#A5B4FC] pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Venta #{venta.id}</h2>
              <p className="text-sm text-gray-500">Fecha: {venta.fecha}</p>
            </div>
            <Badge className={`font-normal text-sm ${getStatusColor(venta.estado)}`}>
              {venta.estado}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Información del Cliente</h3>
              <div className="space-y-1">
                <p><span className="font-medium">ID:</span> {venta.cliente.id}</p>
                <p><span className="font-medium">Nombre:</span> {venta.cliente.nombre}</p>
                <p><span className="font-medium">Tipo:</span> {venta.cliente.tipoCliente}</p>
                <p><span className="font-medium">Dirección:</span> {venta.cliente.direccion}</p>
                <p><span className="font-medium">Teléfono:</span> {venta.cliente.telefono}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Información de la Venta</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Vendedor:</span> {venta.vendedor}</p>
                <p><span className="font-medium">Fecha de creación:</span> {venta.fechaCreacion}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[#A5B4FC] my-6" />

          <div>
            <h3 className="font-semibold text-[#1E3A8A] mb-4">Detalle de Productos</h3>
            <div className="rounded-md border border-[#A5B4FC] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F3F4F6]">
                  <TableRow>
                    <TableHead className="text-[#111827] w-[100px]">ID</TableHead>
                    <TableHead className="text-[#111827]">Producto</TableHead>
                    <TableHead className="text-[#111827] text-right">Precio</TableHead>
                    <TableHead className="text-[#111827] text-right">Cantidad</TableHead>
                    <TableHead className="text-[#111827] text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venta.detalles.map((detalle, i) => (
                    <TableRow key={i}>
                      <TableCell>{detalle.idProducto}</TableCell>
                      <TableCell>{detalle.nombre}</TableCell>
                      <TableCell className="text-right">${detalle.precioUnitario.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{detalle.cantidad}</TableCell>
                      <TableCell className="text-right">${detalle.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 p-6 bg-[#F3F4F6] border-t border-[#A5B4FC]">
          <div className="space-y-2 text-right w-full sm:w-64">
            <div className="flex justify-between gap-8">
              <span className="font-medium">Subtotal:</span>
              <span className="font-medium">${venta.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="font-medium">Descuento:</span>
              <span className="font-medium text-red-500">-${venta.descuento.toFixed(2)}</span>
            </div>
            <Separator className="bg-[#A5B4FC] my-2" />
            <div className="flex justify-between gap-8 text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-[#1E3A8A]">${venta.total.toFixed(2)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SalesDetail;
