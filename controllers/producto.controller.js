import pool from '../database/db.js';

/**
 * Controlador de Clientes para Vitoko's Coffee
 */

/**
 * Registrar un nuevo cliente
 * POST /api/clientes
 */
export const crearCliente = async (req, res) => {
  const { nombre, ciudad, tipo } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO clientes (nombre, ciudad, tipo, activo) VALUES (?, ?, ?, 1)',
      [nombre, ciudad, tipo]
    );
    res.status(201).json({ message: 'Cliente creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Desactivar (eliminar) un cliente
 * DELETE /api/clientes/:id
 */
export const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute(
      'UPDATE clientes SET activo = 0 WHERE id = ?',
      [id]
    );
    res.json({ message: 'Cliente desactivado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar estado/tipo de cliente (normal <-> premium)
 * PUT /api/clientes/estado/:id
 */
export const actualizarEstadoCliente = async (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;
  try {
    await pool.execute(
      'UPDATE clientes SET tipo = ? WHERE id = ?',
      [tipo, id]
    );
    res.json({ message: 'Estado de cliente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar todos los clientes activos
 * GET /api/clientes
 */
export const listarClientes = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nombre, ciudad, tipo FROM clientes WHERE activo = 1'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar solo clientes normales
 * GET /api/clientes/normales
 */
export const listarClientesNormales = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nombre, ciudad FROM clientes WHERE activo = 1 AND tipo = \'normal\''
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar solo clientes premium
 * GET /api/clientes/premium
 */
export const listarClientesPremium = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nombre, ciudad FROM clientes WHERE activo = 1 AND tipo = \'premium\''
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
