import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Ban, CheckCircle, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ContentManager from "@/components/admin/ContentManager";

interface UserRow {
  id: string;
  name: string;
  email: string;
  is_blocked: boolean;
  created_at: string;
  roles: string[];
}

type AdminTab = "users" | "content";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("content");

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: allRoles } = await supabase
      .from("user_roles")
      .select("*");

    const merged = (profiles || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      name: p.name as string,
      email: p.email as string,
      is_blocked: p.is_blocked as boolean,
      created_at: p.created_at as string,
      roles: (allRoles || [])
        .filter((r: Record<string, unknown>) => r.user_id === p.id)
        .map((r: Record<string, unknown>) => r.role as string),
    }));

    setUsers(merged);
    setLoading(false);
  };

  // Fetch users on first tab switch
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (tab === "users" && users.length === 0) fetchUsers();
  };

  const toggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    await supabase
      .from("profiles")
      .update({ is_blocked: !currentlyBlocked })
      .eq("id", userId);
    fetchUsers();
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (isCurrentlyAdmin) {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
    } else {
      await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
    }
    fetchUsers();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 section-padding bg-background">
        <div className="container-wellness">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-secondary" size={24} />
              <p className="text-accent text-sm uppercase tracking-[0.3em] font-sans">Admin Panel</p>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Dashboard</h1>
          </motion.div>

          {/* Admin tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => handleTabChange("content")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-sans font-medium transition-all border-b-2 -mb-px ${
                activeTab === "content" ? "border-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText size={16} /> Content Manager
            </button>
            <button
              onClick={() => handleTabChange("users")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-sans font-medium transition-all border-b-2 -mb-px ${
                activeTab === "users" ? "border-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={16} /> User Management
            </button>
          </div>

          {/* Content Manager Tab */}
          {activeTab === "content" && <ContentManager />}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Total Users", value: users.length, icon: Users },
                  { label: "Admins", value: users.filter(u => u.roles.includes("admin")).length, icon: Shield },
                  { label: "Blocked", value: users.filter(u => u.is_blocked).length, icon: Ban },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="glass-card rounded-xl p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-card">
                      <Icon size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif font-bold text-foreground">{value}</p>
                      <p className="text-sm text-muted-foreground font-sans">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Users table */}
              <div className="glass-card-elevated rounded-xl overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-muted-foreground font-sans">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-sm font-sans font-bold text-foreground">Name</th>
                          <th className="text-left p-4 text-sm font-sans font-bold text-foreground">Email</th>
                          <th className="text-left p-4 text-sm font-sans font-bold text-foreground">Roles</th>
                          <th className="text-left p-4 text-sm font-sans font-bold text-foreground">Status</th>
                          <th className="text-left p-4 text-sm font-sans font-bold text-foreground">Joined</th>
                          <th className="text-right p-4 text-sm font-sans font-bold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                            <td className="p-4 text-sm font-sans text-foreground">{u.name || "—"}</td>
                            <td className="p-4 text-sm font-sans text-muted-foreground">{u.email}</td>
                            <td className="p-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {u.roles.map((r) => (
                                  <span
                                    key={r}
                                    className={`px-2 py-0.5 rounded text-xs font-sans font-medium ${
                                      r === "admin"
                                        ? "bg-secondary/20 text-secondary"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-sans font-medium ${
                                  u.is_blocked
                                    ? "bg-destructive/15 text-destructive"
                                    : "bg-secondary/15 text-secondary"
                                }`}
                              >
                                {u.is_blocked ? <Ban size={12} /> : <CheckCircle size={12} />}
                                {u.is_blocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="p-4 text-sm font-sans text-muted-foreground">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                              {u.id !== user?.id && (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => toggleBlock(u.id, u.is_blocked)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors ${
                                      u.is_blocked
                                        ? "bg-secondary/20 text-secondary hover:bg-secondary/30"
                                        : "bg-destructive/15 text-destructive hover:bg-destructive/25"
                                    }`}
                                  >
                                    {u.is_blocked ? "Unblock" : "Block"}
                                  </button>
                                  <button
                                    onClick={() => toggleAdminRole(u.id, u.roles.includes("admin"))}
                                    className="px-3 py-1.5 rounded-md text-xs font-sans font-medium bg-card border border-border hover:bg-muted transition-colors text-foreground"
                                  >
                                    {u.roles.includes("admin") ? "Remove Admin" : "Make Admin"}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
