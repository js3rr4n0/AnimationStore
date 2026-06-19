import { sql } from "@vercel/postgres";
import ClientesClient from "./ClientesClient";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const { rows: clientesData } = await sql`
    SELECT id, nombre, correo, telefono, ordenes, total_gastado, creado_en, direccion
    FROM animation_store.vista_clientes
    ORDER BY creado_en DESC
  `;

  const { rows: ordenesData } = await sql`
    SELECT id, numero, cliente_id, estado, total, creado_en
    FROM animation_store.ordenes
    ORDER BY creado_en DESC
  `;

  // Process data to match client props
  const formattedClients = clientesData.map(c => {
    // Get initials
    const nameParts = c.nombre.split(' ');
    const initials = nameParts.length > 1 
      ? nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    // Attach history
    const history = ordenesData.filter(o => o.cliente_id === c.id);

    return {
      id: c.id,
      name: c.nombre,
      initials,
      email: c.correo,
      phone: c.telefono,
      ordersCount: c.ordenes,
      totalSpent: c.total_gastado,
      memberSince: new Date(c.creado_en).toLocaleDateString(),
      address: c.direccion || "Sin dirección",
      history
    };
  });

  return <ClientesClient initialClients={formattedClients} />;
}
