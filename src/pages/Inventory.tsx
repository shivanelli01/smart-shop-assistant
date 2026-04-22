import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";

const categories = ["Electronics", "Clothing", "Food", "Home & Garden", "Sports", "Other"];
const emptyForm = { name: "", category: "", stock: 0, sell_price: 0, cost_price: 0 };

const getStatus = (stock: number) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 15) return "Low Stock";
  return "In Stock";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock": return "bg-accent text-accent-foreground";
    case "Low Stock": return "bg-warning text-warning-foreground";
    case "Out of Stock": return "bg-destructive text-destructive-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const Inventory = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => { setEditingProduct(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, category: p.category, stock: p.stock, sell_price: p.sell_price, cost_price: p.cost_price });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category) return;
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...form });
    } else {
      addProduct.mutate(form);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="mt-1 text-muted-foreground">Manage your products and stock levels</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Products ({products.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Sell Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => {
                    const status = getStatus(item.stock);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>₹{Number(item.cost_price).toLocaleString()}</TableCell>
                        <TableCell>₹{Number(item.sell_price).toLocaleString()}</TableCell>
                        <TableCell><Badge className={getStatusColor(status)} variant="secondary">{status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{products.length === 0 ? "No products yet. Add your first product!" : "No products found"}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Product Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Cost Price (₹)</Label><Input type="number" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Sell Price (₹)</Label><Input type="number" value={form.sell_price} onChange={(e) => setForm({ ...form, sell_price: Number(e.target.value) })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addProduct.isPending || updateProduct.isPending}>
              {editingProduct ? "Update" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
