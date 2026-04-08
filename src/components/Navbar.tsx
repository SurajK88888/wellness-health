import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { session, isAdmin, signOut, profile } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Journal" },
    { to: "/health-guide", label: "Health Guide" },
    ...(session ? [{ to: "/book-consultation", label: "Book Consultation" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container-wellness flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-serif text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Verdant
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-sans tracking-wide transition-colors duration-200 ${
                location.pathname === link.to
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
              >
                {profile?.name || profile?.email || "Profile"}
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={16} className="text-foreground" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-sans rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "light" ? <Moon size={16} className="text-foreground" /> : <Sun size={16} className="text-foreground" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile toggles */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-card border border-border"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} className="text-foreground" /> : <Sun size={16} className="text-foreground" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border overflow-hidden"
          >
            <div className="container-wellness py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-sans tracking-wide py-2 ${
                    location.pathname === link.to
                      ? "text-foreground font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-sans text-muted-foreground py-2"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleSignOut(); }}
                    className="text-sm font-sans text-muted-foreground py-2 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-sans text-foreground font-bold py-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
