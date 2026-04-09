import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  category: string;
  tags: string[];
  author_id: string | null;
  author_name: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export function usePublishedBlogs(category?: string, search?: string) {
  return useQuery({
    queryKey: ["blogs", "published", category, search],
    queryFn: async () => {
      let q = supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (category && category !== "All") {
        q = q.eq("category", category);
      }
      if (search) {
        q = q.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Blog[];
    },
  });
}

export function useBlogBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["blogs", "slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Blog;
    },
    enabled: !!slug,
  });
}

export function useAllBlogs() {
  return useQuery({
    queryKey: ["blogs", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Blog[];
    },
  });
}

export function useBlogMutations() {
  const qc = useQueryClient();

  const createBlog = useMutation({
    mutationFn: async (blog: Omit<Blog, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("blogs").insert(blog).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });

  const updateBlog = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Blog> & { id: string }) => {
      const { data, error } = await supabase.from("blogs").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });

  return { createBlog, updateBlog, deleteBlog };
}
