import pool from '../database/db.js';

export const registrarVenta = async (req, res) => {
  const { cliente_id, fecha, productos } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[cliente]] = await conn.query(
      'SELECT tipo FROM clientes WHERE id = ? AND activo = 1',
      [cliente_id]
    );
    if (!cliente) throw new Error('Cliente no válido o inactivo');

    const [pedidoResult] = await conn.query(
      'INSERT INTO pedidos (cliente_id, fecha) VALUES (?, ?)',
      [cliente_id, fecha]
    );
    const pedidoId = pedidoResult.insertId;

    let total = 0;
    for (const item of productos) {
      const [[producto]] = await conn.query(
        'SELECT precio, stock FROM productos WHERE id = ? AND activo = 1',
        [item.producto_id]
      );
      if (!producto) throw new Error(`Producto ${item.producto_id} no disponible`);
      if (producto.stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${item.producto_id}`);

      const subtotal = producto.precio * item.cantidad;
      total += subtotal;

      await conn.query(
        'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, item.producto_id, item.cantidad, producto.precio]
      );
      await conn.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    if (cliente.tipo === 'premium') total *= 0.8;
    total *= 1.1;

    await conn.query('UPDATE pedidos SET total = ? WHERE id = ?', [total.toFixed(2), pedidoId]);

    await conn.commit();
    res.status(201).json({ message: 'Pedido registrado', id: pedidoId, total: total.toFixed(2) });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};

export const pedidosPorClienteYFecha = async (req, res) => {
  const { clienteId } = req.params;
  const { fecha } = req.query;
  try {
    const [rows] = await pool.execute(
      `SELECT p.id AS pedido_id, p.fecha, p.total,
              dp.producto_id, pr.nombre, dp.cantidad, dp.precio_unitario
       FROM pedidos p
       JOIN detalle_pedido dp ON p.id = dp.pedido_id
       JOIN productos pr ON pr.id = dp.producto_id
       WHERE p.cliente_id = ? AND DATE(p.fecha) = ?`,
      [clienteId, fecha]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const productosVendidosAnio = async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id AS producto_id, p.nombre, SUM(dp.cantidad) AS total_vendidos
       FROM detalle_pedido dp
       JOIN productos p ON dp.producto_id = p.id
       JOIN pedidos pe ON pe.id = dp.pedido_id
       WHERE YEAR(pe.fecha) = YEAR(CURDATE())
       GROUP BY p.id, p.nombre`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
