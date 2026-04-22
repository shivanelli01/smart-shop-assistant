import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  costPrice: number;
}

const getStatus = (stock: number) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 15) return "Low Stock";
  return "In Stock";
};

const initialInventory: Product[] = [
  { id: 1, name: "Product A", category: "Electronics", stock: 45, price: 1200, costPrice: 900 },
  { id: 2, name: "Product B", category: "Clothing", stock: 120, price: 599, costPrice: 350 },
  { id: 3, name: "Product C", category: "Food", stock: 8, price: 299, costPrice: 180 },
  { id: 4, name: "Product D", category: "Electronics", stock: 0, price: 2499, costPrice: 1800 },
  { id: 5, name: "Product E", category: "Home & Garden", stock: 67, price: 899, costPrice: 550 },
  { id: 6, name: "Product F", category: "Sports", stock: 15, price: 1599, costPrice: 1100 },
];

const categories = ["Electronics", "Clothing", "Food", "Home & Garden", "Sports", "Other"];

const emptyProduct = { name: "", category: "", stock: 0, price: 0, costPrice: 0 };

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<Product[]>(initialInventory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const { toast } = useToast();

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, category: product.category, stock: product.stock, price: product.price, costPrice: product.costPrice });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (editingProduct) {
      setInventory((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...form } : p));
      toast({ title: "Product updated", description: `${form.name} has been updated.` });
    } else {
      const newProduct: Product = { id: Date.now(), ...form };
      setInventory((prev) => [...prev, newProduct]);
      toast({ title: "Product added", description: `${form.name} has been added to inventory.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const product = inventory.find((p) => p.id === id);
    setInventory((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Product deleted", description: `${product?.name} has been removed.` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-accent text-accent-foreground";
      case "Low Stock": return "bg-warning text-warning-foreground";
      case "Out of Stock": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="mt-1 text-muted-foreground">Manage your products and stock levels</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Products ({inventory.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
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
                {filteredInventory.map((item) => {
                  const status = getStatus(item.stock);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>₹{item.costPrice.toLocaleString()}</TableCell>
                      <TableCell>₹{item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(status)} variant="secondary">{status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Cost Price (₹)</Label>
                <Input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Sell Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingProduct ? "Update" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
