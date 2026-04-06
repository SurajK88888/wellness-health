import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What kind of content does Verdant publish?",
    a: "We publish evidence-based articles on nutrition, fitness, mindfulness, and holistic wellness. Our content is reviewed by certified health professionals.",
  },
  {
    q: "Are the product recommendations unbiased?",
    a: "Absolutely. Our Health Guide section is purely educational. We don't sell products — we provide ingredient breakdowns, benefits, and usage guides to help you make informed choices.",
  },
  {
    q: "How does the consultation process work?",
    a: "Book a free 30-minute session through our booking page. You'll receive a Zoom or Google Meet link via email. Our certified wellness experts will provide personalized guidance.",
  },
  {
    q: "Is the consultation really free?",
    a: "Yes, your first consultation is completely free. We believe in building trust through value before anything else.",
  },
  {
    q: "Can I contribute articles to Verdant?",
    a: "We welcome guest contributors! If you're a certified health professional or experienced wellness writer, reach out via our contact email.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-wellness max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Questions?</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Frequently Asked</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass-card rounded-xl px-6 border-none">
                <AccordionTrigger className="font-serif text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
