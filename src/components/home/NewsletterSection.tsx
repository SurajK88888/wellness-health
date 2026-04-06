import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-wellness max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Stay Connected</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Weekly Wellness Insights
          </h2>
          <p className="text-muted-foreground font-sans mb-8">
            Join 10,000+ readers. Get curated articles, health tips, and exclusive content delivered to your inbox.
          </p>

          {submitted ? (
            <p className="text-secondary font-sans font-bold text-lg">Thank you! Welcome to the community. 🌿</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-5 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Subscribe <Send size={14} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
