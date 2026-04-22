import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Receipt, IndianRupee, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useSales, SaleItem } from "@/hooks/useSales";

interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
  total_price: number;
}

const Sales = () => {
  const { products } = useProducts();
  const { sales, isLoading, createSale } = useSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const filteredSales = sales.filter((s) =>
    s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.includes(searchTerm)
  );

  const addToCart = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product || quantity <= 0) return;
    if (quantity > product.stock) {
      toast({ title: "Insufficient stock", description: `Only ${product.stock} units available`, variant: "destructive" });
      return;
    }
    const existing = cartItems.find((c) => c.product_id === selectedProductId);
    if (existing) {
      setCartItems(cartItems.map((c) => c.product_id === selectedProductId
        ? { ...c, quantity: c.quantity + quantity, total_price: (c.quantity + quantity) * c.unit_price }
        : c));
    } else {
      setCartItems([...cartItems, {
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: Number(product.sell_price),
        cost_price: Number(product.cost_price),
        total_price: Number(product.sell_price) * quantity,
      }]);
    }
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeFromCart = (id: string) => setCartItems(cartItems.filter((c) => c.product_id !== id));
  const cartTotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  const handleCreateSale = () => {
    if (!customer || cartItems.length === 0) {
      toast({ title: "Error", description: "Please add customer name and at least one product", variant: "destructive" });
      return;
    }
    createSale.mutate(
      { customer_name: customer, payment_method: paymentMethod, items: cartItems },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setCustomer("");
          setCartItems([]);
          setPaymentMethod("Cash");
        },
      }
    );
  };

  const today = new Date().toISOString().split("T")[0];
  const todaySales = sales.filter((s) => s.sale_date.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales</h1>
          <p className="mt-1 text-muted-foreground">Record and manage sales transactions</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> New Sale</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="rounded-lg bg-primary p-3"><Receipt className="h-6 w-6 text-primary-foreground" /></div><div><p className="text-sm text-muted-foreground">Today's Sales</p><p className="text-2xl font-bold text-foreground">{todaySales.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="rounded-lg bg-accent p-3"><IndianRupee className="h-6 w-6 text-accent-foreground" /></div><div><p className="text-sm text-muted-foreground">Today's Revenue</p><p className="text-2xl font-bold text-foreground">₹{todayRevenue.toLocaleString()}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="rounded-lg bg-chart-3 p-3"><Receipt className="h-6 w-6 text-primary-foreground" /></div><div><p className="text-sm text-muted-foreground">Total Sales</p><p className="text-2xl font-bold text-foreground">{sales.length}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Sales History</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search by customer..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Profit</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.customer_name}</TableCell>
                      <TableCell>{sale.sale_items?.length ?? 0} item(s)</TableCell>
                      <TableCell>₹{Number(sale.total_amount).toLocaleString()}</TableCell>
                      <TableCell className="text-accent">₹{Number(sale.total_profit).toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline">{sale.payment_method}</Badge></TableCell>
                      <TableCell><Badge className={sale.status === "Completed" ? "bg-accent text-accent-foreground" : "bg-warning text-warning-foreground"} variant="secondary">{sale.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {filteredSales.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No sales yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Sale</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Customer Name</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Enter customer name" /></div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="UPI">UPI</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Add Product</Label>
              <div className="flex gap-2">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.filter((p) => p.stock > 0).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name} - ₹{Number(p.sell_price)} ({p.stock} in stock)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" className="w-20" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
                <Button onClick={addToCart} size="sm">Add</Button>
              </div>
            </div>
            {cartItems.length > 0 && (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Qty</TableHead><TableHead>Total</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.total_price.toLocaleString()}</TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product_id)}>✕</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between p-3 border-t border-border font-bold"><span>Total</span><span>₹{cartTotal.toLocaleString()}</span></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSale} disabled={createSale.isPending}>{createSale.isPending ? "Processing..." : "Complete Sale"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;