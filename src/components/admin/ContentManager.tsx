import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, Save, X, FileText, Package, Calendar, Video, Link as LinkIcon, CheckCircle, Clock, Ban } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAllBlogs, useBlogMutations, type Blog } from "@/hooks/use-blogs";
import { useProducts, useProductMutations, type Product } from "@/hooks/use-products";
import { useAllMeetings, useMeetingMutations, type Meeting } from "@/hooks/use-meetings";
import { uploadContentImage, generateSlug } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";
import { createNotification } from "@/hooks/use-notifications";

type Tab = "blogs" | "products" | "meetings";

// ─── Blog Form ───
interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category: string;
  tags: string;
  author_name: string;
  published: boolean;
}

const emptyBlog: BlogFormData = {
  title: "", content: "", excerpt: "", featured_image: "",
  category: "Nutrition", tags: "", author_name: "", published: false,
};

// ─── Product Form ───
interface ProductFormData {
  name: string;
  description: string;
  ingredients: string;
  benefits: string;
  usage_instructions: string;
  image_url: string;
  video_url: string;
  category: string;
  tags: string;
}

const emptyProduct: ProductFormData = {
  name: "", description: "", ingredients: "", benefits: "",
  usage_instructions: "", image_url: "", video_url: "", category: "Supplements", tags: "",
};

const ContentManager = () => {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>("blogs");

  // ── Blog state ──
  const { data: blogs = [], isLoading: blogsLoading } = useAllBlogs();
  const { createBlog, updateBlog, deleteBlog } = useBlogMutations();
  const [blogForm, setBlogForm] = useState<BlogFormData>(emptyBlog);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);

  // ── Product state ──
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // ── Meetings state ──
  const { data: meetings = [], isLoading: meetingsLoading } = useAllMeetings();
  const { updateMeeting } = useMeetingMutations();

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Image upload handler ──
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "blog" | "product") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadContentImage(file, target);
    setUploading(false);
    if (!url) { toast.error("Upload failed"); return; }
    if (target === "blog") setBlogForm(f => ({ ...f, featured_image: url }));
    else setProductForm(f => ({ ...f, image_url: url }));
    toast.success("Image uploaded");
  };

  // ── Blog CRUD ──
  const handleSaveBlog = async () => {
    if (!blogForm.title.trim()) { toast.error("Title is required"); return; }
    const slug = generateSlug(blogForm.title);
    const payload = {
      title: blogForm.title,
      slug,
      content: blogForm.content,
      excerpt: blogForm.excerpt || blogForm.content.slice(0, 150) + "...",
      featured_image: blogForm.featured_image || null,
      category: blogForm.category,
      tags: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      author_id: user?.id || null,
      author_name: blogForm.author_name || profile?.name || "",
      published: blogForm.published,
    };

    try {
      if (editingBlogId) {
        await updateBlog.mutateAsync({ id: editingBlogId, ...payload });
        toast.success("Blog updated");
      } else {
        await createBlog.mutateAsync(payload);
        toast.success("Blog created");
      }
      setShowBlogForm(false);
      setBlogForm(emptyBlog);
      setEditingBlogId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const startEditBlog = (blog: Blog) => {
    setBlogForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      featured_image: blog.featured_image || "",
      category: blog.category,
      tags: (blog.tags || []).join(", "),
      author_name: blog.author_name,
      published: blog.published,
    });
    setEditingBlogId(blog.id);
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await deleteBlog.mutateAsync(id);
      toast.success("Blog deleted");
    } catch (err: any) { toast.error(err.message); }
  };

  // ── Product CRUD ──
  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) { toast.error("Name is required"); return; }
    const payload = {
      name: productForm.name,
      description: productForm.description,
      ingredients: productForm.ingredients.split(",").map(i => i.trim()).filter(Boolean) as unknown as Json,
      benefits: productForm.benefits.split(",").map(b => b.trim()).filter(Boolean) as unknown as Json,
      usage_instructions: productForm.usage_instructions,
      image_url: productForm.image_url || null,
      video_url: productForm.video_url || null,
      category: productForm.category,
      tags: productForm.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingProductId) {
        await updateProduct.mutateAsync({ id: editingProductId, ...payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      setShowProductForm(false);
      setProductForm(emptyProduct);
      setEditingProductId(null);
    } catch (err: any) { toast.error(err.message || "Failed to save"); }
  };

  const startEditProduct = (product: Product) => {
    const ingredients = Array.isArray(product.ingredients) ? (product.ingredients as string[]).join(", ") : "";
    const benefits = Array.isArray(product.benefits) ? (product.benefits as string[]).join(", ") : "";
    setProductForm({
      name: product.name,
      description: product.description,
      ingredients,
      benefits,
      usage_instructions: product.usage_instructions,
      image_url: product.image_url || "",
      video_url: product.video_url || "",
      category: product.category,
      tags: (product.tags || []).join(", "),
    });
    setEditingProductId(product.id);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch (err: any) { toast.error(err.message); }
  };

  // ── Meeting status + link update ──
  const handleMeetingStatus = async (meeting: Meeting, status: "scheduled" | "completed" | "cancelled" | "pending" | "confirmed") => {
    try {
      await updateMeeting.mutateAsync({ id: meeting.id, status });
      toast.success(`Meeting marked as ${status}`);

      // Send notification to the user
      if (status === "confirmed") {
        await createNotification({
          userId: meeting.user_id,
          title: "Meeting Confirmed",
          message: `Your consultation on ${new Date(meeting.meeting_date).toLocaleString()} has been confirmed.`,
          type: "confirmed",
          relatedId: meeting.id,
        });
      } else if (status === "cancelled") {
        // Notify admins about cancellation
        await createNotification({
          userId: meeting.user_id,
          title: "Meeting Cancelled",
          message: `Your consultation on ${new Date(meeting.meeting_date).toLocaleString()} has been cancelled.`,
          type: "cancellation",
          relatedId: meeting.id,
        });
      }
    } catch (err: any) { toast.error(err.message); }
  };

  const [meetingLinkInputs, setMeetingLinkInputs] = useState<Record<string, string>>({});

  const handleSaveMeetingLink = async (meeting: Meeting) => {
    const link = meetingLinkInputs[meeting.id]?.trim();
    if (!link) { toast.error("Please enter a meeting link"); return; }
    try {
      await updateMeeting.mutateAsync({ id: meeting.id, meeting_link: link });
      toast.success("Meeting link saved");

      // Notify user that a meeting link was added
      await createNotification({
        userId: meeting.user_id,
        title: "Meeting Link Added",
        message: `A Google Meet link has been added to your consultation on ${new Date(meeting.meeting_date).toLocaleString()}. Check your meetings to join.`,
        type: "link_added",
        relatedId: meeting.id,
      });
    } catch (err: any) { toast.error(err.message); }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "blogs", label: "Blog Posts", icon: FileText },
    { key: "products", label: "Products", icon: Package },
    { key: "meetings", label: "Meetings", icon: Calendar },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <FileText className="text-secondary" size={24} />
        <p className="text-accent text-sm uppercase tracking-[0.3em] font-sans">Content Manager</p>
      </div>
      <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-8">Manage Content</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-sans font-medium transition-all border-b-2 -mb-px ${
              tab === key
                ? "border-secondary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* ═══════ BLOGS TAB ═══════ */}
      {tab === "blogs" && (
        <div>
          {!showBlogForm && (
            <button
              onClick={() => { setBlogForm(emptyBlog); setEditingBlogId(null); setShowBlogForm(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-sans hover:opacity-90 transition-opacity mb-6"
            >
              <Plus size={16} /> New Blog Post
            </button>
          )}

          {showBlogForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-elevated rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {editingBlogId ? "Edit Blog Post" : "Create Blog Post"}
                </h3>
                <button onClick={() => { setShowBlogForm(false); setEditingBlogId(null); }}>
                  <X size={18} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Title</label>
                  <input
                    value={blogForm.title}
                    onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Blog post title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-1">Category</label>
                    <input
                      value={blogForm.category}
                      onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. Nutrition, Fitness, Lifestyle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-1">Tags (comma-separated)</label>
                    <input
                      value={blogForm.tags}
                      onChange={e => setBlogForm(f => ({ ...f, tags: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="health, yoga, tips"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Author Name</label>
                  <input
                    value={blogForm.author_name}
                    onChange={e => setBlogForm(f => ({ ...f, author_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Excerpt</label>
                  <textarea
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Short preview text..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Content (Markdown)</label>
                  <textarea
                    value={blogForm.content}
                    onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                    rows={12}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y font-mono"
                    placeholder="Write your blog content in Markdown..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Featured Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, "blog")}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-sans text-foreground hover:bg-muted transition-colors"
                    >
                      <ImageIcon size={14} /> {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                    {blogForm.featured_image && (
                      <img src={blogForm.featured_image} alt="Preview" className="h-10 w-16 object-cover rounded" />
                    )}
                    <input
                      value={blogForm.featured_image}
                      onChange={e => setBlogForm(f => ({ ...f, featured_image: e.target.value }))}
                      className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Or paste image URL"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blogForm.published}
                      onChange={e => setBlogForm(f => ({ ...f, published: e.target.checked }))}
                      className="accent-secondary"
                    />
                    <span className="text-sm font-sans text-foreground">Publish immediately</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveBlog}
                    disabled={createBlog.isPending || updateBlog.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-sans hover:opacity-90 transition-opacity"
                  >
                    <Save size={14} /> {editingBlogId ? "Update" : "Create"} Post
                  </button>
                  <button
                    onClick={() => { setShowBlogForm(false); setEditingBlogId(null); }}
                    className="px-6 py-3 bg-card border border-border rounded-lg text-sm font-sans text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog list */}
          {blogsLoading ? (
            <p className="text-muted-foreground font-sans text-sm">Loading...</p>
          ) : blogs.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <FileText size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground font-sans">No blog posts yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blogs.map(blog => (
                <div key={blog.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  {blog.featured_image && (
                    <img src={blog.featured_image} alt="" className="w-16 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-foreground truncate">{blog.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-accent font-sans uppercase tracking-wider">{blog.category}</span>
                      <span className="text-xs text-muted-foreground font-sans">{new Date(blog.created_at).toLocaleDateString()}</span>
                      <span className={`flex items-center gap-1 text-xs font-sans ${blog.published ? "text-secondary" : "text-muted-foreground"}`}>
                        {blog.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditBlog(blog)} className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
                      <Edit size={14} className="text-foreground" />
                    </button>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 rounded-lg bg-card border border-border hover:bg-destructive/20 transition-colors">
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ PRODUCTS TAB ═══════ */}
      {tab === "products" && (
        <div>
          {!showProductForm && (
            <button
              onClick={() => { setProductForm(emptyProduct); setEditingProductId(null); setShowProductForm(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-sans hover:opacity-90 transition-opacity mb-6"
            >
              <Plus size={16} /> New Product
            </button>
          )}

          {showProductForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-elevated rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h3>
                <button onClick={() => { setShowProductForm(false); setEditingProductId(null); }}>
                  <X size={18} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-1">Product Name</label>
                    <input
                      value={productForm.name}
                      onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-1">Category</label>
                    <input
                      value={productForm.category}
                      onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. Supplements, Aromatherapy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Ingredients (comma-separated)</label>
                  <input
                    value={productForm.ingredients}
                    onChange={e => setProductForm(f => ({ ...f, ingredients: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Turmeric, Ashwagandha, Spirulina..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Benefits (comma-separated)</label>
                  <input
                    value={productForm.benefits}
                    onChange={e => setProductForm(f => ({ ...f, benefits: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Immune support, Anti-inflammatory..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">How to Use</label>
                  <textarea
                    value={productForm.usage_instructions}
                    onChange={e => setProductForm(f => ({ ...f, usage_instructions: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Usage instructions..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-1">Image</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "product")}
                        className="hidden"
                        id="product-img-upload"
                      />
                      <label
                        htmlFor="product-img-upload"
                        className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-sans text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <ImageIcon size={14} /> {uploading ? "..." : "Upload"}
                      </label>
                      <input
                        value={productForm.image_url}
                        onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Image URL"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-1">Video URL (optional)</label>
                    <input
                      value={productForm.video_url}
                      onChange={e => setProductForm(f => ({ ...f, video_url: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="YouTube or video URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-1">Tags (comma-separated)</label>
                  <input
                    value={productForm.tags}
                    onChange={e => setProductForm(f => ({ ...f, tags: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="organic, vegan, immune"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProduct}
                    disabled={createProduct.isPending || updateProduct.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-sans hover:opacity-90 transition-opacity"
                  >
                    <Save size={14} /> {editingProductId ? "Update" : "Add"} Product
                  </button>
                  <button
                    onClick={() => { setShowProductForm(false); setEditingProductId(null); }}
                    className="px-6 py-3 bg-card border border-border rounded-lg text-sm font-sans text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Product list */}
          {productsLoading ? (
            <p className="text-muted-foreground font-sans text-sm">Loading...</p>
          ) : products.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Package size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground font-sans">No products yet. Add your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  {product.image_url && (
                    <img src={product.image_url} alt="" className="w-16 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-foreground truncate">{product.name}</h4>
                    <span className="text-xs text-accent font-sans uppercase tracking-wider">{product.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditProduct(product)} className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
                      <Edit size={14} className="text-foreground" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 rounded-lg bg-card border border-border hover:bg-destructive/20 transition-colors">
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ MEETINGS TAB ═══════ */}
      {tab === "meetings" && (
        <div>
          {meetingsLoading ? (
            <p className="text-muted-foreground font-sans text-sm">Loading...</p>
          ) : meetings.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Calendar size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground font-sans">No meetings booked yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map(meeting => {
                const statusColors: Record<string, string> = {
                  confirmed: "bg-secondary/15 text-secondary",
                  scheduled: "bg-secondary/15 text-secondary",
                  pending: "bg-amber-100 text-amber-700",
                  completed: "bg-muted text-muted-foreground",
                  cancelled: "bg-destructive/15 text-destructive",
                };
                const statusIcons: Record<string, React.ElementType> = {
                  confirmed: CheckCircle,
                  scheduled: Clock,
                  pending: Clock,
                  completed: CheckCircle,
                  cancelled: Ban,
                };
                const StatusIcon = statusIcons[meeting.status] || Clock;
                const linkValue = meetingLinkInputs[meeting.id] ?? meeting.meeting_link ?? "";

                return (
                  <div key={meeting.id} className="glass-card-elevated rounded-xl p-5 space-y-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <Calendar size={14} className="text-secondary shrink-0" />
                          <span className="font-sans text-sm font-semibold text-foreground">
                            {new Date(meeting.meeting_date).toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric" })}
                          </span>
                          <span className="text-sm text-muted-foreground font-sans">
                            {new Date(meeting.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Video size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-sans">{meeting.platform}</span>
                        </div>
                        {meeting.notes && (
                          <p className="text-xs text-muted-foreground font-sans mt-2 line-clamp-2">{meeting.notes}</p>
                        )}
                      </div>

                      {/* Status badge */}
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium shrink-0 ${statusColors[meeting.status] || ""}`}>
                        <StatusIcon size={12} />
                        {meeting.status}
                      </span>
                    </div>

                    {/* Google Meet Link input */}
                    <div>
                      <label className="block text-xs font-sans font-bold text-foreground mb-1.5">
                        <LinkIcon size={12} className="inline mr-1" />
                        Google Meet Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={linkValue}
                          onChange={e => setMeetingLinkInputs(prev => ({ ...prev, [meeting.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="https://meet.google.com/..."
                        />
                        <button
                          onClick={() => handleSaveMeetingLink(meeting)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-sans font-medium hover:opacity-90 transition-opacity"
                        >
                          <Save size={12} /> Save
                        </button>
                      </div>
                    </div>

                    {/* Status actions */}
                    {meeting.status !== "completed" && meeting.status !== "cancelled" && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {meeting.status !== "confirmed" && (
                          <button
                            onClick={() => handleMeetingStatus(meeting, "confirmed")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans font-medium bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors"
                          >
                            <CheckCircle size={12} /> Confirm
                          </button>
                        )}
                        <button
                          onClick={() => handleMeetingStatus(meeting, "completed")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                        >
                          <CheckCircle size={12} /> Complete
                        </button>
                        <button
                          onClick={() => handleMeetingStatus(meeting, "cancelled")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Ban size={12} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManager;
