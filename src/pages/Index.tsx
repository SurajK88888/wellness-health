import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import ProductPreview from "@/components/home/ProductPreview";
import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import NewsletterSection from "@/components/home/NewsletterSection";
import FAQSection from "@/components/home/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedArticles />
      <ProductPreview />
      <AboutSection />
      <TestimonialsSection />
      <ConsultationCTA />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
