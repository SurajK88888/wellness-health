/**
 * RESET PASSWORD PAGE
 * Works with the password recovery flow triggered from ForgotPassword page.
 * See ForgotPassword.tsx for full email domain setup instructions.
 * 
 * The redirectTo URL in ForgotPassword sends users here with a recovery token.
 * Supabase fires a PASSWORD_RECOVERY auth event which this page listens for.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      setLoading(false);
    });

    // Also check hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
    
    // Fallback timeout
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Leaf className="animate-pulse text-secondary" size={40} />
      </div>
    );
  }

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <Leaf className="text-secondary mx-auto mb-4" size={28} />
          <h2 className="font-serif text-xl font-bold text-foreground mb-2">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground font-sans mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Request New Link
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

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
        </div>

        <div className="glass-card-elevated rounded-xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-secondary" size={24} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Password Updated</h3>
              <p className="text-sm text-muted-foreground font-sans">
                Your password has been reset successfully. Redirecting you to the homepage...
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Set New Password</h2>
              <p className="text-sm text-muted-foreground font-sans mb-6">
                Choose a strong password for your Verdant account.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-2">New Password</label>
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
                <div>
                  <label className="block text-sm font-sans font-bold text-foreground mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Re-enter your new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "Updating..." : "Update Password"}
                  {!submitting && <ArrowRight size={16} />}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
