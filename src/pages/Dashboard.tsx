import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useSettings } from "@/hooks/useSettings";
import { useMemo } from "react";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
};

const Dashboard = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { sales, isLoading: salesLoading } = useSales();
  const { settings } = useSettings();

  const threshold = settings?.low_stock_threshold ?? 15;

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s, sale) => s + Number(sale.total_amount), 0);
    const totalProfit = sales.reduce((s, sale) => s + Number(sale.total_profit), 0);
    return { totalRevenue, totalProfit, totalSales: sales.length, totalProducts: products.length };
  }, [sales, products]);

  const lowStockProducts = useMemo(() =>
    products.filter((p) => p.stock <= threshold && p.stock >= 0).sort((a, b) => a.stock - b.stock).slice(0, 10),
    [products, threshold]
  );

  const monthlySalesData = useMemo(() => {
    const months: Record<string, { sales: number; profit: number }> = {};
    sales.forEach((sale) => {
      const month = new Date(sale.sale_date).toLocaleString("default", { month: "short", year: "2-digit" });
      if (!months[month]) months[month] = { sales: 0, profit: 0 };
      months[month].sales += Number(sale.total_amount);
      months[month].profit += Number(sale.total_profit);
    });
    return Object.entries(months).map(([month, data]) => ({ month, ...data })).slice(-6);
  }, [sales]);

  const topProductsData = useMemo(() => {
    const productSales: Record<string, number> = {};
    sales.forEach((sale) => {
      sale.sale_items?.forEach((item) => {
        productSales[item.product_name] = (productSales[item.product_name] || 0) + Number(item.total_price);
      });
    });
    return Object.entries(productSales)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);

  if (productsLoading || salesLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} change={`${stats.totalSales} total transactions`} changeType="positive" icon={DollarSign} iconBgColor="bg-primary" />
        <DashboardCard title="Total Profit" value={`₹${stats.totalProfit.toLocaleString()}`} change={stats.totalRevenue > 0 ? `${((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}% margin` : "No sales yet"} changeType="positive" icon={TrendingUp} iconBgColor="bg-accent" />
        <DashboardCard title="Total Products" value={stats.totalProducts.toString()} change={`${lowStockProducts.length} low stock`} changeType={lowStockProducts.length > 0 ? "negative" : "neutral"} icon={Package} iconBgColor="bg-chart-3" />
        <DashboardCard title="Total Sales" value={stats.totalSales.toString()} change="All time" changeType="neutral" icon={ShoppingCart} iconBgColor="bg-chart-4" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Sales & Profit Trend</CardTitle></CardHeader>
          <CardContent>
            {monthlySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--accent))" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No sales data yet. Create your first sale!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
          <CardContent>
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No product sales data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Low Stock Alerts ({lowStockProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Current stock: {item.stock} units (Threshold: {threshold})</p>
                  </div>
                  <div className={`rounded-full px-4 py-2 ${item.stock === 0 ? "bg-destructive/10" : "bg-warning/10"}`}>
                    <span className={`text-sm font-medium ${item.stock === 0 ? "text-destructive" : "text-warning"}`}>
                      {item.stock === 0 ? "Out of Stock" : "Restock Soon"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">All products are well stocked!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
