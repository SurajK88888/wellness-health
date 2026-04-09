import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string[] | Record<string, unknown>[];
  benefits: string[] | Record<string, unknown>[];
  usage_instructions: string;
  image_url: string | null;
  video_url: string | null;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export function useProducts(category?: string, search?: string) {
  return useQuery({
    queryKey: ["products", category, search],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (category && category !== "All") {
        q = q.eq("category", category);
      }
      if (search) {
        q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Product[];
    },
  });
}

export function useProductMutations() {
  const qc = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("products").insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return { createProduct, updateProduct, deleteProduct };
}
