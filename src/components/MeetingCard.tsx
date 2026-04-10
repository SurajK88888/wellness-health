import { motion } from "framer-motion";
import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import type { Meeting } from "@/hooks/use-meetings";

const statusConfig = {
  confirmed: { label: "Confirmed", bg: "bg-secondary/15", text: "text-secondary", dot: "bg-secondary" },
  scheduled: { label: "Scheduled", bg: "bg-secondary/15", text: "text-secondary", dot: "bg-secondary" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  completed: { label: "Completed", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  cancelled: { label: "Cancelled", bg: "bg-destructive/15", text: "text-destructive", dot: "bg-destructive" },
} as const;

interface MeetingCardProps {
  meeting: Meeting;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

const GoogleMeetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00897B"/>
    <path d="M15.5 8.5L17 7v10l-1.5-1.5V8.5z" fill="#fff"/>
    <path d="M7 8.5h7v7H7z" fill="#fff" fillOpacity="0.9"/>
    <path d="M8 9.5h5v5H8z" fill="#00897B" fillOpacity="0.3"/>
  </svg>
);

const MeetingCard = ({ meeting, onCancel, showActions = true }: MeetingCardProps) => {
  const date = new Date(meeting.meeting_date);
  const status = statusConfig[meeting.status] || statusConfig.scheduled;
  const canJoin = (meeting.status === "confirmed" || meeting.status === "scheduled") && !!meeting.meeting_link;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title */}
          <h4 className="font-serif text-base font-semibold text-foreground">
            Wellness Consultation
          </h4>

          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-secondary shrink-0" />
              <span className="text-sm font-sans text-foreground">
                {date.toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-secondary shrink-0" />
              <span className="text-sm font-sans text-foreground">
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* Platform */}
          <div className="flex items-center gap-2">
            <Video size={14} className="text-muted-foreground" />
            <span className="text-xs font-sans text-muted-foreground">{meeting.platform}</span>
          </div>

          {/* Notes */}
          {meeting.notes && (
            <p className="text-xs font-sans text-muted-foreground line-clamp-2">{meeting.notes}</p>
          )}
        </div>

        {/* Status badge (top-right) */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium shrink-0 ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {canJoin && (
          <a
            href={meeting.meeting_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-sans font-medium hover:opacity-90 transition-opacity"
          >
            <GoogleMeetIcon />
            Join via Google Meet
            <ExternalLink size={14} />
          </a>
        )}

        {showActions && (meeting.status === "scheduled" || meeting.status === "pending" || meeting.status === "confirmed") && onCancel && (
          <button
            onClick={() => onCancel(meeting.id)}
            className="px-4 py-2 rounded-lg text-xs font-sans font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            Cancel Meeting
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const MeetingEmptyState = () => (
  <div className="rounded-xl border border-border bg-card p-12 text-center">
    <Calendar size={40} className="mx-auto mb-4 text-muted-foreground/50" />
    <h4 className="font-serif text-lg font-semibold text-foreground mb-2">No consultations scheduled yet</h4>
    <p className="text-sm font-sans text-muted-foreground max-w-sm mx-auto">
      Book your first health session above to get started on your wellness journey!
    </p>
  </div>
);

export default MeetingCard;
