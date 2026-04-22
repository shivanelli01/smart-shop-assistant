import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Bell, Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const { settings, isLoading, saveSettings } = useSettings();
  const [form, setForm] = useState({
    store_name: "My Store", owner_name: "", phone: "", email: "",
    currency: "INR", low_stock_threshold: 15,
    notify_low_stock: true, notify_daily_summary: true, notify_new_sale: false,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        store_name: settings.store_name, owner_name: settings.owner_name,
        phone: settings.phone, email: settings.email, currency: settings.currency,
        low_stock_threshold: settings.low_stock_threshold,
        notify_low_stock: settings.notify_low_stock,
        notify_daily_summary: settings.notify_daily_summary,
        notify_new_sale: settings.notify_new_sale,
      });
    }
  }, [settings]);

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-3xl font-bold text-foreground">Settings</h1><p className="mt-1 text-muted-foreground">Manage your store configuration</p></div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><Store className="h-5 w-5 text-primary" /><CardTitle>Store Information</CardTitle></div><CardDescription>Basic details about your store</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Store Name</Label><Input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Owner Name</Label><Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="INR">₹ INR</SelectItem><SelectItem value="USD">$ USD</SelectItem><SelectItem value="EUR">€ EUR</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Low Stock Threshold</Label><Input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: Number(e.target.value) })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /><CardTitle>Notifications</CardTitle></div><CardDescription>Configure alert preferences</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "notify_low_stock" as const, label: "Low Stock Alerts", desc: "Get notified when products fall below threshold" },
            { key: "notify_daily_summary" as const, label: "Daily Summary", desc: "Receive a daily sales and profit summary" },
            { key: "notify_new_sale" as const, label: "New Sale Notification", desc: "Alert on every new sale transaction" },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div><p className="font-medium text-foreground">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
              <Switch checked={form[item.key]} onCheckedChange={(v) => setForm({ ...form, [item.key]: v })} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />
      <div className="flex justify-end">
        <Button onClick={() => saveSettings.mutate(form)} size="lg" disabled={saveSettings.isPending}>
          {saveSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;