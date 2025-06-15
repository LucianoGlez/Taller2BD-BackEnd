import connection from '../database/db.js';

export const crearProducto = async (req, res) => {
  const { nombre, stock, precio } = req.body;
  try {
    const [result] = await connection.execute(
      'INSERT INTO productos (nombre, stock, precio, activo) VALUES (?, ?, ?, 1)',
      [nombre, stock, precio]
    );
    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    await connection.execute('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto deshabilitado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarPrecioProducto = async (req, res) => {
  const { precio } = req.body;
  try {
    await connection.execute('UPDATE productos SET precio = ? WHERE id = ?', [precio, req.params.id]);
    res.json({ message: 'Precio actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarProductosDisponibles = async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM productos WHERE activo = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementarStockProducto = async (req, res) => {
  const { cantidad } = req.body;
  try {
    await connection.execute('UPDATE productos SET stock = stock + ? WHERE id = ?', [cantidad, req.params.id]);
    res.json({ message: 'Stock incrementado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarProductosVendidosSemana = async (req, res) => {
  try {
    const [rows] = await connection.execute(`
      SELECT p.id, p.nombre, SUM(dp.cantidad) AS total_vendidos
      FROM detalle_pedido dp
      JOIN productos p ON dp.producto_id = p.id
      JOIN pedidos pe ON pe.id = dp.pedido_id
      WHERE YEARWEEK(pe.fecha, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY p.id, p.nombre
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};