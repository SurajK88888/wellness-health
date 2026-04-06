import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Serene forest" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wellness text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary-foreground/80 text-sm uppercase tracking-[0.3em] mb-6 font-sans"
        >
          Wellness • Knowledge • Balance
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto"
        >
          Nourish Your Body.{" "}
          <span className="italic font-normal">Elevate Your Mind.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed"
        >
          Expert-curated wellness content, health guides, and personalized
          consultations to help you thrive naturally.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/blog"
            className="px-8 py-4 bg-primary-foreground/90 text-foreground font-sans text-sm tracking-wide rounded-lg hover:bg-primary-foreground transition-colors duration-300"
          >
            Explore Wellness
          </Link>
          <Link
            to="/book-consultation"
            className="px-8 py-4 border border-primary-foreground/40 text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:bg-primary-foreground/10 transition-colors duration-300"
          >
            Book Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
