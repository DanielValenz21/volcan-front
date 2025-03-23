// src/modules/Ventas/pages/SalesCreate.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash, Plus, Search as SearchIcon, AlertCircle } from "react-feather";
import axios from "axios";

// Ajusta estos imports a tus rutas de componentes
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

function SalesCreate() {
  const navigate = useNavigate();
  const { id } = useParams(); // si vienes de /ventas/editar/:id

  // Estados para info de clientes y productos
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]); // array de {IdProducto, NombreProducto, PrecioBase, Stock, ...}

  // Estados de la venta
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);

  // Para el modal de agregar productos
  const [dialogOpen, setDialogOpen] = useState(false);

  // Para buscar productos
  const [searchProducto, setSearchProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Mensajes de error y éxito
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filtrado de productos
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // 1) Cargar clientes y productos al montar
  useEffect(() => {
    // Cargar clientes
    axios
      .get("http://localhost:3001/api/clientes", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((resp) => setClientes(resp.data))
      .catch((err) => console.error(err));

    // Cargar productos (ya traen stock desde el back)
    axios
      .get("http://localhost:3001/api/productos", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((resp) => setProductos(resp.data))
      .catch((err) => console.error(err));
  }, []);

  // 2) Si hay un "id" => cargar la venta para editar
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3001/api/ventas/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((resp) => {
        const ventaData = resp.data.venta;
        const detallesData = resp.data.detalles;

        setClienteSeleccionado(ventaData.IdCliente.toString());
        setTipoCliente(""); // si quieres, haz un fetch extra para el tipo

        // Convertir detalles para la tabla
        const newDetalles = detallesData.map((d) => {
          const precioEfectivo = d.PrecioUnitario * (1 - d.PorcentajeDescuento / 100);
          const sub = precioEfectivo * d.Cantidad;
          return {
            idProducto: d.IdProducto,
            nombre: d.NombreProducto || "Producto",
            cantidad: parseFloat(d.Cantidad),
            precioUnitario: parseFloat(d.PrecioUnitario),
            porcentajeDescuento: parseFloat(d.PorcentajeDescuento),
            subtotal: sub,
          };
        });
        setDetalles(newDetalles);
        setDescuento(parseFloat(ventaData.Descuento));
      })
      .catch((error) => {
        console.error("Error al cargar venta:", error);
      });
  }, [id]);

  // 3) Filtrar productos cada vez que cambia "searchProducto"
  useEffect(() => {
    if (!searchProducto) {
      setProductosFiltrados(productos);
    } else {
      const filtered = productos.filter(
        (p) =>
          p.NombreProducto.toLowerCase().includes(searchProducto.toLowerCase()) ||
          p.IdProducto.toString().includes(searchProducto)
      );
      setProductosFiltrados(filtered);
    }
  }, [searchProducto, productos]);

  // 4) Cuando se selecciona un cliente, ver su TipoCliente (opcional)
  useEffect(() => {
    if (!clienteSeleccionado) {
      setTipoCliente("");
      return;
    }
    const cli = clientes.find((c) => c.IdCliente.toString() === clienteSeleccionado);
    if (cli) {
      setTipoCliente(cli.TipoCliente || "");
    }
  }, [clienteSeleccionado, clientes]);

  // 5) Recalcular Subtotal y Total
  useEffect(() => {
    const newSubtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal - descuento);
  }, [detalles, descuento]);

  // Función de precio base
  const getPrecioProducto = (prod) => {
    return prod.PrecioBase || 0; 
  };

  // 6) Agregar producto desde el modal
  const agregarProducto = () => {
    setErrorMessage("");

    if (!productoSeleccionado) {
      setErrorMessage("Primero selecciona un producto de la tabla.");
      return;
    }
    // Verificamos stock
    if (productoSeleccionado.Stock <= 0) {
      setErrorMessage("Este producto no tiene stock disponible.");
      return;
    }
    if (cantidad < 1) {
      setErrorMessage("La cantidad debe ser mayor a 0.");
      return;
    }
    if (cantidad > productoSeleccionado.Stock) {
      setErrorMessage(`No puedes vender más de ${productoSeleccionado.Stock} unidades (stock disponible).`);
      return;
    }

    const precioUnitario = getPrecioProducto(productoSeleccionado);

    // Revisamos si ya existe en la tabla
    const idx = detalles.findIndex((d) => d.idProducto === productoSeleccionado.IdProducto);

    if (idx >= 0) {
      // Actualizar
      const newDet = [...detalles];
      newDet[idx].cantidad += cantidad;
      // O si prefieres, limitas a stock
      if (newDet[idx].cantidad > productoSeleccionado.Stock) {
        newDet[idx].cantidad = productoSeleccionado.Stock;
      }
      const desc = newDet[idx].porcentajeDescuento || 0;
      const precioEf = precioUnitario * (1 - desc / 100);
      newDet[idx].subtotal = newDet[idx].cantidad * precioEf;
      setDetalles(newDet);
    } else {
      // Nuevo
      const desc = 0;
      const precioEf = precioUnitario * (1 - desc / 100);
      const subtotalLinea = cantidad * precioEf;

      const nuevoDetalle = {
        idProducto: productoSeleccionado.IdProducto,
        nombre: productoSeleccionado.NombreProducto,
        cantidad,
        precioUnitario,
        porcentajeDescuento: desc,
        subtotal: subtotalLinea,
      };
      setDetalles([...detalles, nuevoDetalle]);
    }

    // Limpieza y cerrar modal
    setProductoSeleccionado(null);
    setCantidad(1);
    setSearchProducto("");
    setDialogOpen(false);
  };

  // 7) Eliminar producto de la tabla principal
  const eliminarProducto = (index) => {
    const newDet = [...detalles];
    newDet.splice(index, 1);
    setDetalles(newDet);
  };

  // 8) Actualizar cantidad en la tabla (con los botones + y -)
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return; // No permitir 0 o negativo
    const newDet = [...detalles];
    newDet[index].cantidad = nuevaCantidad;
    // Podrías verificar stock real de ese producto, pero necesitas el Stock. 
    // En este demo, no lo hemos guardado en "detalles" 
    // Asumimos que si ya lo agregaron, se hace cargo en "agregarProducto"

    const desc = newDet[index].porcentajeDescuento || 0;
    const precioEf = newDet[index].precioUnitario * (1 - desc / 100);
    newDet[index].subtotal = precioEf * nuevaCantidad;
    setDetalles(newDet);
  };

  // 9) Guardar venta (POST) o Actualizar (PUT)
  const guardarVenta = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!clienteSeleccionado) {
      setErrorMessage("Selecciona un cliente.");
      return;
    }
    if (detalles.length === 0) {
      setErrorMessage("Agrega al menos un producto con stock.");
      return;
    }

    try {
      // userId real se saca del token
      const userId = 2;

      const detallesForApi = detalles.map((d) => ({
        IdProducto: d.idProducto,
        Cantidad: d.cantidad,
        PorcentajeDescuento: d.porcentajeDescuento || 0,
      }));

      const payload = {
        IdCliente: parseInt(clienteSeleccionado),
        CreadoPor: userId,
        Descuento: parseFloat(descuento),
        Detalles: detallesForApi,
      };

      if (id) {
        // Update
        await axios.put(`http://localhost:3001/api/ventas/${id}`, payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setSuccessMessage("Venta actualizada correctamente.");
      } else {
        // Create
        await axios.post("http://localhost:3001/api/ventas", payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setSuccessMessage("Venta creada correctamente.");
      }

      // Retornar a /ventas con un pequeño delay
      setTimeout(() => {
        navigate("/ventas");
      }, 1200);
    } catch (error) {
      console.error("Error al guardar venta:", error);
      setErrorMessage("Ocurrió un error guardando la venta.");
    }
  };

  // Ordenar productos: los que tienen stock > 0 primero, y luego stock = 0. 
  // Así, los "cero stock" quedan al final y se muestran con estilo tachado.
  const sortedProducts = [...productosFiltrados].sort((a, b) => b.Stock - a.Stock);

  return (
    <div className="space-y-6">
      {/* Mensajes de error / éxito */}
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
            {/* SECCIÓN CLIENTE */}
            <div>
              <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4">
                {id ? "Editar Venta" : "Nueva Venta"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select
                    value={clienteSeleccionado}
                    onValueChange={(val) => setClienteSeleccionado(val)}
                  >
                    <SelectTrigger className="h-10 px-3 py-2 rounded-md border border-[#A5B4FC] bg-[#F3F4F6]">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.IdCliente} value={c.IdCliente.toString()}>
                          {c.NombreCliente} ({c.TipoCliente})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {/* SECCIÓN PRODUCTOS */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1E3A8A]">
                  Productos de la Venta
                </h2>
                {/* Cambio en la estructura del Dialog */}
                <Button 
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="bg-[#3B82F6] hover:bg-[#1E3A8A] relative z-50 inline-flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent className="z-50">
                    <DialogHeader>
                      <DialogTitle>Agregar Producto</DialogTitle>
                      <DialogDescription>
                        Selecciona un producto de la lista. 
                        Los que tengan stock = 0 aparecen tachados al final.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      {/* Buscador */}
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar producto..."
                          value={searchProducto}
                          onChange={(e) => setSearchProducto(e.target.value)}
                          className="pl-10 border-[#A5B4FC]"
                        />
                      </div>

                      {/* Tabla de productos, sorted: stock>0 arriba, stock=0 abajo */}
                      <div className="max-h-60 overflow-y-auto border rounded-md">
                        <Table>
                          <TableHeader className="bg-[#F3F4F6] sticky top-0">
                            <TableRow>
                              <TableHead className="text-[#111827] w-[80px]">ID</TableHead>
                              <TableHead className="text-[#111827]">Nombre</TableHead>
                              <TableHead className="text-[#111827] text-right">Stock</TableHead>
                              <TableHead className="text-[#111827] text-right">Precio</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedProducts.length > 0 ? (
                              sortedProducts.map((prod) => {
                                const isNoStock = prod.Stock <= 0;
                                return (
                                  <TableRow
                                    key={prod.IdProducto}
                                    // "Deshabilitamos" la selección si stock=0
                                    onClick={() => {
                                      if (!isNoStock) {
                                        setProductoSeleccionado(prod);
                                        setCantidad(1);
                                      }
                                    }}
                                    className={`cursor-pointer hover:bg-[#F3F4F6] ${
                                      productoSeleccionado?.IdProducto === prod.IdProducto
                                        ? "bg-[#A5B4FC]/20"
                                        : ""
                                    }`}
                                  >
                                    <TableCell
                                      style={{
                                        textDecoration: isNoStock ? "line-through" : "none",
                                        color: isNoStock ? "#999" : "inherit",
                                      }}
                                    >
                                      {prod.IdProducto}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        textDecoration: isNoStock ? "line-through" : "none",
                                        color: isNoStock ? "#999" : "inherit",
                                      }}
                                    >
                                      {prod.NombreProducto}
                                    </TableCell>
                                    <TableCell
                                      className="text-right"
                                      style={{
                                        textDecoration: isNoStock ? "line-through" : "none",
                                        color: isNoStock ? "#999" : "inherit",
                                      }}
                                    >
                                      {prod.Stock}
                                    </TableCell>
                                    <TableCell
                                      className="text-right"
                                      style={{
                                        textDecoration: isNoStock ? "line-through" : "none",
                                        color: isNoStock ? "#999" : "inherit",
                                      }}
                                    >
                                      ${getPrecioProducto(prod).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                  No hay productos.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Input de Cantidad si ya se seleccionó un producto con stock */}
                      {productoSeleccionado && productoSeleccionado.Stock > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="cantidad">Cantidad</Label>
                          <Input
                            id="cantidad"
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={(e) =>
                              setCantidad(Number.parseInt(e.target.value) || 1)
                            }
                            className="border-[#A5B4FC]"
                          />
                          <p className="text-sm text-gray-500">
                            Stock disponible: {productoSeleccionado.Stock}
                          </p>
                        </div>
                      )}

                      {/* Error dentro del modal si corresponde */}
                      {errorMessage && (
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={agregarProducto}
                        className="bg-[#3B82F6] hover:bg-[#1E3A8A]"
                        // Solo habilitado si hay productoSeleccionado con stock
                        disabled={
                          !productoSeleccionado || (productoSeleccionado && productoSeleccionado.Stock <= 0)
                        }
                      >
                        Agregar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* TABLA PRINCIPAL (Productos de la Venta) */}
              <div className="rounded-md border border-[#A5B4FC] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F3F4F6]">
                    <TableRow>
                      <TableHead className="text-[#111827] w-[80px]">ID</TableHead>
                      <TableHead className="text-[#111827]">Producto</TableHead>
                      <TableHead className="text-[#111827] text-right">Precio</TableHead>
                      <TableHead className="text-[#111827] text-right">Cantidad</TableHead>
                      <TableHead className="text-[#111827] text-right">Subtotal</TableHead>
                      <TableHead className="text-[#111827] w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.length > 0 ? (
                      detalles.map((d, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{d.idProducto}</TableCell>
                          <TableCell>{d.nombre}</TableCell>
                          <TableCell className="text-right">
                            ${d.precioUnitario.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              {/* Botón "-" */}
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => actualizarCantidad(idx, d.cantidad - 1)}
                              >
                                -
                              </Button>
                              {/* Cantidad actual */}
                              <div className="h-8 px-3 flex items-center justify-center border-y border-input">
                                {d.cantidad}
                              </div>
                              {/* Botón "+" */}
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => actualizarCantidad(idx, d.cantidad + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${d.subtotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarProducto(idx)}
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

        {/* Footer con descuento y totales */}
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

      {/* Botones finales */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-[#A5B4FC]" onClick={() => navigate("/ventas")}>
          Cancelar
        </Button>
        <Button
          onClick={guardarVenta}
          className="bg-[#3B82F6] hover:bg-[#1E3A8A]"
          disabled={detalles.length === 0 || !clienteSeleccionado}
        >
          {id ? "Actualizar Venta" : "Guardar Venta"}
        </Button>
      </div>
    </div>
  );
}

export default SalesCreate;
