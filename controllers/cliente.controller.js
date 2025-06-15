import connection from '../database/db.js';

export const crearCliente = async (req, res) => {
  const { nombre, ciudad, tipo } = req.body;
  try {
    const [result] = await connection.execute(
      'INSERT INTO clientes (nombre, ciudad, tipo, activo) VALUES (?, ?, ?, 1)',
      [nombre, ciudad, tipo]
    );
    res.status(201).json({ message: 'Cliente registrado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    await connection.execute('UPDATE clientes SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cliente desactivado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarEstadoCliente = async (req, res) => {
  const { tipo } = req.body;
  try {
    await connection.execute('UPDATE clientes SET tipo = ? WHERE id = ?', [tipo, req.params.id]);
    res.json({ message: 'Estado del cliente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarClientesNormales = async (_req, res) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM clientes WHERE tipo = 'normal' AND activo = 1");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarClientesPremium = async (_req, res) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM clientes WHERE tipo = 'premium' AND activo = 1");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarTodosClientes = async (_req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM clientes WHERE activo = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};