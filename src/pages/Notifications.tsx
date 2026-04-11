import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, useNotificationMutations } from "@/hooks/use-notifications";
import { formatDistanceToNow, format } from "date-fns";

const typeLabels: Record<string, { emoji: string; color: string }> = {
  booking: { emoji: "📅", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  confirmed: { emoji: "✅", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  link_added: { emoji: "🔗", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  registration: { emoji: "👤", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
  cancellation: { emoji: "❌", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  general: { emoji: "🔔", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
};

const Notifications = () => {
  const { user } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications(user?.id);
  const { markAsRead, markAllAsRead } = useNotificationMutations();

  const unread = notifications.filter((n) => !n.is_read);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 section-padding bg-background">
        <div className="container-wellness max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-accent text-sm uppercase tracking-[0.3em] mb-2 font-sans">Inbox</p>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Notifications</h1>
              </div>
              {unread.length > 0 && user && (
                <button
                  onClick={() => markAllAsRead.mutate(user.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-sans hover:opacity-90 transition-opacity"
                >
                  <CheckCheck size={14} /> Mark all as read
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="text-muted-foreground font-sans text-sm">Loading...</p>
            ) : notifications.length === 0 ? (
              <div className="glass-card rounded-xl p-16 text-center">
                <Bell size={40} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground font-sans">
                  You'll see updates about your consultations and account activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => {
                  const meta = typeLabels[n.type] || typeLabels.general;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`glass-card rounded-xl p-5 border transition-all ${
                        !n.is_read
                          ? "border-secondary/40 bg-accent/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-2xl mt-0.5">{meta.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-sm font-sans ${!n.is_read ? "font-bold text-foreground" : "text-foreground"}`}>
                              {n.title}
                            </h3>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                            )}
                            <span className={`ml-auto text-[10px] font-sans px-2 py-0.5 rounded-full ${meta.color}`}>
                              {n.type.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-sans mb-2">{n.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground/70 font-sans">
                              {format(new Date(n.created_at), "MMM d, yyyy 'at' h:mm a")} · {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </p>
                            {!n.is_read && (
                              <button
                                onClick={() => markAsRead.mutate(n.id)}
                                className="text-xs font-sans text-accent hover:text-foreground transition-colors"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
