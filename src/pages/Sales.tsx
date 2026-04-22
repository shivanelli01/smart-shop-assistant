import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Receipt, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Sale {
  id: number;
  date: string;
  customer: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  status: string;
}

const initialSales: Sale[] = [
  { id: 1001, date: "2026-04-22", customer: "Rahul Sharma", items: [{ productName: "Product A", quantity: 2, unitPrice: 1200, total: 2400 }], total: 2400, paymentMethod: "UPI", status: "Completed" },
  { id: 1002, date: "2026-04-22", customer: "Priya Patel", items: [{ productName: "Product B", quantity: 1, unitPrice: 599, total: 599 }, { productName: "Product C", quantity: 3, unitPrice: 299, total: 897 }], total: 1496, paymentMethod: "Cash", status: "Completed" },
  { id: 1003, date: "2026-04-21", customer: "Amit Kumar", items: [{ productName: "Product E", quantity: 1, unitPrice: 899, total: 899 }], total: 899, paymentMethod: "Card", status: "Completed" },
  { id: 1004, date: "2026-04-21", customer: "Sneha Gupta", items: [{ productName: "Product F", quantity: 2, unitPrice: 1599, total: 3198 }], total: 3198, paymentMethod: "UPI", status: "Pending" },
];

const products = [
  { name: "Product A", price: 1200 },
  { name: "Product B", price: 599 },
  { name: "Product C", price: 299 },
  { name: "Product D", price: 2499 },
  { name: "Product E", price: 899 },
  { name: "Product F", price: 1599 },
];

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const filteredSales = sales.filter((s) =>
    s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toString().includes(searchTerm)
  );

  const addToCart = () => {
    const product = products.find((p) => p.name === selectedProduct);
    if (!product || quantity <= 0) return;
    const existing = cartItems.find((c) => c.productName === selectedProduct);
    if (existing) {
      setCartItems(cartItems.map((c) => c.productName === selectedProduct ? { ...c, quantity: c.quantity + quantity, total: (c.quantity + quantity) * c.unitPrice } : c));
    } else {
      setCartItems([...cartItems, { productName: product.name, quantity, unitPrice: product.price, total: product.price * quantity }]);
    }
    setSelectedProduct("");
    setQuantity(1);
  };

  const removeFromCart = (name: string) => setCartItems(cartItems.filter((c) => c.productName !== name));

  const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleCreateSale = () => {
    if (!customer || cartItems.length === 0) {
      toast({ title: "Error", description: "Please add customer name and at least one product", variant: "destructive" });
      return;
    }
    const newSale: Sale = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      customer,
      items: cartItems,
      total: cartTotal,
      paymentMethod,
      status: "Completed",
    };
    setSales([newSale, ...sales]);
    toast({ title: "Sale recorded", description: `Sale of ₹${cartTotal.toLocaleString()} to ${customer}` });
    setDialogOpen(false);
    setCustomer("");
    setCartItems([]);
    setPaymentMethod("Cash");
  };

  const todaySales = sales.filter((s) => s.date === new Date().toISOString().split("T")[0]);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales</h1>
          <p className="mt-1 text-muted-foreground">Record and manage sales transactions</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> New Sale
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary p-3"><Receipt className="h-6 w-6 text-primary-foreground" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold text-foreground">{todaySales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent p-3"><IndianRupee className="h-6 w-6 text-accent-foreground" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold text-foreground">₹{todayRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-chart-3 p-3"><Receipt className="h-6 w-6 text-primary-foreground" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-foreground">{sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Sales History</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search by customer or ID..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">#{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.items.length} item(s)</TableCell>
                    <TableCell>₹{sale.total.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{sale.paymentMethod}</Badge></TableCell>
                    <TableCell>
                      <Badge className={sale.status === "Completed" ? "bg-accent text-accent-foreground" : "bg-warning text-warning-foreground"} variant="secondary">
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Sale Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Sale</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Enter customer name" />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Add Product</Label>
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => <SelectItem key={p.name} value={p.name}>{p.name} - ₹{p.price}</SelectItem>)}
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
                      <TableRow key={item.productName}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.total.toLocaleString()}</TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => removeFromCart(item.productName)}>✕</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between p-3 border-t border-border font-bold">
                  <span>Total</span><span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSale}>Complete Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;