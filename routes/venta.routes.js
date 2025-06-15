import { Router } from 'express';
import {
  registrarVenta,
  pedidosPorClienteYFecha,
  productosVendidosAnio
} from '../controllers/venta.controller.js';

const ventaRouter = Router();
ventaRouter.post('/', registrarVenta);
ventaRouter.get('/cliente/:clienteId', pedidosPorClienteYFecha);
ventaRouter.get('/resumen/anual', productosVendidosAnio);
export default ventaRouter;