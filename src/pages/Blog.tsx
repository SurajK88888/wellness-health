import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogProtein from "@/assets/blog-protein.jpg";
import blogYoga from "@/assets/blog-yoga.jpg";
import blogNutrition from "@/assets/blog-nutrition.jpg";
import blogMindfulness from "@/assets/blog-mindfulness.jpg";

const allArticles = [
  {
    slug: "natural-protein-muscle-recovery",
    title: "5 Benefits of Natural Protein for Muscle Recovery",
    excerpt: "Discover how plant-based proteins support recovery and long-term muscle health.",
    category: "Nutrition",
    readTime: "6 min read",
    image: blogProtein,
    author: "Dr. Elena Park",
    date: "March 15, 2026",
  },
  {
    slug: "morning-yoga-routine",
    title: "The Morning Yoga Routine That Changed Everything",
    excerpt: "A gentle 15-minute flow designed to align your body and calm your mind.",
    category: "Fitness",
    readTime: "5 min read",
    image: blogYoga,
    author: "Maya Chen",
    date: "March 10, 2026",
  },
  {
    slug: "balanced-meal-prep",
    title: "Balanced Meal Prep: A Week of Whole Foods",
    excerpt: "Simple, nutrient-dense meal ideas that make healthy eating effortless.",
    category: "Nutrition",
    readTime: "8 min read",
    image: blogNutrition,
    author: "Chef Liam Torres",
    date: "March 5, 2026",
  },
  {
    slug: "mindfulness-forest-bathing",
    title: "Forest Bathing: The Science of Mindful Nature Walks",
    excerpt: "How spending time in nature reduces cortisol, boosts immunity, and restores mental clarity.",
    category: "Lifestyle",
    readTime: "7 min read",
    image: blogMindfulness,
    author: "Dr. Aiko Sato",
    date: "February 28, 2026",
  },
];

const categories = ["All", "Nutrition", "Fitness", "Lifestyle"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? allArticles
    : allArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-8 section-padding bg-background">
        <div className="container-wellness">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">The Journal</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground">Wellness Insights</h1>
            <p className="mt-4 text-muted-foreground font-sans max-w-lg mx-auto">
              Evidence-based articles on nutrition, fitness, mindfulness, and living well.
            </p>
          </motion.div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-sans tracking-wide transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link to={`/blog/${article.slug}`} className="group block">
                  <div className="glass-card rounded-xl overflow-hidden hover-lift">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{article.category}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{article.readTime}</span>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                      </div>
                      <h2 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">{article.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-sans">By {article.author}</span>
                        <span className="flex items-center gap-1 text-sm text-accent font-sans font-bold group-hover:gap-2 transition-all">
                          Read <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
