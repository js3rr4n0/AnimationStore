import { sql } from "@vercel/postgres";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch Global Stats
  const { rows: statsData } = await sql`
    SELECT 
      COUNT(*) as total_orders, 
      COALESCE(SUM(total), 0) as total_revenue
    FROM animation_store.ordenes
  `;
  const totalOrders = Number(statsData[0].total_orders);
  const totalRevenue = Number(statsData[0].total_revenue);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // 2. Fetch Chart Data (Last 30 days orders)
  const { rows: last30Orders } = await sql`
    SELECT total, creado_en 
    FROM animation_store.ordenes 
    WHERE creado_en >= NOW() - INTERVAL '30 days'
  `;

  // Process chart data: create an array of last 30 days
  const chartData = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayString = d.getDate().toString();
    
    // Sum total for this specific date
    const dayTotal = last30Orders.reduce((acc, order) => {
      const orderDate = new Date(order.creado_en);
      if (orderDate.getDate() === d.getDate() && orderDate.getMonth() === d.getMonth()) {
        return acc + Number(order.total);
      }
      return acc;
    }, 0);

    // To keep it clean, only add a point every ~5 days or just all 30 days
    // Recharts handles all points well. We will pass all 30 points.
    chartData.push({
      name: dayString,
      value: dayTotal
    });
  }

  // 3. Fetch Alerts
  const { rows: alertLowStock } = await sql`
    SELECT COUNT(*) as count FROM animation_store.productos WHERE stock > 0 AND stock <= 5
  `;
  const { rows: alertPending } = await sql`
    SELECT COUNT(*) as count FROM animation_store.ordenes WHERE estado = 'pendiente'
  `;
  const { rows: alertOldStock } = await sql`
    SELECT COUNT(*) as count FROM animation_store.productos WHERE creado_en < NOW() - INTERVAL '91 days'
  `;

  // 4. Fetch Top Products
  const { rows: topProductsData } = await sql`
    SELECT 
      producto_id as id, 
      nombre_producto as name, 
      SUM(cantidad) as units, 
      SUM(subtotal) as revenue
    FROM animation_store.orden_items
    GROUP BY producto_id, nombre_producto
    ORDER BY units DESC
    LIMIT 5
  `;

  return (
    <DashboardClient 
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      averageOrder={averageOrder}
      chartData={chartData}
      alerts={{
        lowStock: Number(alertLowStock[0].count),
        pendingOrders: Number(alertPending[0].count),
        oldStock: Number(alertOldStock[0].count)
      }}
      topProducts={topProductsData.map(p => ({
        id: p.id || Math.random(), // just in case it's null
        name: p.name,
        units: Number(p.units),
        revenue: Number(p.revenue)
      }))}
    />
  );
}
