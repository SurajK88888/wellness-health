import { motion } from "framer-motion";
import { Video, Calendar, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import consultantImg from "@/assets/consultant.jpg";

const BookConsultation = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 section-padding bg-background">
        <div className="container-wellness">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Get Started</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground">Book a Consultation</h1>
            <p className="mt-4 text-muted-foreground font-sans max-w-lg mx-auto">
              Connect with a certified wellness expert for personalized guidance on your health journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card-elevated rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <img src={consultantImg} alt="Wellness consultant" className="w-16 h-16 rounded-full object-cover" loading="lazy" width={64} height={64} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Dr. Sarah Mitchell</h3>
                    <p className="text-sm text-muted-foreground">Certified Wellness Consultant</p>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Free 30-Minute Wellness Session
                </h2>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Clock, text: "30 minutes" },
                    { icon: Video, text: "Via Zoom or Google Meet" },
                    { icon: Calendar, text: "Flexible scheduling" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-card">
                        <Icon size={16} className="text-secondary" />
                      </div>
                      <span className="text-sm font-sans text-foreground">{text}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-serif font-semibold text-foreground mb-3">What to Expect</h3>
                <div className="space-y-3">
                  {[
                    "Personalized wellness assessment",
                    "Nutrition and lifestyle recommendations",
                    "Custom action plan for your goals",
                    "Follow-up resources via email",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-secondary mt-0.5 shrink-0" />
                      <span className="text-sm font-sans text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right - Booking form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card-elevated rounded-xl p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">Schedule Your Session</h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.open("https://calendly.com", "_blank");
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">Preferred Platform</label>
                    <div className="flex gap-3">
                      {["Zoom", "Google Meet"].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border cursor-pointer hover:border-accent transition-colors flex-1">
                          <input type="radio" name="platform" value={platform} defaultChecked={platform === "Zoom"} className="accent-secondary" />
                          <span className="text-sm font-sans text-foreground">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">What would you like to discuss?</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder="Share your wellness goals or concerns..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Book Free Health Consultation
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll receive a confirmation email with your meeting link within 24 hours.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookConsultation;
