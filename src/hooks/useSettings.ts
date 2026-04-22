import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface StoreSettings {
  id: string;
  user_id: string;
  store_name: string;
  owner_name: string;
  phone: string;
  email: string;
  currency: string;
  low_stock_threshold: number;
  notify_low_stock: boolean;
  notify_daily_summary: boolean;
  notify_new_sale: boolean;
}

export const useSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["store_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data as StoreSettings | null;
    },
    enabled: !!user,
  });

  const saveSettings = useMutation({
    mutationFn: async (settings: Partial<StoreSettings>) => {
      if (query.data) {
        const { error } = await supabase.from("store_settings").update(settings).eq("id", query.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("store_settings").insert({ ...settings, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store_settings"] });
      toast({ title: "Settings saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return { settings: query.data, isLoading: query.isLoading, saveSettings };
};