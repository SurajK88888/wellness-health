import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBlogBySlug } from "@/hooks/use-blogs";
import ReactMarkdown from "react-markdown";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useBlogBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center container-wellness">
          <p className="text-muted-foreground font-sans animate-pulse">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article || error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center container-wellness">
          <h1 className="font-serif text-3xl text-foreground">Article not found</h1>
          <Link to="/blog" className="text-accent mt-4 inline-block">Back to Journal</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-24">
        {/* Hero */}
        {article.featured_image && (
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className={`container-wellness max-w-3xl ${article.featured_image ? "-mt-20" : "pt-8"} relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated rounded-xl p-8 md:p-12"
          >
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft size={14} /> Back to Journal
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{article.category}</span>
              <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-8">
              {article.title}
            </h1>

            {/* Author */}
            {article.author_name && (
              <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center font-serif text-lg font-bold text-secondary">
                  {article.author_name.charAt(0)}
                </div>
                <div>
                  <div className="font-sans font-bold text-foreground text-sm">{article.author_name}</div>
                  <div className="text-xs text-muted-foreground">Wellness Expert</div>
                </div>
              </div>
            )}

            {/* Markdown Body */}
            <div className="prose prose-stone dark:prose-invert max-w-none font-sans leading-[1.8]">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-card text-xs font-sans text-foreground border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-sans">Share this article</span>
              <button className="p-2 rounded-full bg-card hover:bg-muted transition-colors" aria-label="Share">
                <Share2 size={16} className="text-foreground" />
              </button>
              <button className="p-2 rounded-full bg-card hover:bg-muted transition-colors" aria-label="Facebook">
                <Facebook size={16} className="text-foreground" />
              </button>
              <button className="p-2 rounded-full bg-card hover:bg-muted transition-colors" aria-label="Twitter">
                <Twitter size={16} className="text-foreground" />
              </button>
            </div>
          </motion.div>
        </div>
      </article>

      <div className="py-16" />
      <Footer />
    </div>
  );
};

export default BlogPost;
