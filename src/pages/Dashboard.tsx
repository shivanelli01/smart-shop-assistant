import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 45000, profit: 12000 },
  { month: "Feb", sales: 52000, profit: 15000 },
  { month: "Mar", sales: 48000, profit: 13500 },
  { month: "Apr", sales: 61000, profit: 18000 },
  { month: "May", sales: 55000, profit: 16500 },
  { month: "Jun", sales: 67000, profit: 21000 },
];

const topProducts = [
  { name: "Product A", sales: 1250, revenue: 45000 },
  { name: "Product B", sales: 980, revenue: 38000 },
  { name: "Product C", sales: 850, revenue: 32000 },
  { name: "Product D", sales: 720, revenue: 28000 },
  { name: "Product E", sales: 650, revenue: 24000 },
];

const lowStockAlerts = [
  { name: "Product X", stock: 5, threshold: 20 },
  { name: "Product Y", stock: 8, threshold: 25 },
  { name: "Product Z", stock: 3, threshold: 15 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Revenue"
          value="₹67,000"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          iconBgColor="bg-primary"
        />
        <DashboardCard
          title="Total Profit"
          value="₹21,000"
          change="+18.2% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconBgColor="bg-accent"
        />
        <DashboardCard
          title="Total Products"
          value="248"
          change="12 new this month"
          changeType="neutral"
          icon={Package}
          iconBgColor="bg-chart-3"
        />
        <DashboardCard
          title="Total Sales"
          value="1,456"
          change="+8.3% from last month"
          changeType="positive"
          icon={ShoppingCart}
          iconBgColor="bg-chart-4"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowStockAlerts.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current stock: {item.stock} units (Threshold: {item.threshold})
                  </p>
                </div>
                <div className="rounded-full bg-warning/10 px-4 py-2">
                  <span className="text-sm font-medium text-warning">Restock Soon</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
