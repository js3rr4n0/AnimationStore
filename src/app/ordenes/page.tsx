"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, MapPin, X, Download, History } from "lucide-react";
import styles from "./page.module.css";

const MOCK_ORDERS = [
  { id: "ORD-001045", client: "María Hernández", items: 3, total: 101.97, date: "18 jun 2026", state: "Pendiente", 
    details: {
      address: "Col. Escalón, Calle 1 #23\nSan Salvador, San Salvador\nRef: Frente a la panadería",
      instructions: "Entregar en horario de la tarde.",
      products: [
        { name: "Figura Escala 1/7 Guerrera Celestial", qty: 1, price: 89.99 },
        { name: "Llavero Acrílico Mascota Kawaii", qty: 2, price: 11.98 }
      ],
      history: { action: "Orden creada", date: "18 jun 2026", user: "admin" }
    }
  },
  { id: "ORD-001044", client: "Carlos Ramírez", items: 1, total: 39.99, date: "16 jun 2026", state: "Activa",
    details: {
      address: "Santa Tecla, Residencial Alpes\nLa Libertad\nRef: Casa verde portón negro",
      instructions: "Llamar al llegar.",
      products: [
        { name: "Gunpla RG Mecha Asalto", qty: 1, price: 39.99 }
      ],
      history: { action: "Pasó a Activa", date: "16 jun 2026", user: "admin" }
    }
  },
  { id: "ORD-001043", client: "Andrea Martínez", items: 1, total: 159.99, date: "14 jun 2026", state: "A entregar",
    details: {
      address: "San Benito, Av. La Capilla\nSan Salvador",
      instructions: "Dejar en recepción.",
      products: [
        { name: "Estatua Samurái Edición Premium", qty: 1, price: 159.99 }
      ],
      history: { action: "Lista para entrega", date: "15 jun 2026", user: "admin" }
    }
  },
  { id: "ORD-001042", client: "María Hernández", items: 3, total: 68.97, date: "05 jun 2026", state: "Procesada",
    details: {
      address: "Col. Escalón, Calle 1 #23\nSan Salvador, San Salvador",
      instructions: "Entregado a cliente.",
      products: [
        { name: "Figura Q Posket Princesa Estelar", qty: 3, price: 68.97 }
      ],
      history: { action: "Orden procesada", date: "06 jun 2026", user: "admin" }
    }
  }
];

const TABS = ["Pendientes", "Activas", "A entregar", "Procesadas", "Canceladas"];

export default function Ordenes() {
  const [activeTab, setActiveTab] = useState("Pendientes");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = MOCK_ORDERS.filter(o => 
    activeTab === "Pendientes" ? o.state === "Pendiente" : o.state === activeTab
  );

  return (
    <>
      <div className={styles.actionsRow}>
        <div className={styles.tabs}>
          {TABS.map(tab => {
            const count = tab === "Canceladas" ? 0 : 1; // mock counts matching screenshots
            return (
              <div 
                key={tab} 
                className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} <span className={styles.tabCount}>{count}</span>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
          <Plus size={16} /> Crear orden
        </button>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--text-tertiary)" />
          <input type="text" placeholder="Busca cualquier orden" className={styles.searchInput} />
        </div>
        <div className={styles.sortSelect}>
          <span style={{color: 'var(--text-secondary)'}}>↑↓</span> Más recientes <ChevronDown size={14} />
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No hay órdenes en este estado.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className={styles.orderRow} onClick={() => setSelectedOrder(order)}>
                  <td className={styles.orderId}>{order.id}</td>
                  <td>{order.client}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{order.items} artículo(s)</td>
                  <td className={styles.orderTotal}>${order.total.toFixed(2)}</td>
                  <td className={styles.orderDate}>{order.date}</td>
                  <td>
                    <span className={`${styles.stateBadge} ${styles['state' + order.state.replace(/\s+/g, '')]}`}>
                      {order.state}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer Overlay */}
      {selectedOrder && (
        <div className={styles.drawerOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedOrder(null);
        }}>
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>
                {selectedOrder.id}
                <span className={`${styles.stateBadge} ${styles['state' + selectedOrder.state.replace(/\s+/g, '')]}`}>
                  {selectedOrder.state}
                </span>
              </div>
              <div className={styles.drawerSubtitle}>Creada el {selectedOrder.date}</div>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado de la orden</label>
                <select className={styles.select} defaultValue={selectedOrder.state}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Activa">Activa</option>
                  <option value="A entregar">A entregar</option>
                  <option value="Procesada">Procesada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.infoTitle}>
                  <MapPin size={16} color="var(--text-secondary)" /> Cliente y envío
                </div>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{selectedOrder.client}</div>
                <div className={styles.infoText} style={{ whiteSpace: 'pre-line' }}>
                  {selectedOrder.details.address}
                </div>
                <div className={styles.instructionBox}>
                  {selectedOrder.details.instructions}
                </div>
              </div>

              <div>
                <div className={styles.label} style={{ marginBottom: '12px' }}>Productos</div>
                <div className={styles.productList}>
                  {selectedOrder.details.products.map((prod: any, idx: number) => (
                    <div key={idx} className={styles.productItem}>
                      <span className={styles.productItemName}>{prod.name}</span>
                      <div style={{ display: 'flex' }}>
                        <span className={styles.productItemQty}>x{prod.qty}</span>
                        <span className={styles.productItemPrice}>${prod.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Número de guía
                </label>
                <input type="text" className={styles.input} placeholder="Ej. GU-882019" />
              </div>

              <div className={styles.infoBox}>
                <div className={styles.infoTitle}>
                  <History size={16} color="var(--text-secondary)" /> Historial
                </div>
                <div className={styles.historyItem}>
                  <div className={styles.historyDot}></div>
                  <div>
                    <div className={styles.historyTitle}>{selectedOrder.details.history.action}</div>
                    <div className={styles.historyMeta}>
                      {selectedOrder.details.history.date} - {selectedOrder.details.history.user}
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                <Download size={16} /> Descargar comprobante
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
