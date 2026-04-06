import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import productSupplements from "@/assets/product-supplements.jpg";
import productOils from "@/assets/product-oils.jpg";
import productTea from "@/assets/product-tea.jpg";

const products = [
  { image: productSupplements, title: "Organic Supplements", desc: "Plant-based wellness essentials" },
  { image: productOils, title: "Essential Oils", desc: "Pure botanical aromatherapy" },
  { image: productTea, title: "Herbal Tea Collection", desc: "Handcrafted healing blends" },
];

const ProductPreview = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-wellness">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Curated For You</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Our Favorites</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group"
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
                <div className="p-6 text-center">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/health-guide" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity">
            Explore Health Guide <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductPreview;
