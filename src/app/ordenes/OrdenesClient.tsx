"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, MapPin, X, Download, History } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const TABS = ["Pendientes", "Activas", "A entregar", "Procesadas", "Canceladas"];

export default function OrdenesClient({ initialOrders }: { initialOrders: any[] }) {
  const [activeTab, setActiveTab] = useState("Pendientes");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = initialOrders.filter(o => 
    activeTab === "Pendientes" ? o.state.toLowerCase() === "pendiente" : o.state.toLowerCase() === activeTab.toLowerCase().replace(' ', '_')
  );

  return (
    <>
      <div className={styles.actionsRow}>
        <div className={styles.tabs}>
          {TABS.map(tab => {
            const count = initialOrders.filter(o => {
               const tabKey = tab.toLowerCase().replace(' ', '_');
               return o.state.toLowerCase() === tabKey;
            }).length;

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
        <Link href="/ordenes/nuevo" className="btn btn-primary" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Crear orden
        </Link>
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
                  <td className={styles.orderTotal}>${Number(order.total).toFixed(2)}</td>
                  <td className={styles.orderDate}>{order.date}</td>
                  <td>
                    <span className={`${styles.stateBadge} ${styles['state' + String(order.state).replace(/_/g, '')]}`}>
                      {order.state.replace('_', ' ')}
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
                <span className={`${styles.stateBadge} ${styles['state' + String(selectedOrder.state).replace(/_/g, '')]}`}>
                  {selectedOrder.state.replace('_', ' ')}
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
                  <option value="pendiente">Pendiente</option>
                  <option value="activa">Activa</option>
                  <option value="a_entregar">A entregar</option>
                  <option value="procesada">Procesada</option>
                  <option value="cancelada">Cancelada</option>
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
                  {selectedOrder.details.instructions || "Sin instrucciones."}
                </div>
              </div>

              <div>
                <div className={styles.label} style={{ marginBottom: '12px' }}>Productos</div>
                <div className={styles.productList}>
                  {selectedOrder.details.products.length === 0 ? (
                    <div style={{color: 'var(--text-secondary)', fontSize: '13px'}}>No hay productos.</div>
                  ) : (
                    selectedOrder.details.products.map((prod: any, idx: number) => (
                      <div key={idx} className={styles.productItem}>
                        <span className={styles.productItemName}>{prod.name}</span>
                        <div style={{ display: 'flex' }}>
                          <span className={styles.productItemQty}>x{prod.qty}</span>
                          <span className={styles.productItemPrice}>${Number(prod.price).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>${Number(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Número de guía
                </label>
                <input type="text" className={styles.input} placeholder="Ej. GU-882019" />
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
