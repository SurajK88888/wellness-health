import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "The consultation completely changed my approach to nutrition. I feel more energized and balanced than ever.",
    role: "Wellness Journey Member",
  },
  {
    name: "James K.",
    text: "The articles on this platform are incredibly well-researched. It's like having a health magazine tailored just for you.",
    role: "Regular Reader",
  },
  {
    name: "Priya L.",
    text: "I love that the product guides explain everything without pushing purchases. It's truly education-first.",
    role: "Health Enthusiast",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-wellness">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">What People Say</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Trusted by Thousands</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card rounded-xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground font-sans leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <div className="font-serif font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
