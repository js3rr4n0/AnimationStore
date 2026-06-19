"use client";

import { FileText, TrendingUp, TrendingDown, Package, ShoppingCart, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from "./page.module.css";

type DashboardProps = {
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
  chartData: { name: string; value: number }[];
  alerts: {
    lowStock: number;
    pendingOrders: number;
    oldStock: number;
  };
  topProducts: { id: number; name: string; units: number; revenue: number }[];
};

export default function DashboardClient({ 
  totalRevenue, totalOrders, averageOrder, chartData, alerts, topProducts 
}: DashboardProps) {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.welcomeTitle}>Bienvenido a tu dashboard</h1>
        <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FileText size={16} /> Generar reporte
        </button>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            ${totalRevenue.toFixed(2)}
            <span className={`${styles.metricChange} ${styles.positive}`}>
              <TrendingUp size={14} /> 0.0%
            </span>
          </div>
          <div className={styles.metricLabel}>Total generado histórico</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            {totalOrders}
            <span className={`${styles.metricChange} ${styles.positive}`}>
              <TrendingUp size={14} /> 0.0%
            </span>
          </div>
          <div className={styles.metricLabel}>Total de órdenes registradas</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            ${averageOrder.toFixed(2)}
            <span className={`${styles.metricChange} ${styles.positive}`}>
              <TrendingUp size={14} /> 0.0%
            </span>
          </div>
          <div className={styles.metricLabel}>Promedio histórico de compras</div>
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
              <div className={styles.alertCount}>{alerts.lowStock}</div>
            </div>
            
            <div className={styles.alertItem}>
              <div className={styles.alertItemLeft}>
                <div className={`${styles.alertIcon} ${styles.alertIconInfo}`}>
                  <ShoppingCart size={16} />
                </div>
                Órdenes pendientes
              </div>
              <div className={styles.alertCount}>{alerts.pendingOrders}</div>
            </div>
            
            <div className={styles.alertItem}>
              <div className={styles.alertItemLeft}>
                <div className={`${styles.alertIcon} ${styles.alertIconDanger}`}>
                  <Clock size={16} />
                </div>
                Stock de 91+ días
              </div>
              <div className={styles.alertCount}>{alerts.oldStock}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.topProductsCard}>
        <h2 className={styles.sectionTitle}>Top 5 productos más vendidos</h2>
        <div className={styles.productList}>
          {topProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No hay ventas registradas aún</div>
          ) : (
            topProducts.map((product, idx) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <div className={styles.productRank}>{idx + 1}</div>
                  <div className={styles.productName}>{product.name}</div>
                </div>
                <div className={styles.productStats}>
                  <div className={styles.productUnits}>{product.units} uds.</div>
                  <div className={styles.productRevenue}>${Number(product.revenue).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
