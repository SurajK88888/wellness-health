import { motion } from "framer-motion";
import aboutImg from "@/assets/about-wellness.jpg";

const AboutSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-wellness">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="rounded-xl overflow-hidden">
              <img src={aboutImg} alt="Wellness meditation at sunrise" loading="lazy" width={1200} height={800} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Our Philosophy</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Wellness Is a Journey, <br />
              <span className="italic font-normal">Not a Destination</span>
            </h2>
            <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
              <p>
                We believe true health starts with understanding. That's why every article we publish, every product we recommend, and every consultation we offer is rooted in evidence-based science and holistic wisdom.
              </p>
              <p>
                Our team of certified nutritionists, fitness experts, and wellness coaches curate content that empowers you to make informed decisions about your health — no gimmicks, no fads.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { num: "200+", label: "Articles" },
                { num: "50+", label: "Guides" },
                { num: "1,000+", label: "Consultations" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl font-bold text-foreground">{stat.num}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
