import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogProtein from "@/assets/blog-protein.jpg";
import blogYoga from "@/assets/blog-yoga.jpg";
import blogNutrition from "@/assets/blog-nutrition.jpg";
import blogMindfulness from "@/assets/blog-mindfulness.jpg";
import consultantImg from "@/assets/consultant.jpg";

const articles: Record<string, {
  title: string; image: string; author: string; authorImg: string;
  date: string; readTime: string; category: string;
  content: string[];
}> = {
  "natural-protein-muscle-recovery": {
    title: "5 Benefits of Natural Protein for Muscle Recovery",
    image: blogProtein,
    author: "Dr. Elena Park",
    authorImg: consultantImg,
    date: "March 15, 2026",
    readTime: "6 min read",
    category: "Nutrition",
    content: [
      "Natural protein sources have been a cornerstone of traditional diets for centuries. Unlike processed supplements, whole food proteins come packed with co-factors, enzymes, and micronutrients that enhance absorption and utilization by your body.",
      "**1. Enhanced Bioavailability** — Plant-based proteins from sources like hemp, pea, and brown rice offer complete amino acid profiles when combined properly. Studies show that whole food proteins are absorbed 15-20% more efficiently than isolated supplements.",
      "**2. Reduced Inflammation** — Natural proteins contain anti-inflammatory compounds that synthetic alternatives lack. Omega-3 fatty acids found in hemp protein, for example, actively reduce exercise-induced inflammation.",
      "**3. Gut Health Support** — Whole food proteins come with natural fiber and prebiotics that support your gut microbiome. A healthy gut means better nutrient absorption and faster recovery times.",
      "**4. Sustained Energy Release** — Unlike whey isolates that spike insulin, natural proteins provide a slow, steady release of amino acids. This means more consistent energy throughout your workout and recovery period.",
      "**5. Long-term Sustainability** — Research from the Journal of Sports Nutrition suggests that athletes who rely on whole food protein sources maintain muscle mass more effectively over 5+ year periods compared to those using only supplements.",
      "The key takeaway? Prioritize whole foods first. Use supplements only to fill gaps, not as your primary protein source. Your body will thank you with better recovery, less inflammation, and sustained performance.",
    ],
  },
  "morning-yoga-routine": {
    title: "The Morning Yoga Routine That Changed Everything",
    image: blogYoga,
    author: "Maya Chen",
    authorImg: consultantImg,
    date: "March 10, 2026",
    readTime: "5 min read",
    category: "Fitness",
    content: [
      "For years, I struggled with morning stiffness and mental fog. Then I discovered a simple 15-minute yoga flow that transformed not just my mornings, but my entire approach to wellness.",
      "The routine begins with three minutes of conscious breathing — nothing complicated, just deep belly breaths that activate your parasympathetic nervous system and signal to your body that it's time to wake gently.",
      "Next comes a series of gentle spinal movements: cat-cow stretches, seated twists, and a modified sun salutation. These movements increase synovial fluid in your joints, which is essentially your body's natural lubricant.",
      "The middle section focuses on standing poses — warrior variations and tree pose — that build heat and improve balance. These poses engage your core and strengthen the stabilizer muscles that protect your joints throughout the day.",
      "The final five minutes are dedicated to restorative poses and a brief meditation. This is where the real magic happens. The combination of physical movement and mental stillness creates a state of calm alertness that lasts for hours.",
      "After six months of consistent practice, I noticed improvements in sleep quality, reduced anxiety, better digestion, and a 40% reduction in chronic lower back pain. The science backs this up — regular morning yoga practice has been shown to regulate cortisol levels and improve heart rate variability.",
      "Start tomorrow. Just 15 minutes. Your body and mind will respond faster than you think.",
    ],
  },
  "balanced-meal-prep": {
    title: "Balanced Meal Prep: A Week of Whole Foods",
    image: blogNutrition,
    author: "Chef Liam Torres",
    authorImg: consultantImg,
    date: "March 5, 2026",
    readTime: "8 min read",
    category: "Nutrition",
    content: [
      "Meal prep doesn't have to be complicated. In fact, the best meal prep strategies are built on simplicity — a handful of versatile base ingredients that can be combined in different ways throughout the week.",
      "Start with your grains. Cook a large batch of quinoa and brown rice on Sunday. These form the foundation of at least five different meals. Both store well for up to five days when refrigerated properly.",
      "Next, prepare your proteins. Roast a tray of chickpeas with cumin and paprika. Bake tofu with a tamari-ginger glaze. If you eat animal protein, a simple herb-roasted chicken breast works wonderfully.",
      "Vegetables are where creativity shines. Roast a rainbow: sweet potatoes, broccoli, bell peppers, and red onions. Raw options like shredded cabbage, cucumber, and cherry tomatoes add freshness and crunch.",
      "The secret weapon? Sauces and dressings. A tahini-lemon dressing, a green herb chimichurri, and a simple olive oil-balsamic vinaigrette can transform the same base ingredients into completely different meals.",
      "Monday's bowl might be quinoa + roasted chickpeas + roasted vegetables + tahini dressing. Wednesday's lunch could be brown rice + baked tofu + raw vegetables + chimichurri. Same prep, entirely different experience.",
      "This approach saves time, reduces food waste, and ensures you're eating nutrient-dense whole foods every day without the mental fatigue of daily cooking decisions.",
    ],
  },
  "mindfulness-forest-bathing": {
    title: "Forest Bathing: The Science of Mindful Nature Walks",
    image: blogMindfulness,
    author: "Dr. Aiko Sato",
    authorImg: consultantImg,
    date: "February 28, 2026",
    readTime: "7 min read",
    category: "Lifestyle",
    content: [
      "Shinrin-yoku, or 'forest bathing,' is the Japanese practice of immersing yourself in nature through slow, mindful walks. What began as folk wisdom is now backed by rigorous scientific research.",
      "Studies from Chiba University show that spending just two hours in a forest environment reduces cortisol levels by 16%, lowers blood pressure by 2%, and decreases heart rate by 4% compared to urban environments.",
      "The mechanism is fascinating. Trees release phytoncides — organic compounds that protect them from insects. When we breathe these in, our bodies respond by increasing natural killer (NK) cell activity, which boosts our immune system for up to 30 days after a single forest visit.",
      "But forest bathing isn't just about walking through trees. It's about engaging all five senses mindfully. Touch the bark. Listen to birdsong. Smell the earth after rain. Watch light filter through leaves. Even taste the fresh air.",
      "For urban dwellers without easy forest access, research suggests that even 20 minutes in a park with mature trees provides measurable benefits. The key is slow, intentional presence — no phones, no podcasts, no goals other than being.",
      "Start small. Find a green space near you. Walk slowly. Breathe deeply. Pay attention. This simple practice may be one of the most powerful wellness tools available — and it's completely free.",
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const article = articles[slug || ""];

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center container-wellness">
          <h1 className="font-serif text-3xl text-foreground">Article not found</h1>
          <Link to="/blog" className="text-accent mt-4 inline-block">Back to Journal</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-24">
        {/* Hero */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" width={800} height={600} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="container-wellness max-w-3xl -mt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated rounded-xl p-8 md:p-12"
          >
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft size={14} /> Back to Journal
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-widest text-accent font-sans font-bold">{article.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{article.readTime}</span>
              <span className="text-xs text-muted-foreground">{article.date}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-8">
              {article.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
              <img src={article.authorImg} alt={article.author} className="w-12 h-12 rounded-full object-cover" loading="lazy" width={48} height={48} />
              <div>
                <div className="font-sans font-bold text-foreground text-sm">{article.author}</div>
                <div className="text-xs text-muted-foreground">Wellness Expert</div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-6">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-foreground/80 font-sans leading-[1.8] text-base">
                  {paragraph.split(/(\*\*.*?\*\*)/).map((part, pi) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={pi} className="text-foreground font-bold">{part.slice(2, -2)}</strong>
                    ) : (
                      <span key={pi}>{part}</span>
                    )
                  )}
                </p>
              ))}
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-sans">Share this article</span>
              <button className="p-2 rounded-full bg-card hover:bg-muted transition-colors" aria-label="Share">
                <Share2 size={16} className="text-foreground" />
              </button>
              <button className="p-2 rounded-full bg-card hover:bg-muted transition-colors" aria-label="Facebook">
                <Facebook size={16} className="text-foreground" />
              </button>
              <button className="p-2 rounded-full bg-card hover:bg-muted transition-colors" aria-label="Twitter">
                <Twitter size={16} className="text-foreground" />
              </button>
            </div>
          </motion.div>
        </div>
      </article>

      <div className="py-16" />
      <Footer />
    </div>
  );
};

export default BlogPost;
