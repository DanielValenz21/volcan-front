// src/modules/Ventas/pages/SalesCreate.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash, Plus, Search as SearchIcon, AlertCircle } from "react-feather";
import axios from "axios";

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
  const { id } = useParams(); // si venimos de "/ventas/editar/:id", es edición

  // ESTADOS para la info de clientes y productos
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  // ESTADOS para la venta
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);

  // Para buscar productos en el modal
  const [searchProducto, setSearchProducto] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  // Mensajes de error/exito
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // CARGAR CLIENTES Y PRODUCTOS
  useEffect(() => {
    // 1) Cargar clientes
    axios
      .get("http://localhost:3001/api/clientes", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((resp) => {
        setClientes(resp.data);
      })
      .catch((err) => console.error(err));

    // 2) Cargar productos
    axios
      .get("http://localhost:3001/api/productos", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((resp) => {
        setProductos(resp.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // MODO EDICIÓN: si "id" existe, cargamos la venta
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/api/ventas/${id}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((resp) => {
          // resp.data: { venta, detalles }
          const ventaData = resp.data.venta;
          const detallesData = resp.data.detalles;

          setClienteSeleccionado(ventaData.IdCliente.toString());
          // No tenemos el TipoCliente de una sola, si quieres, podrías hacer otra llamada
          // a /api/clientes/<IdCliente> para saber su tipo. De momento, lo dejamos en ""
          setTipoCliente("");

          // Ajustar "detalles" para la tabla
          const newDetalles = detallesData.map((d) => {
            // Calcula subtotal
            const precioEfectivo = d.PrecioUnitario * (1 - d.PorcentajeDescuento / 100);
            const sub = precioEfectivo * d.Cantidad;
            return {
              idProducto: d.IdProducto, // usaremos "idProducto" como en create
              nombre: d.NombreProducto || "Producto",
              cantidad: parseFloat(d.Cantidad),
              precioUnitario: parseFloat(d.PrecioUnitario),
              porcentajeDescuento: parseFloat(d.PorcentajeDescuento),
              subtotal: sub,
            };
          });

          setDetalles(newDetalles);
          setDescuento(parseFloat(ventaData.Descuento));
          // Se recalculará en un useEffect posterior
        })
        .catch((error) => {
          console.error("Error al cargar venta:", error);
        });
    }
  }, [id]);

  // FILTRO de productos
  useEffect(() => {
    if (!searchProducto) {
      setProductosFiltrados(productos);
    } else {
      const filtered = productos.filter(
        (p) =>
          p.NombreProducto.toLowerCase().includes(searchProducto.toLowerCase()) ||
          p.IdProducto.toString().includes(searchProducto.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  }, [searchProducto, productos]);

  // Cuando se selecciona un cliente
  useEffect(() => {
    if (clienteSeleccionado) {
      // Busca el objeto del cliente
      const c = clientes.find(
        (cl) => cl.IdCliente.toString() === clienteSeleccionado
      );
      if (c) {
        setTipoCliente(c.TipoCliente || "");
      }
    } else {
      setTipoCliente("");
    }
  }, [clienteSeleccionado, clientes]);

  // RECALCULAR SUBTOTAL Y TOTAL
  useEffect(() => {
    const newSubtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal - descuento);
  }, [detalles, descuento]);

  // OBTENER PRECIO (sólo para mostrar en la tabla de selección, si quisieras)
  // Para simplificar, devolvemos p.PrecioBase
  const getPrecioProducto = (prod) => {
    // Podrías hacer la lógica de "precio especial" si la tuvieras
    return prod.PrecioBase;
  };

  // AGREGAR PRODUCTO
  const agregarProducto = () => {
    if (!productoSeleccionado) {
      setErrorMessage("Debe seleccionar un producto");
      return;
    }
    if (cantidad <= 0) {
      setErrorMessage("La cantidad debe ser mayor a 0");
      return;
    }

    // Revisar si ya existe en la tabla
    const idx = detalles.findIndex((d) => d.idProducto === productoSeleccionado.IdProducto);
    const precioUnitario = getPrecioProducto(productoSeleccionado);

    if (idx >= 0) {
      // Actualizar
      const newDet = [...detalles];
      newDet[idx].cantidad += cantidad;
      newDet[idx].subtotal =
        newDet[idx].cantidad *
        (newDet[idx].precioUnitario * (1 - (newDet[idx].porcentajeDescuento || 0) / 100));
      setDetalles(newDet);
    } else {
      // Nuevo
      const subtotalLinea = cantidad * precioUnitario;
      const nuevoDetalle = {
        idProducto: productoSeleccionado.IdProducto,
        nombre: productoSeleccionado.NombreProducto,
        cantidad,
        precioUnitario,
        porcentajeDescuento: 0, // si no usas descuento por línea
        subtotal: subtotalLinea,
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

  // ELIMINAR PRODUCTO
  const eliminarProducto = (index) => {
    const newDet = [...detalles];
    newDet.splice(index, 1);
    setDetalles(newDet);
  };

  // ACTUALIZAR CANTIDAD
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    const newDet = [...detalles];
    newDet[index].cantidad = nuevaCantidad;
    // Recalcular subtotal
    const descLinea = newDet[index].porcentajeDescuento || 0;
    const precioEfectivo = newDet[index].precioUnitario * (1 - descLinea / 100);
    newDet[index].subtotal = precioEfectivo * nuevaCantidad;
    setDetalles(newDet);
    setErrorMessage("");
  };

  // GUARDAR/ACTUALIZAR VENTA
  const guardarVenta = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!clienteSeleccionado) {
      setErrorMessage("Debe seleccionar un cliente");
      return;
    }
    if (detalles.length === 0) {
      setErrorMessage("Debe agregar al menos un producto");
      return;
    }

    try {
      // Suponiendo un userId = 2 o lo que tengas en tu token
      // Podrías parsear tu token, pero lo haré simple
      const userId = 2;

      // Armar Detalles en el formato que el back espera
      // (IdProducto, Cantidad, PorcentajeDescuento)
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
        // Modo edición: PUT /api/ventas/:id (sólo si la venta está Pendiente)
        const response = await axios.put(
          `http://localhost:3001/api/ventas/${id}`,
          payload,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log("Venta actualizada", response.data);
        setSuccessMessage("Venta actualizada exitosamente");
      } else {
        // Modo creación: POST /api/ventas
        const response = await axios.post("http://localhost:3001/api/ventas", payload, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        console.log("Venta creada", response.data);
        setSuccessMessage("Venta guardada exitosamente");
      }

      // Regresar a /ventas tras un breve delay
      setTimeout(() => {
        navigate("/ventas");
      }, 1200);
    } catch (error) {
      console.error("Error al crear/actualizar venta:", error);
      setErrorMessage("Ocurrió un error al guardar la venta");
    }
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
                    <Select
                      value={clienteSeleccionado}
                      onValueChange={(val) => setClienteSeleccionado(val)}
                    >
                      <SelectTrigger
                        id="cliente"
                        className="h-10 px-3 py-2 rounded-md border border-[#A5B4FC] bg-[#F3F4F6]"
                      >
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
                <div className="flex gap-2">
                  {/* Nuevo botón "agregar productoi" */}
                  <Button
                    onClick={() => setShowProductList(!showProductList)}
                    className="bg-[#3B82F6] hover:bg-[#1E3A8A]"
                  >
                    agregar productoi
                  </Button>
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
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((prod) => (
                                  <TableRow
                                    key={prod.IdProducto}
                                    className={`cursor-pointer hover:bg-[#F3F4F6] ${
                                      productoSeleccionado?.IdProducto === prod.IdProducto
                                        ? "bg-[#A5B4FC]/20"
                                        : ""
                                    }`}
                                    onClick={() => setProductoSeleccionado(prod)}
                                  >
                                    <TableCell>{prod.IdProducto}</TableCell>
                                    <TableCell>{prod.NombreProducto}</TableCell>
                                    <TableCell className="text-right">
                                      ${getPrecioProducto(prod).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="h-24 text-center">
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
                              onChange={(e) =>
                                setCantidad(Number.parseInt(e.target.value) || 1)
                              }
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

              {/* Nuevo listado inline de productos para agregar a la venta */}
              {showProductList && (
                <div className="mt-4">
                  <div className="max-h-60 overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader className="bg-[#F3F4F6] sticky top-0">
                        <TableRow>
                          <TableHead className="text-[#111827] w-[100px]">ID</TableHead>
                          <TableHead className="text-[#111827]">Nombre</TableHead>
                          <TableHead className="text-[#111827] text-right">Precio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productos.length > 0 ? (
                          productos.map((prod) => (
                            <TableRow
                              key={prod.IdProducto}
                              className="cursor-pointer hover:bg-[#F3F4F6]"
                              onClick={() => {
                                setProductoSeleccionado(prod);
                                setShowProductList(false);
                              }}
                            >
                              <TableCell>{prod.IdProducto}</TableCell>
                              <TableCell>{prod.NombreProducto || prod.Nombre}</TableCell>
                              <TableCell className="text-right">
                                ${getPrecioProducto(prod).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                              No se encontraron productos.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

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
          {id ? "Actualizar Venta" : "Guardar Venta"}
        </Button>
      </div>
    </div>
  );
}

export default SalesCreate;
