// src/modules/Ventas/pages/SalesCreate.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash, Plus, Search as SearchIcon, AlertCircle } from "react-feather";

import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/Select";
import { Card, CardContent, CardFooter } from "../../../shared/components/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../../shared/components/Dialog";
import { Label } from "../../../shared/components/Label";
import { Alert, AlertTitle, AlertDescription } from "../../../shared/components/Alert";
import { Separator } from "../../../shared/components/Separator";

// Datos ejemplo
const clientesData = [
  { id: "CLI-001", nombre: "Ferretería El Martillo", tipoCliente: "Ferretería" },
  { id: "CLI-002", nombre: "Constructora Edificar", tipoCliente: "Constructora" },
  { id: "CLI-003", nombre: "Juan Pérez", tipoCliente: "CF" },
];

const productosData = [
  { id: "PRD-001", nombre: "Cemento Portland 42.5kg", precioBase: 85.5, stock: 150 },
  { id: "PRD-002", nombre: "Varilla de acero 12mm x 6m", precioBase: 45.75, stock: 200 },
  { id: "PRD-003", nombre: "Bloque de concreto 15x20x40cm", precioBase: 12.25, stock: 500 },
];

// Precios especiales
const preciosEspeciales = [
  { idProducto: "PRD-001", tipoCliente: "Ferretería", precio: 80.0 },
  { idProducto: "PRD-001", tipoCliente: "Constructora", precio: 75.5 },
];

function SalesCreate() {
  const navigate = useNavigate();
  const { id } = useParams(); // si venimos de "/ventas/editar/:id"
  // States
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchProducto, setSearchProducto] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState(productosData);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Efecto para "editar"
  useEffect(() => {
    if (id) {
      // supuestamente buscar venta en el backend
      console.log("Editando venta con ID:", id);
    }
  }, [id]);

  // Actualizar tipo de cliente si se selecciona uno
  useEffect(() => {
    if (clienteSeleccionado) {
      const c = clientesData.find((cl) => cl.id === clienteSeleccionado);
      if (c) setTipoCliente(c.tipoCliente);
    } else {
      setTipoCliente("");
    }
  }, [clienteSeleccionado]);

  // Calcular subtotal/total cuando cambien detalles/descuento
  useEffect(() => {
    const newSubtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal - descuento);
  }, [detalles, descuento]);

  // Filtrar productos
  useEffect(() => {
    if (searchProducto) {
      const filtered = productosData.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
          p.id.toLowerCase().includes(searchProducto.toLowerCase())
      );
      setProductosFiltrados(filtered);
    } else {
      setProductosFiltrados(productosData);
    }
  }, [searchProducto]);

  // Obtener precio
  const getPrecioProducto = (idProducto) => {
    if (!tipoCliente) return 0;
    const precioEsp = preciosEspeciales.find((x) => x.idProducto === idProducto && x.tipoCliente === tipoCliente);
    if (precioEsp) return precioEsp.precio;
    const prod = productosData.find((p) => p.id === idProducto);
    return prod ? prod.precioBase : 0;
  };

  // Agregar producto
  const agregarProducto = () => {
    if (!productoSeleccionado) {
      setErrorMessage("Debe seleccionar un producto");
      return;
    }
    if (cantidad <= 0) {
      setErrorMessage("La cantidad debe ser mayor a 0");
      return;
    }

    const prod = productosData.find((p) => p.id === productoSeleccionado.id);
    if (!prod) {
      setErrorMessage("Producto no encontrado");
      return;
    }
    if (cantidad > prod.stock) {
      setErrorMessage(`Stock insuficiente. Disponible: ${prod.stock}`);
      return;
    }

    // Ver si ya existe en la tabla
    const idx = detalles.findIndex((d) => d.idProducto === prod.id);
    if (idx >= 0) {
      // Actualizar
      const newDet = [...detalles];
      newDet[idx].cantidad += cantidad;
      newDet[idx].subtotal = newDet[idx].cantidad * newDet[idx].precioUnitario;
      setDetalles(newDet);
    } else {
      // Nuevo
      const precioUnitario = getPrecioProducto(prod.id);
      const nuevoDetalle = {
        idProducto: prod.id,
        nombre: prod.nombre,
        cantidad,
        precioUnitario,
        subtotal: cantidad * precioUnitario,
      };
      setDetalles([...detalles, nuevoDetalle]);
    }

    // Limpieza
    setProductoSeleccionado(null);
    setCantidad(1);
    setSearchProducto("");
    setDialogOpen(false);
    setErrorMessage("");
  };

  // Eliminar producto
  const eliminarProducto = (index) => {
    const newDet = [...detalles];
    newDet.splice(index, 1);
    setDetalles(newDet);
  };

  // Actualizar cantidad
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    const prod = productosData.find((p) => p.id === detalles[index].idProducto);
    if (prod && nuevaCantidad > prod.stock) {
      setErrorMessage(`Stock insuficiente para ${prod.nombre}. Disponible: ${prod.stock}`);
      return;
    }
    const newDet = [...detalles];
    newDet[index].cantidad = nuevaCantidad;
    newDet[index].subtotal = nuevaCantidad * newDet[index].precioUnitario;
    setDetalles(newDet);
    setErrorMessage("");
  };

  // Guardar
  const guardarVenta = () => {
    if (!clienteSeleccionado) {
      setErrorMessage("Debe seleccionar un cliente");
      return;
    }
    if (detalles.length === 0) {
      setErrorMessage("Debe agregar al menos un producto");
      return;
    }

    console.log("Guardando venta...", { clienteSeleccionado, detalles, total });
    setSuccessMessage("Venta guardada correctamente");

    // Reset
    setTimeout(() => {
      setClienteSeleccionado("");
      setTipoCliente("");
      setDetalles([]);
      setDescuento(0);
      setSuccessMessage("");
      if (id) navigate("/ventas");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="border-[#A5B4FC] shadow-md">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Encabezado */}
            <div>
              <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4">
                {id ? "Editar Venta" : "Información de la Venta"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <div className="relative">
                    <Select value={clienteSeleccionado} onValueChange={setClienteSeleccionado}>
                      <SelectTrigger id="cliente" className="h-10 px-3 py-2 rounded-md border border-[#A5B4FC] bg-[#F3F4F6]">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientesData.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nombre} ({c.tipoCliente})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {tipoCliente && (
                  <div className="space-y-2">
                    <Label>Tipo de Cliente</Label>
                    <div className="h-10 px-3 py-2 rounded-md border border-[#A5B4FC] bg-[#F3F4F6]">
                      {tipoCliente}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#A5B4FC]" />

            {/* Productos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1E3A8A]">
                  {id ? "Productos de la Venta" : "Productos"}
                </h2>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#3B82F6] hover:bg-[#1E3A8A]">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Producto</DialogTitle>
                      <DialogDescription>
                        Busque y seleccione un producto para agregar a la venta.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar producto..."
                          value={searchProducto}
                          onChange={(e) => setSearchProducto(e.target.value)}
                          className="pl-10 border-[#A5B4FC]"
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto border rounded-md">
                        <Table>
                          <TableHeader className="bg-[#F3F4F6] sticky top-0">
                            <TableRow>
                              <TableHead className="text-[#111827] w-[100px]">ID</TableHead>
                              <TableHead className="text-[#111827]">Nombre</TableHead>
                              <TableHead className="text-[#111827] text-right">Precio</TableHead>
                              <TableHead className="text-[#111827] text-right">Stock</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productosFiltrados.length > 0 ? (
                              productosFiltrados.map((prod) => (
                                <TableRow
                                  key={prod.id}
                                  className={`cursor-pointer hover:bg-[#F3F4F6] ${
                                    productoSeleccionado?.id === prod.id ? "bg-[#A5B4FC]/20" : ""
                                  }`}
                                  onClick={() => setProductoSeleccionado(prod)}
                                >
                                  <TableCell>{prod.id}</TableCell>
                                  <TableCell>{prod.nombre}</TableCell>
                                  <TableCell className="text-right">
                                    ${tipoCliente ? getPrecioProducto(prod.id).toFixed(2) : prod.precioBase.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">{prod.stock}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                  No se encontraron productos.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {productoSeleccionado && (
                        <div className="space-y-2">
                          <Label htmlFor="cantidad">Cantidad</Label>
                          <Input
                            id="cantidad"
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                            className="border-[#A5B4FC]"
                          />
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={agregarProducto}
                        disabled={!productoSeleccionado}
                        className="bg-[#3B82F6] hover:bg-[#1E3A8A]"
                      >
                        Agregar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border border-[#A5B4FC] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F3F4F6]">
                    <TableRow>
                      <TableHead className="text-[#111827] w-[100px]">ID</TableHead>
                      <TableHead className="text-[#111827]">Producto</TableHead>
                      <TableHead className="text-[#111827] text-right">Precio</TableHead>
                      <TableHead className="text-[#111827] text-right">Cantidad</TableHead>
                      <TableHead className="text-[#111827] text-right">Subtotal</TableHead>
                      <TableHead className="text-[#111827] w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.length > 0 ? (
                      detalles.map((d, index) => (
                        <TableRow key={index}>
                          <TableCell>{d.idProducto}</TableCell>
                          <TableCell>{d.nombre}</TableCell>
                          <TableCell className="text-right">${d.precioUnitario.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => actualizarCantidad(index, d.cantidad - 1)}
                              >
                                -
                              </Button>
                              <div className="h-8 px-3 flex items-center justify-center border-y border-input">
                                {d.cantidad}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => actualizarCantidad(index, d.cantidad + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${d.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarProducto(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No hay productos agregados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 bg-[#F3F4F6] border-t border-[#A5B4FC]">
          <div className="space-y-2 w-full sm:w-auto">
            <div className="flex justify-between gap-8">
              <Label htmlFor="descuento">Descuento ($)</Label>
              <Input
                id="descuento"
                type="number"
                min="0"
                step="0.01"
                value={descuento}
                onChange={(e) => setDescuento(Number.parseFloat(e.target.value) || 0)}
                className="w-32 border-[#A5B4FC]"
              />
            </div>
          </div>

          <div className="space-y-2 text-right w-full sm:w-auto">
            <div className="flex justify-between gap-8">
              <span className="font-medium">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="font-medium">Descuento:</span>
              <span className="font-medium text-red-500">-${descuento.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-8 text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-[#1E3A8A]">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-[#A5B4FC]" onClick={() => navigate("/ventas")}>
          Cancelar
        </Button>
        <Button
          onClick={guardarVenta}
          className="bg-[#3B82F6] hover:bg-[#1E3A8A]"
          disabled={detalles.length === 0 || !clienteSeleccionado}
        >
          Guardar Venta
        </Button>
      </div>
    </div>
  );
}

export default SalesCreate;
