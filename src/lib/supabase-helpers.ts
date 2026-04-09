import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ─── Image Upload ───
export async function uploadContentImage(file: File, folder: string = "blog"): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("content-images")
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/content-images/${fileName}`;
}

// ─── Slug generation ───
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
