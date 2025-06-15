import { Router } from 'express';
import {
  crearCliente,
  eliminarCliente,
  actualizarEstadoCliente,
  listarClientesNormales,
  listarClientesPremium,
  listarTodosClientes
} from '../controllers/cliente.controller.js';

const clienteRouter = Router();
clienteRouter.post('/', crearCliente);
clienteRouter.delete('/:id', eliminarCliente);
clienteRouter.put('/estado/:id', actualizarEstadoCliente);
clienteRouter.get('/normales', listarClientesNormales);
clienteRouter.get('/premium', listarClientesPremium);
clienteRouter.get('/', listarTodosClientes);
export default clienteRouter;