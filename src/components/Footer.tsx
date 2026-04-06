import { Link } from "react-router-dom";
import { Mail, Instagram, Youtube, Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wellness py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={20} />
              <span className="font-serif text-xl font-bold">Verdant</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Your trusted wellness companion. Education-first health content and expert consultations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold mb-4 uppercase tracking-widest opacity-60">Explore</h4>
            <div className="flex flex-col gap-3">
              <Link to="/blog" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Journal</Link>
              <Link to="/health-guide" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Health Guide</Link>
              <Link to="/book-consultation" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Consultation</Link>
            </div>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-serif text-sm font-semibold mb-4 uppercase tracking-widest opacity-60">Topics</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm opacity-70">Nutrition</span>
              <span className="text-sm opacity-70">Fitness</span>
              <span className="text-sm opacity-70">Mindfulness</span>
              <span className="text-sm opacity-70">Lifestyle</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-sm font-semibold mb-4 uppercase tracking-widest opacity-60">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@verdant.com" className="text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2">
                <Mail size={14} /> hello@verdant.com
              </a>
              <div className="flex gap-4 mt-2">
                <a href="#" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="YouTube"><Youtube size={18} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-xs opacity-50">© 2026 Verdant Wellness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
