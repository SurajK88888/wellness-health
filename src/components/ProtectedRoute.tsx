import { Navigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { session, loading, isAdmin, isBlocked } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Leaf className="animate-pulse text-secondary" size={40} />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="glass-card-elevated rounded-xl p-8 max-w-md text-center">
          <h2 className="font-serif text-xl font-bold text-foreground mb-3">Account Restricted</h2>
          <p className="text-sm text-muted-foreground font-sans">
            Your account has been restricted. Contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
