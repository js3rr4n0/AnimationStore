import { createPool } from "@vercel/postgres";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, '.env.local') });

async function test() {
  const pool = createPool();
  try {
    const res = await pool.sql`
      SELECT 
        p.id, p.nombre as name, p.sku, p.stock, 
        (CASE WHEN p.tiene_variaciones THEN 2 ELSE 1 END) as variants, 
        p.precio_venta as price, p.estado as state, 
        d.nombre as dept,
        p.imagen_url as img
      FROM productos p
      LEFT JOIN departamentos d ON p.departamento_id = d.id
      ORDER BY p.creado_en DESC
    `;
    console.log("Productos query success:", res.rowCount);
  } catch (err) {
    console.error("Productos query failed:", err.message);
  }

  try {
    const res2 = await pool.sql`
      SELECT id, nombre, correo, telefono, ordenes, total_gastado, creado_en, direccion
      FROM animation_store.vista_clientes
      ORDER BY creado_en DESC
    `;
    console.log("Clientes query success:", res2.rowCount);
  } catch (err) {
    console.error("Clientes query failed:", err.message);
  }

  try {
    const res3 = await pool.sql`
      SELECT 
        o.id as internal_id, o.numero as id, c.nombre as client, 
        o.estado as state, o.total, o.creado_en as date,
        o.envio_direccion, o.comentario
      FROM animation_store.ordenes o
      JOIN animation_store.clientes c ON o.cliente_id = c.id
      ORDER BY o.creado_en DESC
    `;
    console.log("Ordenes query success:", res3.rowCount);
  } catch (err) {
    console.error("Ordenes query failed:", err.message);
  }
}
test();
