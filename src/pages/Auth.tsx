import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Leaf, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Leaf className="animate-pulse text-secondary" size={40} />
      </div>
    );
  }

  if (session) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Leaf className="text-secondary" size={28} />
            <span className="font-serif text-2xl font-bold text-foreground">Verdant</span>
          </Link>
          <p className="text-sm text-muted-foreground font-sans">
            Your wellness journey is secure and private
          </p>
        </div>

        <div className="glass-card-elevated rounded-xl p-8">
          {/* Tab toggle */}
          <div className="flex mb-8 bg-card rounded-lg p-1">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2.5 text-sm font-sans font-medium rounded-md transition-all duration-200 ${
                  mode === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <SignupForm onSuccess={() => setMode("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const LoginForm = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-sans font-bold text-foreground mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-sans font-bold text-foreground mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent pr-12"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-xs text-muted-foreground hover:text-foreground font-sans transition-colors"
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? "Signing in..." : "Sign In"}
        {!submitting && <ArrowRight size={16} />}
      </button>
    </form>
  );
};

const SignupForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="text-secondary" size={24} />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Check your email</h3>
        <p className="text-sm text-muted-foreground font-sans mb-4">
          We've sent a verification link to <strong>{email}</strong>. Please verify your email before signing in.
        </p>
        <button
          onClick={onSuccess}
          className="text-sm text-secondary hover:underline font-sans"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-sans font-bold text-foreground mb-2">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-sans font-bold text-foreground mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-sans font-bold text-foreground mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent pr-12"
            placeholder="At least 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? "Creating account..." : "Create Account"}
        {!submitting && <ArrowRight size={16} />}
      </button>
    </form>
  );
};

export default Auth;
