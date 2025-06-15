import { Router } from 'express';
import {
  crearProducto,
  eliminarProducto,
  actualizarPrecioProducto,
  listarProductosDisponibles,
  incrementarStockProducto,
  listarProductosVendidosSemana
} from '../controllers/producto.controller.js';

const productoRouter = Router();
productoRouter.post('/', crearProducto);
productoRouter.delete('/:id', eliminarProducto);
productoRouter.put('/precio/:id', actualizarPrecioProducto);
productoRouter.get('/', listarProductosDisponibles);
productoRouter.put('/stock/:id', incrementarStockProducto);
productoRouter.get('/vendidos/semana', listarProductosVendidosSemana);
export default productoRouter;