import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const monthlySales = [
  { month: "Jan", sales: 45000, profit: 12000, orders: 120 },
  { month: "Feb", sales: 52000, profit: 15000, orders: 145 },
  { month: "Mar", sales: 48000, profit: 13500, orders: 130 },
  { month: "Apr", sales: 61000, profit: 18000, orders: 165 },
  { month: "May", sales: 55000, profit: 16500, orders: 155 },
  { month: "Jun", sales: 67000, profit: 21000, orders: 180 },
  { month: "Jul", sales: 72000, profit: 23000, orders: 200 },
  { month: "Aug", sales: 68000, profit: 20000, orders: 190 },
  { month: "Sep", sales: 75000, profit: 25000, orders: 210 },
  { month: "Oct", sales: 80000, profit: 28000, orders: 230 },
  { month: "Nov", sales: 95000, profit: 35000, orders: 280 },
  { month: "Dec", sales: 110000, profit: 42000, orders: 320 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(var(--primary))" },
  { name: "Clothing", value: 25, color: "hsl(var(--accent))" },
  { name: "Food", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Home & Garden", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Sports", value: 8, color: "hsl(var(--chart-5))" },
];

const dailySales = [
  { day: "Mon", sales: 12000 }, { day: "Tue", sales: 15000 }, { day: "Wed", sales: 11000 },
  { day: "Thu", sales: 18000 }, { day: "Fri", sales: 22000 }, { day: "Sat", sales: 28000 },
  { day: "Sun", sales: 8000 },
];

const topProducts = [
  { name: "Product A", revenue: 45000, units: 1250 },
  { name: "Product B", revenue: 38000, units: 980 },
  { name: "Product C", revenue: 32000, units: 850 },
  { name: "Product E", revenue: 24000, units: 650 },
  { name: "Product F", revenue: 18000, units: 420 },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
};

const Analytics = () => {
  const totalRevenue = monthlySales.reduce((s, m) => s + m.sales, 0);
  const totalProfit = monthlySales.reduce((s, m) => s + m.profit, 0);
  const totalOrders = monthlySales.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Insights and reports for your business</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { title: "Annual Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, bg: "bg-primary" },
          { title: "Annual Profit", value: `₹${(totalProfit / 100000).toFixed(1)}L`, icon: TrendingUp, bg: "bg-accent" },
          { title: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, bg: "bg-chart-3" },
          { title: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString()}`, icon: Package, bg: "bg-chart-4" },
        ].map((m) => (
          <Card key={m.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg ${m.bg} p-3`}><m.icon className="h-6 w-6 text-primary-foreground" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{m.title}</p>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Revenue & Profit Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.15)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" fill="hsl(var(--accent)/.15)" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Weekly Sales Pattern</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Sales (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Orders Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Top Products by Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Product Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.units} units sold</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-foreground">₹{p.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{c.name}</span>
                        <span className="text-muted-foreground">{c.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div className="h-2 rounded-full" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;