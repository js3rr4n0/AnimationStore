"use client";

import Link from "next/link";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./page.module.css";

const products = [
  { id: 1, name: "Figura Escala Coleccionista (Borrador)", sku: "S-FIG-739281845", stock: 0, variants: 1, price: 119.99, state: "Borrador", dept: "Juguetes", img: "https://placehold.co/80x80/1E1B4B/FFFFFF?text=F" },
  { id: 2, name: "Gunpla RG Mecha Asalto", sku: "S-GUN-902384756", stock: 27, variants: 1, price: 39.99, state: "Publicado", dept: "Juguetes", img: "https://placehold.co/80x80/4F46E5/FFFFFF?text=G" },
  { id: 3, name: "Funko Pop Cazador de Sombras", sku: "S-FUN-338945112", stock: 0, variants: 1, price: 14.99, state: "Sin existencias", dept: "Juguetes", img: "https://placehold.co/80x80/10B981/FFFFFF?text=F" },
  { id: 4, name: "Llavero Acrílico Mascota Kawaii", sku: "S-LLA-228194730", stock: 120, variants: 1, price: 5.99, state: "Publicado", dept: "Juguetes", img: "https://placehold.co/80x80/F59E0B/FFFFFF?text=L" },
  { id: 5, name: "Figura Escala 1/7 Guerrera Celestial", sku: "S-FIG-204819372", stock: 14, variants: 1, price: 89.99, state: "Publicado", dept: "Juguetes", img: "https://placehold.co/80x80/EF4444/FFFFFF?text=F" },
  { id: 6, name: "Mousepad XL Gaming Edición Anime", sku: "S-MOU-674839201", stock: 41, variants: 1, price: 19.99, state: "Publicado", dept: "Computación", img: "https://placehold.co/80x80/6366F1/FFFFFF?text=M" },
];

export default function Productos() {
  return (
    <>
      <div className={styles.headerBanner}>
        <div>
          <h2 className={styles.bannerSectionTitle}>Resumen de inventario</h2>
          <div className={styles.inventoryStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>0-30 días</div>
              <div className={styles.statBar}><div className={styles.statBarFill} style={{width: '80%', backgroundColor: '#818CF8'}}></div></div>
              <div className={styles.statSubtext}>202 nuevo stocks</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>31-90 días</div>
              <div className={styles.statBar}><div className={styles.statBarFill} style={{width: '15%', backgroundColor: '#4F46E5'}}></div></div>
              <div className={styles.statSubtext}>30 nuevo stocks</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>91+ días</div>
              <div className={styles.statBar}><div className={styles.statBarFill} style={{width: '5%', backgroundColor: '#312E81'}}></div></div>
              <div className={styles.statSubtext}>9 nuevo stocks</div>
            </div>
          </div>
        </div>

        <div className={styles.inventoryValue}>
          <h2 className={styles.bannerSectionTitle}>Valor de inventario ingresado</h2>
          <div className={styles.valueHeader}>
            <div className={styles.totalValue}>$2.92k</div>
            <div className={styles.departmentValues}>
              <span>Juguetes $2.41k</span>
              <span>Computación $328.00</span>
              <span>Hombres $180.00</span>
            </div>
          </div>
          <div className={styles.valueBar}>
            <div className={styles.valueSegment} style={{width: '80%', backgroundColor: '#6366F1'}}></div>
            <div className={styles.valueSegment} style={{width: '15%', backgroundColor: '#3B82F6'}}></div>
            <div className={styles.valueSegment} style={{width: '5%', backgroundColor: '#06B6D4'}}></div>
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.active}`}>Todo <span className={styles.tabCount}>12</span></div>
          <div className={styles.tab}>Publicados <span className={styles.tabCount}>6</span></div>
          <div className={styles.tab}>Borrador <span className={styles.tabCount}>1</span></div>
          <div className={styles.tab}>No aprobados <span className={styles.tabCount}>1</span></div>
          <div className={styles.tab}>Sin existencias <span className={styles.tabCount}>1</span></div>
          <div className={styles.tab}>Stock bajo <span className={styles.tabCount}>2</span></div>
          <div className={styles.tab}>Archivados <span className={styles.tabCount}>1</span></div>
        </div>
        <Link href="/productos/nuevo" className="btn btn-primary" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
          <Plus size={16} /> Añadir producto
        </Link>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--text-tertiary)" />
          <input type="text" placeholder="Busca cualquier producto" className={styles.searchInput} />
        </div>
        <div className={styles.sortSelect}>
          <span style={{color: 'var(--text-secondary)'}}>↑↓</span> Más recientes <ChevronDown size={14} />
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th style={{width: '40px'}}><input type="checkbox" /></th>
              <th>Producto</th>
              <th>SKU</th>
              <th>Inventario</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className={styles.productCell}>
                    <img src={prod.img} alt={prod.name} className={styles.productImage} />
                    <span className={styles.productName}>{prod.name}</span>
                  </div>
                </td>
                <td><span className={styles.skuText}>{prod.sku}</span></td>
                <td>
                  <span className={styles.inventoryText}>
                    <span className={prod.stock === 0 ? styles.inventoryZero : ''}>{prod.stock}</span> en stock para {prod.variants} variante
                  </span>
                </td>
                <td style={{fontWeight: 500}}>${prod.price}</td>
                <td>
                  <span className={`${styles.stateBadge} ${styles['state' + prod.state.replace(/\s+/g, '')]}`}>
                    {prod.state}
                  </span>
                </td>
                <td style={{color: 'var(--text-secondary)'}}>{prod.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            <span>Página 1 de 2</span>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              Ir a: <input type="text" defaultValue="1" className={styles.pageInput} />
            </div>
          </div>
          <div className={styles.pageControls}>
            <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
            <button className={styles.pageBtn}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
