"use client";

import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import styles from "./page.module.css";

const MOCK_CLIENTS = [
  { 
    id: "C001",
    name: "María Hernández",
    initials: "MA",
    email: "maria.hernandez@gmail.com",
    phone: "7777-8888",
    ordersCount: 2,
    totalSpent: 170.94,
    memberSince: "10 abr 2026",
    address: "Col. Escalón, Calle 1 #23, San Salvador, San Salvador",
    history: [
      { id: "ORD-001045", date: "18 jun 2026", state: "Pendiente", total: 101.97 },
      { id: "ORD-001042", date: "05 jun 2026", state: "Procesada", total: 68.97 }
    ]
  },
  { 
    id: "C002",
    name: "Carlos Ramírez",
    initials: "CA",
    email: "carlos.r@hotmail.com",
    phone: "7012-3456",
    ordersCount: 1,
    totalSpent: 39.99,
    memberSince: "15 may 2026",
    address: "Santa Tecla, Residencial Alpes, La Libertad",
    history: [
      { id: "ORD-001044", date: "16 jun 2026", state: "Procesada", total: 39.99 }
    ]
  },
  { 
    id: "C003",
    name: "Andrea Martínez",
    initials: "AN",
    email: "andrea.m@gmail.com",
    phone: "7890-1234",
    ordersCount: 1,
    totalSpent: 159.99,
    memberSince: "20 may 2026",
    address: "San Benito, Av. La Capilla, San Salvador",
    history: [
      { id: "ORD-001043", date: "14 jun 2026", state: "Procesada", total: 159.99 }
    ]
  },
  { 
    id: "C004",
    name: "José Alvarado",
    initials: "JO",
    email: "—",
    phone: "6123-4567",
    ordersCount: 1,
    totalSpent: 54.99,
    memberSince: "02 jun 2026",
    address: "Col. La Sultana, Pasaje 4, Santa Tecla, La Libertad",
    history: [
      { id: "ORD-001041", date: "03 jun 2026", state: "Cancelada", total: 54.99 }
    ]
  }
];

export default function Clientes() {
  const [selectedClient, setSelectedClient] = useState<any>(null);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Clientes</h1>
        <p className={styles.subtitle}>Base de compradores e historial de compras</p>
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
            {MOCK_CLIENTS.map((client) => (
              <tr key={client.id} className={styles.clientRow} onClick={() => setSelectedClient(client)}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.avatar}>{client.initials}</div>
                    <span className={styles.clientName}>{client.name}</span>
                  </div>
                </td>
                <td className={styles.correoText}>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <span className={styles.ordenesBadge}>{client.ordersCount}</span>
                </td>
                <td className={styles.totalText}>${client.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
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
                  <div className={styles.statCardValue}>${selectedClient.totalSpent.toFixed(2)}</div>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <span>Teléfono: {selectedClient.phone}</span>
                {selectedClient.email !== "—" && <span>Correo: {selectedClient.email}</span>}
                <span style={{ marginTop: '4px' }}>{selectedClient.address}</span>
              </div>

              <div>
                <div className={styles.historySectionTitle}>Historial de compras</div>
                <div className={styles.historyList}>
                  {selectedClient.history.map((order: any, idx: number) => (
                    <div key={idx} className={styles.historyItem}>
                      <div>
                        <div className={styles.historyOrderId}>{order.id}</div>
                        <div className={styles.historyOrderDate}>{order.date}</div>
                      </div>
                      <div className={styles.historyOrderRight}>
                        <span className={`${styles.stateBadge} ${styles['state' + order.state.replace(/\s+/g, '')]}`}>
                          {order.state}
                        </span>
                        <span className={styles.historyOrderTotal}>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
