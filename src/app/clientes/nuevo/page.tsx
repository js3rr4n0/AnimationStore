import { createClient } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import styles from "./page.module.css";

export default function NuevoCliente() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/clientes" style={{ color: 'var(--text-secondary)' }}>
          <ChevronLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Añadir nuevo cliente</h1>
      </div>

      <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <form action={createClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Nombre completo *</label>
            <input type="text" name="nombre" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Teléfono *</label>
            <input type="text" name="telefono" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Correo electrónico</label>
            <input type="email" name="correo" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Dirección de envío</label>
            <textarea name="direccion" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}></textarea>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Guardar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
