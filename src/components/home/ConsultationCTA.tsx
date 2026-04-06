import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import consultantImg from "@/assets/consultant.jpg";

const ConsultationCTA = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-wellness">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary-foreground/60 text-sm uppercase tracking-[0.3em] mb-3 font-sans">Personalized Guidance</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-6">
              Ready to Transform <br />
              <span className="italic font-normal">Your Wellness Journey?</span>
            </h2>
            <p className="text-primary-foreground/70 font-sans leading-relaxed mb-8">
              Book a free 30-minute consultation with one of our certified wellness experts. Get personalized recommendations via Zoom or Google Meet.
            </p>
            <Link
              to="/book-consultation"
              className="inline-block px-8 py-4 bg-primary-foreground text-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              Book Free Consultation
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary-foreground/10">
              <img src={consultantImg} alt="Wellness consultant" loading="lazy" width={600} height={600} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
