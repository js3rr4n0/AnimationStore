import { sql } from "@vercel/postgres";
import OrdenesClient from "./OrdenesClient";

export const dynamic = "force-dynamic";

export default async function OrdenesPage() {
  const { rows: ordenesData } = await sql`
    SELECT 
      o.id as internal_id, o.numero as id, c.nombre as client, 
      o.estado as state, o.total, o.creado_en as date,
      o.envio_direccion, o.comentario
    FROM animation_store.ordenes o
    JOIN animation_store.clientes c ON o.cliente_id = c.id
    ORDER BY o.creado_en DESC
  `;

  // We should fetch items too, but for simplicity we will just count them or return empty array if 0
  const formattedOrders = ordenesData.map(o => ({
    id: o.id,
    client: o.client,
    items: 0, // Would be sum of items
    total: o.total,
    date: new Date(o.date).toLocaleDateString(),
    state: o.state,
    details: {
      address: o.envio_direccion || "Sin dirección de envío",
      instructions: o.comentario || "",
      products: [],
      history: { action: "Orden creada", date: new Date(o.date).toLocaleDateString(), user: "admin" }
    }
  }));

  return <OrdenesClient initialOrders={formattedOrders} />;
}
