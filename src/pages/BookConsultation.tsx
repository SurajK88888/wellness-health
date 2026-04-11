import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import consultantImg from "@/assets/consultant.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useMeetingMutations, useUserMeetings } from "@/hooks/use-meetings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MeetingCard, { MeetingEmptyState } from "@/components/MeetingCard";
import { createNotification } from "@/hooks/use-notifications";

const BookConsultation = () => {
  const { user } = useAuth();
  const { data: meetings = [] } = useUserMeetings(user?.id);
  const { createMeeting, updateMeeting } = useMeetingMutations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "Zoom",
    notes: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.date || !formData.time) {
      toast.error("Please select a date and time");
      return;
    }

    setSubmitting(true);
    try {
      const meetingDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      const result = await createMeeting.mutateAsync({
        user_id: user.id,
        meeting_date: meetingDate,
        platform: formData.platform,
        notes: formData.notes || null,
        meeting_link: null,
        status: "pending",
      });

      // Notify all admins about new booking
      const { data: adminRoles } = await (await import("@/integrations/supabase/client")).supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (adminRoles) {
        for (const admin of adminRoles) {
          await createNotification({
            userId: admin.user_id,
            title: "New Consultation Booking",
            message: `${formData.name} booked a session for ${new Date(meetingDate).toLocaleString()} via ${formData.platform}.`,
            type: "booking",
            relatedId: result?.id,
          });
        }
      }

      // Trigger admin email alert via Edge Function
      supabase.functions.invoke("notify-booking", {
        body: {
          userName: formData.name,
          meetingDate,
          platform: formData.platform,
          notes: formData.notes,
        },
      }).catch(console.error); // fire-and-forget

      toast.success("Consultation booked! You'll receive a meeting link via email.");
      setFormData({ name: "", email: "", platform: "Zoom", notes: "", date: "", time: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this meeting?")) return;
    try {
      await updateMeeting.mutateAsync({ id, status: "cancelled" });
      toast.success("Meeting cancelled");
    } catch (err: any) { toast.error(err.message); }
  };

  const upcomingMeetings = meetings.filter(m => m.status === "scheduled" || m.status === "pending" || m.status === "confirmed");
  const pastMeetings = meetings.filter(m => m.status === "completed" || m.status === "cancelled");

  // Generate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 section-padding bg-background">
        <div className="container-wellness">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3 font-sans">Get Started</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground">Book a Consultation</h1>
            <p className="mt-4 text-muted-foreground font-sans max-w-lg mx-auto">
              Connect with a certified wellness expert for personalized guidance on your health journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card-elevated rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <img src={consultantImg} alt="Wellness consultant" className="w-16 h-16 rounded-full object-cover" loading="lazy" width={64} height={64} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Dr. Sarah Mitchell</h3>
                    <p className="text-sm text-muted-foreground">Certified Wellness Consultant</p>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Free 30-Minute Wellness Session
                </h2>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Clock, text: "30 minutes" },
                    { icon: Video, text: "Via Zoom or Google Meet" },
                    { icon: Calendar, text: "Flexible scheduling" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-card">
                        <Icon size={16} className="text-secondary" />
                      </div>
                      <span className="text-sm font-sans text-foreground">{text}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-serif font-semibold text-foreground mb-3">What to Expect</h3>
                <div className="space-y-3">
                  {[
                    "Personalized wellness assessment",
                    "Nutrition and lifestyle recommendations",
                    "Custom action plan for your goals",
                    "Follow-up resources via email",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-secondary mt-0.5 shrink-0" />
                      <span className="text-sm font-sans text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right - Booking form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card-elevated rounded-xl p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">Schedule Your Session</h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-sans font-bold text-foreground mb-2">Date</label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={formData.date}
                        onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-bold text-foreground mb-2">Time</label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">Preferred Platform</label>
                    <div className="flex gap-3">
                      {["Zoom", "Google Meet"].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border cursor-pointer hover:border-accent transition-colors flex-1">
                          <input
                            type="radio"
                            name="platform"
                            value={platform}
                            checked={formData.platform === platform}
                            onChange={e => setFormData(f => ({ ...f, platform: e.target.value }))}
                            className="accent-secondary"
                          />
                          <span className="text-sm font-sans text-foreground">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-bold text-foreground mb-2">What would you like to discuss?</label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder="Share your wellness goals or concerns..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? "Booking..." : "Book Free Health Consultation"}
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll receive a confirmation email with your meeting link within 24 hours.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>

          {/* My Meetings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">My Meetings</h2>

            {meetings.length === 0 ? (
              <MeetingEmptyState />
            ) : (
              <>
                {upcomingMeetings.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-4">Upcoming</h3>
                    <div className="space-y-4">
                      {upcomingMeetings.map(meeting => (
                        <MeetingCard key={meeting.id} meeting={meeting} onCancel={handleCancel} />
                      ))}
                    </div>
                  </div>
                )}

                {pastMeetings.length > 0 && (
                  <div>
                    <h3 className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-4">Past</h3>
                    <div className="space-y-4">
                      {pastMeetings.map(meeting => (
                        <MeetingCard key={meeting.id} meeting={meeting} showActions={false} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookConsultation;
