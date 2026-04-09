import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Droplets, Heart, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { useProducts } from "@/hooks/use-products";

// Fallback icons for dynamically loaded products
const iconMap: Record<string, React.ElementType> = {
  "Immune": Shield,
  "Heart": Heart,
  "Anti": Leaf,
  "Stress": Droplets,
  "Sleep": Heart,
  "Digest": Heart,
  "Antioxid": Leaf,
  "Calm": Droplets,
};

function getBenefitIcon(text: string) {
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (text.toLowerCase().includes(key.toLowerCase())) return Icon;
  }
  return Leaf;
}

const HealthGuide = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: products = [], isLoading } = useProducts(activeCategory, search);
  const activeProduct = products.find((p) => p.id === selectedProduct);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const getIngredients = (p: typeof products[0]): string[] => {
    if (Array.isArray(p.ingredients)) return p.ingredients as string[];
    return [];
  };
  const getBenefits = (p: typeof products[0]): string[] => {
    if (Array.isArray(p.benefits)) return p.benefits as string[];
    return [];
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 section-padding bg-background">
        <div className="container-wellness">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Curated Wellness</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground">Health Guide</h1>
            <p className="mt-4 text-muted-foreground font-sans max-w-lg mx-auto">
              Our favorite wellness products — explained, not sold. Ingredients, benefits, and usage guides to help you choose wisely.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
            <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-sans animate-pulse">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-sans">
                {search ? `No products found for "${search}"` : "No products available yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="glass-card-elevated rounded-xl overflow-hidden hover-lift">
                    {product.image_url && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{product.category}</span>
                      <h3 className="font-serif text-xl font-semibold text-foreground mt-2 mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <button className="mt-4 text-sm text-accent font-sans font-bold hover:text-secondary transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card-elevated rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {activeProduct.image_url && (
                  <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
                    <img src={activeProduct.image_url} alt={activeProduct.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <X size={18} className="text-foreground" />
                </button>
              </div>

              <div className="p-8">
                <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{activeProduct.category}</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-2">{activeProduct.name}</h2>
                <p className="text-muted-foreground font-sans leading-relaxed mb-6">{activeProduct.description}</p>

                {/* Video */}
                {activeProduct.video_url && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Watch Video</h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-card">
                      <iframe
                        src={activeProduct.video_url}
                        title={activeProduct.name}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {getBenefits(activeProduct).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Key Benefits</h3>
                    <div className="space-y-3">
                      {getBenefits(activeProduct).map((b, i) => {
                        const Icon = getBenefitIcon(b);
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-card">
                              <Icon size={16} className="text-secondary" />
                            </div>
                            <span className="text-sm font-sans text-foreground">{b}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {getIngredients(activeProduct).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {getIngredients(activeProduct).map((ing) => (
                        <span key={ing} className="px-3 py-1 rounded-full bg-card text-xs font-sans text-foreground border border-border">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* How to Use */}
                {activeProduct.usage_instructions && (
                  <div className="p-4 rounded-xl bg-card">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">How to Use</h3>
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed">{activeProduct.usage_instructions}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default HealthGuide;
