import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pool from './database/db.js';
import productoRouter from './routes/producto.routes.js';
import clienteRouter  from './routes/cliente.routes.js';
import ventaRouter    from './routes/venta.routes.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// **Permite TODAS las solicitudes de cualquier origen** (útil en desarrollo)
app.use(cors());

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rutas API
app.use('/api/productos', productoRouter);
app.use('/api/clientes',  clienteRouter);
app.use('/api/ventas',    ventaRouter);

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});

// Cierre limpio
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
import cors from 'cors';
app.use(cors()); 