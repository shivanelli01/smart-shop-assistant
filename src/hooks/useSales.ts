import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
  total_price: number;
}

export interface Sale {
  id: string;
  user_id: string;
  customer_name: string;
  payment_method: string;
  total_amount: number;
  total_profit: number;
  status: string;
  sale_date: string;
  created_at: string;
  sale_items?: SaleItem[];
}

export const useSales = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*, sale_items(*)")
        .order("sale_date", { ascending: false });
      if (error) throw error;
      return data as Sale[];
    },
    enabled: !!user,
  });

  const createSale = useMutation({
    mutationFn: async (input: {
      customer_name: string;
      payment_method: string;
      items: SaleItem[];
    }) => {
      const totalAmount = input.items.reduce((s, i) => s + i.total_price, 0);
      const totalProfit = input.items.reduce((s, i) => s + (i.unit_price - i.cost_price) * i.quantity, 0);

      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          user_id: user!.id,
          customer_name: input.customer_name,
          payment_method: input.payment_method,
          total_amount: totalAmount,
          total_profit: totalProfit,
          status: "Completed",
        })
        .select()
        .single();
      if (saleError) throw saleError;

      const saleItems = input.items.map((item) => ({
        sale_id: sale.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        cost_price: item.cost_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
      if (itemsError) throw itemsError;

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Sale recorded successfully" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return { sales: query.data ?? [], isLoading: query.isLoading, createSale };
};