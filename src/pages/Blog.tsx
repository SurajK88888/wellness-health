import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { usePublishedBlogs } from "@/hooks/use-blogs";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { data: blogs = [], isLoading } = usePublishedBlogs(activeCategory, search);

  // Derive categories from fetched blogs
  const categories = ["All", ...Array.from(new Set(blogs.map(b => b.category)))];

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

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
            <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Articles grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-sans animate-pulse">Loading articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-sans">
                {search ? `No articles found for "${search}"` : "No articles published yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link to={`/blog/${article.slug}`} className="group block">
                    <div className="glass-card rounded-xl overflow-hidden hover-lift">
                      {article.featured_image && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{article.category}</span>
                          <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <h2 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">{article.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-sans">By {article.author_name}</span>
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
