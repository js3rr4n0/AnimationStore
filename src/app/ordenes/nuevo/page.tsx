import { createOrder } from "@/app/actions";
import { sql } from "@vercel/postgres";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NuevaOrden() {
  const { rows: clientes } = await sql`SELECT id, nombre, telefono, direccion FROM animation_store.clientes ORDER BY nombre ASC`;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/ordenes" style={{ color: 'var(--text-secondary)' }}>
          <ChevronLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Crear nueva orden manual</h1>
      </div>

      <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <form action={createOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Seleccionar Cliente *</label>
            {clientes.length === 0 ? (
              <div style={{ padding: '10px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '4px', fontSize: '14px' }}>
                No hay clientes registrados. <Link href="/clientes/nuevo" style={{textDecoration: 'underline'}}>Añade uno primero.</Link>
              </div>
            ) : (
              <select name="cliente_id" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <option value="">-- Selecciona un cliente --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.telefono})</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Monto total ($) *</label>
            <input type="number" step="0.01" name="total" required defaultValue="0.00" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Dirección de envío (opcional si ya la tiene)</label>
            <textarea name="envio_direccion" rows={3} placeholder="Dejar en blanco para usar la principal del cliente" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}></textarea>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={clientes.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Crear Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
