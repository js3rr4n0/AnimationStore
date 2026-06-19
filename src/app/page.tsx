"use client";

import { FileText, TrendingUp, TrendingDown, Package, ShoppingCart, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from "./page.module.css";

const chartData = [
  { name: '1', value: 340 },
  { name: '6', value: 420 },
  { name: '11', value: 300 },
  { name: '16', value: 420 },
  { name: '21', value: 650 },
  { name: '26', value: 580 },
  { name: '30', value: 450 },
];

const topProducts = [
  { id: 1, name: "Figura Q Posket Princesa Estelar", units: 3, revenue: 68.97 },
  { id: 2, name: "Llavero Acrílico Mascota Kawaii", units: 2, revenue: 11.98 },
  { id: 3, name: "Figura Escala 1/7 Guerrera Celestial", units: 1, revenue: 89.99 },
  { id: 4, name: "Gunpla RG Mecha Asalto", units: 1, revenue: 39.99 },
  { id: 5, name: "Estatua Samurái Edición Premium", units: 1, revenue: 159.99 },
];

export default function Home() {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.welcomeTitle}>Bienvenido a tu dashboard, JULIO CESAR</h1>
        <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FileText size={16} /> Generar reporte
        </button>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            $370.92
            <span className={`${styles.metricChange} ${styles.positive}`}>
              <TrendingUp size={14} /> 12.4%
            </span>
          </div>
          <div className={styles.metricLabel}>Total generado en el mes</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            5
            <span className={`${styles.metricChange} ${styles.positive}`}>
              <TrendingUp size={14} /> 8.1%
            </span>
          </div>
          <div className={styles.metricLabel}>Total de órdenes registradas</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            $74.18
            <span className={`${styles.metricChange} ${styles.negative}`}>
              <TrendingDown size={14} /> 2.3%
            </span>
          </div>
          <div className={styles.metricLabel}>Promedio de compras</div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.sectionTitle}>Ventas de los últimos 30 días</h2>
          <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [`$${value}`, 'Ventas']}
                />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.alertsCard}>
          <h2 className={styles.sectionTitle}>Panel de alertas</h2>
          <div className={styles.alertsList}>
            <div className={styles.alertItem}>
              <div className={styles.alertItemLeft}>
                <div className={`${styles.alertIcon} ${styles.alertIconWarning}`}>
                  <Package size={16} />
                </div>
                Productos en stock bajo
              </div>
              <div className={styles.alertCount}>3</div>
            </div>
            
            <div className={styles.alertItem}>
              <div className={styles.alertItemLeft}>
                <div className={`${styles.alertIcon} ${styles.alertIconInfo}`}>
                  <ShoppingCart size={16} />
                </div>
                Órdenes pendientes
              </div>
              <div className={styles.alertCount}>1</div>
            </div>
            
            <div className={styles.alertItem}>
              <div className={styles.alertItemLeft}>
                <div className={`${styles.alertIcon} ${styles.alertIconDanger}`}>
                  <Clock size={16} />
                </div>
                Stock de 91+ días
              </div>
              <div className={styles.alertCount}>3</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.topProductsCard}>
        <h2 className={styles.sectionTitle}>Top 5 productos más vendidos</h2>
        <div className={styles.productList}>
          {topProducts.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <div className={styles.productInfo}>
                <div className={styles.productRank}>{product.id}</div>
                <div className={styles.productName}>{product.name}</div>
              </div>
              <div className={styles.productStats}>
                <div className={styles.productUnits}>{product.units} uds.</div>
                <div className={styles.productRevenue}>${product.revenue.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
