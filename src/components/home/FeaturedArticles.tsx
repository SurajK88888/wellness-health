import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { usePublishedBlogs } from "@/hooks/use-blogs";

const FeaturedArticles = () => {
  const { data: articles = [] } = usePublishedBlogs();
  const featured = articles.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-wellness">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">From The Journal</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Featured Articles</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link to={`/blog/${article.slug}`} className="group block">
                <div className="glass-card rounded-xl overflow-hidden hover-lift">
                  {article.featured_image && (
                    <div className="aspect-[4/3] overflow-hidden">
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
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm text-accent font-sans font-bold group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/blog" className="inline-flex items-center gap-2 text-foreground font-sans text-sm tracking-wide border-b border-foreground/30 pb-1 hover:border-foreground transition-colors">
            View All Articles <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
