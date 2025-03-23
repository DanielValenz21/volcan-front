// src/modules/Ventas/pages/SalesDetail.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Printer, Edit, ArrowLeft } from "react-feather";
import axios from "axios";

import { Button } from "../../../shared/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Badge } from "../../../shared/components/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "../../../shared/components/Card";
import { Separator } from "../../../shared/components/Separator";

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

function SalesDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/ventas/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((resp) => {
        // resp.data: { venta, detalles }
        setVenta(resp.data.venta);
        setDetalles(resp.data.detalles);
      })
      .catch((error) => {
        console.error("Error al obtener detalle de venta:", error);
      });
  }, [id]);

  const handleBack = () => navigate("/ventas");
  const handleEdit = () => navigate(`/ventas/editar/${id}`);
  const handlePrint = () => window.print();

  if (!venta) {
    return (
      <div className="p-6">
        <p>Cargando detalles de la venta...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button variant="outline" onClick={handleBack} className="border-[#A5B4FC]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint} className="border-[#A5B4FC]">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          {venta.Estado === "Pendiente" && (
            <Button variant="outline" onClick={handleEdit} className="border-[#A5B4FC]">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>
      <Card className="border-[#A5B4FC] shadow-md">
        <CardHeader className="bg-[#F3F4F6] border-b border-[#A5B4FC] pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Venta #{venta.IdVenta}</h2>
              <p className="text-sm text-gray-500">Fecha: {new Date(venta.FechaVenta).toLocaleString()}</p>
            </div>
            <Badge className={`font-normal text-sm ${getStatusColor(venta.Estado)}`}>
              {venta.Estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Aquí podrías cargar info del cliente si la tuvieras unida. 
              Por ahora, sólo muestro IDCliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Información del Cliente</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">ID Cliente:</span> {venta.IdCliente}
                </p>
                {/* Podrías hacer otra llamada para traer el nombre del cliente */}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Información de la Venta</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">CreadoPor (IdUsuario):</span> {venta.CreadoPor}
                </p>
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
                    <TableHead className="text-[#111827] w-[100px]">ID Prod</TableHead>
                    <TableHead className="text-[#111827]">Producto</TableHead>
                    <TableHead className="text-[#111827] text-right">Precio</TableHead>
                    <TableHead className="text-[#111827] text-right">Cantidad</TableHead>
                    <TableHead className="text-[#111827] text-right">Descuento (%)</TableHead>
                    <TableHead className="text-[#111827] text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detalles.map((detalle) => {
                    // Calcular subtotal real
                    const precioEfectivo =
                      detalle.PrecioUnitario * (1 - detalle.PorcentajeDescuento / 100);
                    const subtotalLinea = precioEfectivo * detalle.Cantidad;

                    return (
                      <TableRow key={detalle.IdDetalleVenta}>
                        <TableCell>{detalle.IdProducto}</TableCell>
                        <TableCell>{detalle.NombreProducto || "Sin nombre"}</TableCell>
                        <TableCell className="text-right">
                          ${detalle.PrecioUnitario.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{detalle.Cantidad}</TableCell>
                        <TableCell className="text-right">
                          {detalle.PorcentajeDescuento}%
                        </TableCell>
                        <TableCell className="text-right">${subtotalLinea.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 p-6 bg-[#F3F4F6] border-t border-[#A5B4FC]">
          <div className="space-y-2 text-right w-full sm:w-64">
            <div className="flex justify-between gap-8">
              <span className="font-medium">Subtotal:</span>
              <span className="font-medium">${venta.Subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="font-medium">Descuento:</span>
              <span className="font-medium text-red-500">-${venta.Descuento?.toFixed(2)}</span>
            </div>
            <Separator className="bg-[#A5B4FC] my-2" />
            <div className="flex justify-between gap-8 text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-[#1E3A8A]">${venta.Total?.toFixed(2)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SalesDetail;
