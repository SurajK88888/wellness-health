import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, useUnreadCount, useNotificationMutations } from "@/hooks/use-notifications";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<string, string> = {
  booking: "📅",
  confirmed: "✅",
  link_added: "🔗",
  registration: "👤",
  cancellation: "❌",
  general: "🔔",
};

const NotificationDropdown = () => {
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications(user?.id);
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);
  const { markAsRead, markAllAsRead } = useNotificationMutations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const latest = notifications.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-sans text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && user && (
                <button
                  onClick={() => markAllAsRead.mutate(user.id)}
                  className="text-xs font-sans text-accent hover:text-foreground transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {latest.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={24} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-sans">No notifications yet</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {latest.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.is_read) markAsRead.mutate(n.id);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                      !n.is_read ? "bg-accent/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5">{typeIcons[n.type] || "🔔"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-sans truncate ${!n.is_read ? "font-bold text-foreground" : "text-foreground"}`}>
                            {n.title}
                          </p>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-sans line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/70 font-sans mt-1">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-sans font-bold text-accent hover:text-foreground py-3 border-t border-border transition-colors"
            >
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
