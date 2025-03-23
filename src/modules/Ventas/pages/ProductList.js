import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/Table";
import { Card, CardContent } from "../../../shared/components/Card";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/productos", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((resp) => {
        setProducts(resp.data);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.Nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-[#A5B4FC] shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-[#A5B4FC] focus:border-[#3B82F6]"
            />
          </div>
          <Button
            className="bg-[#3B82F6] text-white hover:bg-blue-600"
            onClick={() => {/* Aquí iría la lógica para agregar nuevo producto */}}
          >
            Agregar Producto
          </Button>
        </div>

        <div className="rounded-md border border-[#A5B4FC]">
          <Table>
            <TableHeader className="bg-[#F3F4F6]">
              <TableRow>
                <TableHead className="text-[#111827] font-semibold">ID</TableHead>
                <TableHead className="text-[#111827] font-semibold">Nombre</TableHead>
                <TableHead className="text-[#111827] font-semibold">Descripción</TableHead>
                <TableHead className="text-[#111827] font-semibold text-right">Precio</TableHead>
                <TableHead className="text-[#111827] font-semibold text-right">Stock</TableHead>
                <TableHead className="text-[#111827] font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.IdProducto}>
                  <TableCell>{product.IdProducto}</TableCell>
                  <TableCell>{product.Nombre}</TableCell>
                  <TableCell>{product.Descripcion}</TableCell>
                  <TableCell className="text-right">${product.Precio?.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.Stock}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost">
                        <img src="/editar.png" alt="Editar" className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost">
                        <img src="/eliminar.png" alt="Eliminar" className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductList;
