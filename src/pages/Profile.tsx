import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save, Leaf, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WELLNESS_OPTIONS = [
  "Nutrition", "Herbal Medicine", "Meditation", "Yoga",
  "Sleep Health", "Stress Management", "Fitness", "Mindfulness",
  "Gut Health", "Skin Care", "Detox", "Immunity",
];

const Profile = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      const prefs = (profile.preferences as Record<string, unknown>)?.wellness_interests;
      if (Array.isArray(prefs)) setPreferences(prefs as string[]);
    }
  }, [profile]);

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        preferences: { wellness_interests: preferences },
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-wellness pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground font-sans inline-flex items-center gap-1 mb-8"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <User className="text-secondary" size={24} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Your Profile</h1>
              <p className="text-sm text-muted-foreground font-sans">Manage your wellness journey details</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Personal Info */}
            <div className="glass-card-elevated rounded-xl p-6 space-y-5">
              <h2 className="font-serif text-lg font-semibold text-foreground">Personal Information</h2>
              <div>
                <label className="block text-sm font-sans font-bold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-sans font-bold text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground font-sans text-sm cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground font-sans mt-1">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>
            </div>

            {/* Wellness Preferences */}
            <div className="glass-card-elevated rounded-xl p-6 space-y-5">
              <h2 className="font-serif text-lg font-semibold text-foreground">Wellness Interests</h2>
              <p className="text-sm text-muted-foreground font-sans">
                Select topics you're interested in to personalize your experience.
              </p>
              <div className="flex flex-wrap gap-2">
                {WELLNESS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => togglePreference(option)}
                    className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-200 border ${
                      preferences.includes(option)
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? "Saving..." : "Save Changes"}
              {!saving && <Save size={16} />}
            </button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
