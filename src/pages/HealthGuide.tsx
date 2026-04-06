import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Droplets, Heart, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productSupplements from "@/assets/product-supplements.jpg";
import productOils from "@/assets/product-oils.jpg";
import productTea from "@/assets/product-tea.jpg";

const products = [
  {
    id: "organic-supplements",
    title: "Organic Wellness Supplements",
    subtitle: "Plant-based daily essentials",
    image: productSupplements,
    category: "Supplements",
    ingredients: ["Turmeric Extract", "Ashwagandha Root", "Spirulina", "Vitamin D3 (Lichen)", "Zinc (Plant-based)"],
    benefits: [
      { icon: Shield, text: "Immune system support" },
      { icon: Heart, text: "Cardiovascular health" },
      { icon: Leaf, text: "Anti-inflammatory properties" },
    ],
    howToUse: "Take 2 capsules daily with meals. Best absorbed with healthy fats. Consistent daily use for 4-6 weeks yields optimal results.",
    description: "A synergistic blend of adaptogenic herbs, antioxidants, and essential vitamins sourced from organic farms. Designed to support your body's natural defense and recovery systems.",
  },
  {
    id: "essential-oils",
    title: "Pure Botanical Essential Oils",
    subtitle: "Aromatherapy & topical wellness",
    image: productOils,
    category: "Aromatherapy",
    ingredients: ["Lavandula Angustifolia Oil", "Eucalyptus Globulus Oil", "Tea Tree Oil", "Jojoba Carrier Oil"],
    benefits: [
      { icon: Droplets, text: "Stress & anxiety relief" },
      { icon: Heart, text: "Improved sleep quality" },
      { icon: Shield, text: "Natural antiseptic properties" },
    ],
    howToUse: "Add 3-5 drops to a diffuser for aromatherapy. For topical use, dilute with a carrier oil (included). Perform a patch test before first topical application.",
    description: "100% pure, steam-distilled essential oils sourced from sustainable farms. Each oil is third-party tested for purity and potency. Perfect for creating calming rituals in your daily routine.",
  },
  {
    id: "herbal-tea",
    title: "Herbal Tea Collection",
    subtitle: "Handcrafted healing blends",
    image: productTea,
    category: "Herbal Teas",
    ingredients: ["Chamomile Flowers", "Peppermint Leaves", "Ginger Root", "Lemongrass", "Rooibos"],
    benefits: [
      { icon: Heart, text: "Digestive support" },
      { icon: Leaf, text: "Rich in antioxidants" },
      { icon: Droplets, text: "Calming & relaxing" },
    ],
    howToUse: "Steep 1 tablespoon of loose leaf tea in 200ml of hot water (not boiling) for 5-7 minutes. Enjoy 2-3 cups daily. Can be served hot or iced.",
    description: "Hand-blended from organic, whole-leaf herbs and botanicals. Our teas are caffeine-free and designed to support relaxation, digestion, and overall well-being throughout the day.",
  },
];

const HealthGuide = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const activeProduct = products.find((p) => p.id === selectedProduct);

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
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{product.category}</span>
                    <h3 className="font-serif text-xl font-semibold text-foreground mt-2 mb-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                    <button className="mt-4 text-sm text-accent font-sans font-bold hover:text-secondary transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
                  <img src={activeProduct.image} alt={activeProduct.title} className="w-full h-full object-cover" width={800} height={450} />
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <X size={18} className="text-foreground" />
                </button>
              </div>

              <div className="p-8">
                <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{activeProduct.category}</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-2">{activeProduct.title}</h2>
                <p className="text-muted-foreground font-sans leading-relaxed mb-6">{activeProduct.description}</p>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Key Benefits</h3>
                  <div className="space-y-3">
                    {activeProduct.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-card">
                          <b.icon size={16} className="text-secondary" />
                        </div>
                        <span className="text-sm font-sans text-foreground">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.ingredients.map((ing) => (
                      <span key={ing} className="px-3 py-1 rounded-full bg-card text-xs font-sans text-foreground border border-border">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How to Use */}
                <div className="p-4 rounded-xl bg-card">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">How to Use</h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">{activeProduct.howToUse}</p>
                </div>
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
