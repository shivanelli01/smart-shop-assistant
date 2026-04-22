import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, ShoppingCart, Package, Loader2 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" };

const Analytics = () => {
  const { sales, isLoading: salesLoading } = useSales();
  const { products, isLoading: productsLoading } = useProducts();

  const totalRevenue = useMemo(() => sales.reduce((s, sale) => s + Number(sale.total_amount), 0), [sales]);
  const totalProfit = useMemo(() => sales.reduce((s, sale) => s + Number(sale.total_profit), 0), [sales]);
  const avgOrderValue = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  const monthlySalesData = useMemo(() => {
    const months: Record<string, { sales: number; profit: number; orders: number }> = {};
    sales.forEach((sale) => {
      const month = new Date(sale.sale_date).toLocaleString("default", { month: "short" });
      if (!months[month]) months[month] = { sales: 0, profit: 0, orders: 0 };
      months[month].sales += Number(sale.total_amount);
      months[month].profit += Number(sale.total_profit);
      months[month].orders += 1;
    });
    return Object.entries(months).map(([month, data]) => ({ month, ...data }));
  }, [sales]);

  const dailySalesData = useMemo(() => {
    const days: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    sales.forEach((sale) => {
      const day = dayNames[new Date(sale.sale_date).getDay()];
      days[day] += Number(sale.total_amount);
    });
    return Object.entries(days).map(([day, sales]) => ({ day, sales }));
  }, [sales]);

  const topProductsData = useMemo(() => {
    const map: Record<string, { revenue: number; units: number }> = {};
    sales.forEach((sale) => {
      sale.sale_items?.forEach((item) => {
        if (!map[item.product_name]) map[item.product_name] = { revenue: 0, units: 0 };
        map[item.product_name].revenue += Number(item.total_price);
        map[item.product_name].units += item.quantity;
      });
    });
    return Object.entries(map).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [sales]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach((sale) => {
      sale.sale_items?.forEach((item) => {
        const product = products.find((p) => p.id === item.product_id);
        const cat = product?.category ?? "Other";
        map[cat] = (map[cat] || 0) + Number(item.total_price);
      });
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([name, value], i) => ({
      name, value: Math.round((value / total) * 100), color: COLORS[i % COLORS.length],
    }));
  }, [sales, products]);

  if (salesLoading || productsLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-foreground">Analytics</h1><p className="mt-1 text-muted-foreground">Insights and reports from your real sales data</p></div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: "bg-primary" },
          { title: "Total Profit", value: `₹${totalProfit.toLocaleString()}`, icon: TrendingUp, bg: "bg-accent" },
          { title: "Total Orders", value: sales.length.toLocaleString(), icon: ShoppingCart, bg: "bg-chart-3" },
          { title: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString()}`, icon: Package, bg: "bg-chart-4" },
        ].map((m) => (
          <Card key={m.title}><CardContent className="pt-6"><div className="flex items-center gap-4"><div className={`rounded-lg ${m.bg} p-3`}><m.icon className="h-6 w-6 text-primary-foreground" /></div><div><p className="text-sm text-muted-foreground">{m.title}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div></div></CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="products">Products</TabsTrigger><TabsTrigger value="categories">Categories</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader><CardTitle>Revenue & Profit Trend</CardTitle></CardHeader><CardContent>
              {monthlySalesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip contentStyle={tooltipStyle} /><Legend />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.15)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" fill="hsl(var(--accent)/.15)" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <p className="text-center py-12 text-muted-foreground">No sales data yet</p>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Weekly Sales Pattern</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Sales (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle>Orders Trend</CardTitle></CardHeader><CardContent>
            {monthlySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-12 text-muted-foreground">No order data yet</p>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card><CardHeader><CardTitle>Top Products by Revenue</CardTitle></CardHeader><CardContent>
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" stroke="hsl(var(--muted-foreground))" /><YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} /><Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-12 text-muted-foreground">No product sales data yet</p>}
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Product Performance</CardTitle></CardHeader><CardContent>
            {topProductsData.length > 0 ? (
              <div className="space-y-4">
                {topProductsData.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                      <div><p className="font-medium text-foreground">{p.name}</p><p className="text-sm text-muted-foreground">{p.units} units sold</p></div>
                    </div>
                    <p className="text-lg font-bold text-foreground">₹{p.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-center py-8 text-muted-foreground">No product data yet</p>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader><CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center py-12 text-muted-foreground">No category data yet</p>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader><CardContent>
              {categoryData.length > 0 ? (
                <div className="space-y-4">
                  {categoryData.map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-foreground font-medium">{c.name}</span><span className="text-muted-foreground">{c.value}%</span></div>
                      <div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full" style={{ width: `${c.value}%`, backgroundColor: c.color }} /></div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center py-8 text-muted-foreground">No category data yet</p>}
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;