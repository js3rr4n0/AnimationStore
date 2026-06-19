import Link from "next/link";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { sql } from "@vercel/postgres";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Productos() {
  const { rows: products } = await sql`
    SELECT 
      p.id, p.nombre as name, p.sku, p.stock, 
      (CASE WHEN p.tiene_variaciones THEN 2 ELSE 1 END) as variants, 
      p.precio_venta as price, p.estado as state, 
      d.nombre as dept,
      p.imagen_url as img,
      p.creado_en
    FROM animation_store.productos p
    LEFT JOIN animation_store.departamentos d ON p.departamento_id = d.id
    ORDER BY p.creado_en DESC
  `;

  const now = new Date();
  
  // Resumen de inventario (días desde creado_en)
  let new0_30 = 0;
  let new31_90 = 0;
  let new91_plus = 0;

  // Valor de inventario
  let totalValue = 0;
  const deptValues: Record<string, number> = {};

  // Pestañas (estados y stock)
  let countPublicados = 0;
  let countBorrador = 0;
  let countNoAprobados = 0;
  let countArchivados = 0;
  let countSinExistencias = 0;
  let countStockBajo = 0;

  for (const p of products) {
    const createdDate = new Date(p.creado_en);
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) new0_30++;
    else if (diffDays <= 90) new31_90++;
    else new91_plus++;

    const pValue = Number(p.price) * Number(p.stock);
    totalValue += pValue;
    
    const deptName = p.dept || 'Otros';
    deptValues[deptName] = (deptValues[deptName] || 0) + pValue;

    if (p.state === 'publicado') countPublicados++;
    if (p.state === 'borrador') countBorrador++;
    if (p.state === 'no_aprobado') countNoAprobados++;
    if (p.state === 'archivado') countArchivados++;

    if (p.stock === 0) countSinExistencias++;
    else if (p.stock <= 5) countStockBajo++;
  }

  // Ordenar departamentos por valor
  const sortedDepts = Object.entries(deptValues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // top 3

  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(2)}k`;
    return `$${val.toFixed(2)}`;
  };

  const totalAgeCount = products.length || 1; // Para evitar división por cero
  const pct0_30 = (new0_30 / totalAgeCount) * 100;
  const pct31_90 = (new31_90 / totalAgeCount) * 100;
  const pct91_plus = (new91_plus / totalAgeCount) * 100;

  const totalValCalc = totalValue || 1;

  return (
    <>
      <div className={styles.headerBanner}>
        <div>
          <h2 className={styles.bannerSectionTitle}>Resumen de inventario</h2>
          <div className={styles.inventoryStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>0-30 días</div>
              <div className={styles.statBar}><div className={styles.statBarFill} style={{width: `${pct0_30}%`, backgroundColor: '#818CF8'}}></div></div>
              <div className={styles.statSubtext}>{new0_30} {new0_30 === 1 ? 'nuevo stock' : 'nuevos stocks'}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>31-90 días</div>
              <div className={styles.statBar}><div className={styles.statBarFill} style={{width: `${pct31_90}%`, backgroundColor: '#4F46E5'}}></div></div>
              <div className={styles.statSubtext}>{new31_90} {new31_90 === 1 ? 'nuevo stock' : 'nuevos stocks'}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>91+ días</div>
              <div className={styles.statBar}><div className={styles.statBarFill} style={{width: `${pct91_plus}%`, backgroundColor: '#312E81'}}></div></div>
              <div className={styles.statSubtext}>{new91_plus} {new91_plus === 1 ? 'nuevo stock' : 'nuevos stocks'}</div>
            </div>
          </div>
        </div>

        <div className={styles.inventoryValue}>
          <h2 className={styles.bannerSectionTitle}>Valor de inventario ingresado</h2>
          <div className={styles.valueHeader}>
            <div className={styles.totalValue}>{formatCurrency(totalValue)}</div>
            <div className={styles.departmentValues}>
              {sortedDepts.map(([name, val], idx) => (
                <span key={idx}>{name} {formatCurrency(val)}</span>
              ))}
              {sortedDepts.length === 0 && <span>Sin inventario</span>}
            </div>
          </div>
          <div className={styles.valueBar}>
            {sortedDepts.map(([name, val], idx) => {
              const colors = ['#6366F1', '#3B82F6', '#06B6D4'];
              return (
                <div key={idx} className={styles.valueSegment} style={{width: `${(val / totalValCalc) * 100}%`, backgroundColor: colors[idx]}}></div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.active}`}>Todo <span className={styles.tabCount}>{products.length}</span></div>
          <div className={styles.tab}>Publicados <span className={styles.tabCount}>{countPublicados}</span></div>
          <div className={styles.tab}>Borrador <span className={styles.tabCount}>{countBorrador}</span></div>
          <div className={styles.tab}>No aprobados <span className={styles.tabCount}>{countNoAprobados}</span></div>
          <div className={styles.tab}>Sin existencias <span className={styles.tabCount}>{countSinExistencias}</span></div>
          <div className={styles.tab}>Stock bajo <span className={styles.tabCount}>{countStockBajo}</span></div>
          <div className={styles.tab}>Archivados <span className={styles.tabCount}>{countArchivados}</span></div>
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((prod) => (
                <tr key={prod.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className={styles.productCell}>
                      <img src={prod.img || "https://placehold.co/80x80/1E1B4B/FFFFFF?text=NA"} alt={prod.name} className={styles.productImage} />
                      <span className={styles.productName}>{prod.name}</span>
                    </div>
                  </td>
                  <td><span className={styles.skuText}>{prod.sku}</span></td>
                  <td>
                    <span className={styles.inventoryText}>
                      <span className={prod.stock === 0 ? styles.inventoryZero : ''}>{prod.stock}</span> en stock para {prod.variants} variante
                    </span>
                  </td>
                  <td style={{fontWeight: 500}}>${Number(prod.price).toFixed(2)}</td>
                  <td>
                    <span className={`${styles.stateBadge} ${styles['state' + String(prod.state).replace(/_/g, '')]}`}>
                      {prod.state}
                    </span>
                  </td>
                  <td style={{color: 'var(--text-secondary)'}}>{prod.dept || 'Sin dpto.'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            <span>Página 1 de 1</span>
          </div>
          <div className={styles.pageControls}>
            <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
            <button className={styles.pageBtn} disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
