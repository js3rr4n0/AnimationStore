"use client";

import { Download, TrendingUp, PackageSearch, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import styles from "./page.module.css";

const salesData = [
  { name: 'San Salvador', value: 170 },
  { name: 'La Libertad', value: 40 },
  { name: 'Santa Ana', value: 160 },
];

const inactiveInventory = [
  { name: "Estatua Samurái Edición Premium", days: 105, units: 6 },
  { name: "Figura Articulada Figma Espadachín", days: 92, units: 2 },
  { name: "Set Coleccionista Archivado", days: 210, units: 1 },
];

const marginData = [
  { name: "Llavero Acrílico Mascota Kawaii", dept: "Juguetes", cost: 2.00, sale: 5.99, margin: 66.6 },
  { name: "Camiseta Oversize Edición Mecha", dept: "Hombres", cost: 10.00, sale: 24.99, margin: 60.0 },
  { name: "Mousepad XL Gaming Edición Anime", dept: "Computación", cost: 8.00, sale: 19.99, margin: 60.0 },
  { name: "Funko Pop Cazador de Sombras", dept: "Juguetes", cost: 7.00, sale: 14.99, margin: 53.3 },
  { name: "Figura Q Posket Princesa Estelar", dept: "Juguetes", cost: 11.00, sale: 22.99, margin: 52.2 },
  { name: "Nendoroid Heroína Mágica", dept: "Juguetes", cost: 24.00, sale: 44.50, margin: 46.1 },
  { name: "Figura Articulada Figma Espadachín", dept: "Juguetes", cost: 30.00, sale: 54.99, margin: 45.4 },
  { name: "Gunpla RG Mecha Asalto", dept: "Juguetes", cost: 22.00, sale: 39.99, margin: 45.0 },
  { name: "Figura Escala 1/7 Guerrera Celestial", dept: "Juguetes", cost: 52.00, sale: 89.99, margin: 42.2 },
  { name: "Figura Escala Coleccionista (Borrador)", dept: "Juguetes", cost: 70.00, sale: 119.99, margin: 41.7 },
  { name: "Estatua Samurái Edición Premium", dept: "Juguetes", cost: 95.00, sale: 159.99, margin: 40.6 },
  { name: "Set Coleccionista Archivado", dept: "Juguetes", cost: 45.00, sale: 74.99, margin: 40.0 },
];

export default function Reportes() {
  const getBadgeClass = (margin: number) => {
    if (margin > 60) return styles.margenBadge;
    if (margin > 50) return `${styles.margenBadge} ${styles.margenBadgeMedium}`;
    return `${styles.margenBadge} ${styles.margenBadgeLow}`;
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Reportes y analítica</h1>
          <p className={styles.subtitle}>Ventas, rotación de inventario y márgenes</p>
        </div>
        <button className={styles.exportBtn}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className={styles.topGrid}>
        {/* Ventas por departamento Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <TrendingUp size={18} color="var(--text-secondary)" /> Ventas por departamento
          </h2>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#6366F1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventario sin movimiento */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <PackageSearch size={18} color="var(--text-secondary)" /> Inventario sin movimiento (91+ días)
          </h2>
          <div className={styles.inventoryList}>
            {inactiveInventory.map((item, idx) => (
              <div key={idx} className={styles.inventoryItem}>
                <div>
                  <div className={styles.inventoryItemName}>{item.name}</div>
                  <div className={styles.inventoryItemDays}>{item.days} días en stock</div>
                </div>
                <div className={styles.inventoryItemBadge}>{item.units} uds.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Margen Table */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Percent size={18} color="var(--text-secondary)" /> % Margen de ganancia por producto
        </h2>
        <div className={styles.tableContainer}>
          <table className={styles.marginTable}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Departamento</th>
                <th>Costo</th>
                <th>Venta</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              {marginData.map((row, idx) => (
                <tr key={idx}>
                  <td className={styles.productCol}>{row.name}</td>
                  <td className={styles.deptCol}>{row.dept}</td>
                  <td>${row.cost.toFixed(2)}</td>
                  <td>${row.sale.toFixed(2)}</td>
                  <td>
                    <span className={getBadgeClass(row.margin)}>
                      {row.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
