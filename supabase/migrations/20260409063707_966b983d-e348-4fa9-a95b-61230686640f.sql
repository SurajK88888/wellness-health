
-- Create meeting status enum
CREATE TYPE public.meeting_status AS ENUM ('scheduled', 'completed', 'cancelled');

-- ===================== BLOGS TABLE =====================
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Anyone can read published blogs"
  ON public.blogs FOR SELECT
  USING (published = true);

-- Admins can read all blogs (including drafts)
CREATE POLICY "Admins can read all blogs"
  ON public.blogs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert blogs
CREATE POLICY "Admins can insert blogs"
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update blogs
CREATE POLICY "Admins can update blogs"
  ON public.blogs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete blogs
CREATE POLICY "Admins can delete blogs"
  ON public.blogs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for slug lookups and category filtering
CREATE INDEX idx_blogs_slug ON public.blogs (slug);
CREATE INDEX idx_blogs_category ON public.blogs (category);
CREATE INDEX idx_blogs_tags ON public.blogs USING GIN (tags);
CREATE INDEX idx_blogs_published ON public.blogs (published, created_at DESC);

-- ===================== PRODUCTS TABLE =====================
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  ingredients JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  usage_instructions TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  video_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read all products
CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  USING (true);

-- Admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update products
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_tags ON public.products USING GIN (tags);

-- ===================== MEETINGS TABLE =====================
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_link TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  status meeting_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  platform TEXT NOT NULL DEFAULT 'Zoom',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Users can read own meetings
CREATE POLICY "Users can read own meetings"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all meetings
CREATE POLICY "Admins can read all meetings"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can create own meetings
CREATE POLICY "Users can create own meetings"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update own meetings (cancel)
CREATE POLICY "Users can update own meetings"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can update all meetings
CREATE POLICY "Admins can update all meetings"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete meetings
CREATE POLICY "Admins can delete meetings"
  ON public.meetings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_meetings_user_id ON public.meetings (user_id);
CREATE INDEX idx_meetings_date ON public.meetings (meeting_date DESC);
CREATE INDEX idx_meetings_status ON public.meetings (status);

-- ===================== UPDATED_AT TRIGGER =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================== STORAGE BUCKET FOR CONTENT IMAGES =====================
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Anyone can view content images
CREATE POLICY "Content images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images');

-- Admins can upload content images
CREATE POLICY "Admins can upload content images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update content images
CREATE POLICY "Admins can update content images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete content images
CREATE POLICY "Admins can delete content images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));
