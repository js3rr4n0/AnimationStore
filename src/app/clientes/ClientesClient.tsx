"use client";

import { useState } from "react";
import { Search, ChevronDown, X, Plus } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function ClientesClient({ initialClients }: { initialClients: any[] }) {
  const [selectedClient, setSelectedClient] = useState<any>(null);

  return (
    <>
      <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>Clientes</h1>
          <p className={styles.subtitle}>Base de compradores e historial de compras</p>
        </div>
        <Link href="/clientes/nuevo" className="btn btn-primary" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Añadir cliente
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <Search size={16} color="var(--text-tertiary)" />
            <input type="text" placeholder="Buscar por nombre, teléfono o correo..." className={styles.searchInput} />
          </div>
          <div className={styles.filterSelect}>
            Todos <ChevronDown size={14} style={{ display: 'inline', marginLeft: '8px' }} />
          </div>
        </div>

        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Órdenes</th>
              <th>Total gastado</th>
            </tr>
          </thead>
          <tbody>
            {initialClients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No hay clientes registrados.
                </td>
              </tr>
            ) : (
              initialClients.map((client) => (
                <tr key={client.id} className={styles.clientRow} onClick={() => setSelectedClient(client)}>
                  <td>
                    <div className={styles.clientCell}>
                      <div className={styles.avatar}>{client.initials}</div>
                      <span className={styles.clientName}>{client.name}</span>
                    </div>
                  </td>
                  <td className={styles.correoText}>{client.email || '—'}</td>
                  <td>{client.phone}</td>
                  <td>
                    <span className={styles.ordenesBadge}>{client.ordersCount}</span>
                  </td>
                  <td className={styles.totalText}>${Number(client.totalSpent).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer Overlay */}
      {selectedClient && (
        <div className={styles.drawerOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedClient(null);
        }}>
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>{selectedClient.name}</div>
              <div className={styles.drawerSubtitle}>Cliente desde {selectedClient.memberSince}</div>
              <button className={styles.closeBtn} onClick={() => setSelectedClient(null)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statCardLabel}>Órdenes</div>
                  <div className={styles.statCardValue}>{selectedClient.ordersCount}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statCardLabel}>Total gastado</div>
                  <div className={styles.statCardValue}>${Number(selectedClient.totalSpent).toFixed(2)}</div>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <span>Teléfono: {selectedClient.phone}</span>
                {selectedClient.email && <span>Correo: {selectedClient.email}</span>}
                <span style={{ marginTop: '4px' }}>{selectedClient.address}</span>
              </div>

              <div>
                <div className={styles.historySectionTitle}>Historial de compras</div>
                <div className={styles.historyList}>
                  {!selectedClient.history || selectedClient.history.length === 0 ? (
                    <div style={{color: 'var(--text-secondary)', fontSize: '13px'}}>No hay compras recientes.</div>
                  ) : (
                    selectedClient.history.map((order: any, idx: number) => (
                      <div key={idx} className={styles.historyItem}>
                        <div>
                          <div className={styles.historyOrderId}>{order.numero}</div>
                          <div className={styles.historyOrderDate}>{new Date(order.creado_en).toLocaleDateString()}</div>
                        </div>
                        <div className={styles.historyOrderRight}>
                          <span className={`${styles.stateBadge} ${styles['state' + String(order.estado).replace(/_/g, '')]}`}>
                            {order.estado}
                          </span>
                          <span className={styles.historyOrderTotal}>${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
