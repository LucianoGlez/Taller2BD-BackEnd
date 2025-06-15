import pool from './database/db.js';

async function run() {
  await pool.query("USE vitokos_coffee");

  await pool.query(
    `INSERT INTO productos (nombre, stock, precio) VALUES
     (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
    ['Café Espresso', 50, 1200, 'Té Verde', 30, 900, 'Croissant', 20, 1500]
  );

  await pool.query(
    `INSERT INTO clientes (nombre, ciudad, tipo) VALUES
     (?, ?, ?), (?, ?, ?)`,
    ['María Pérez', 'Santiago', 'normal', 'Juan González', 'Valparaíso', 'premium']
  );

  console.log('✅ Datos de prueba insertados');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});