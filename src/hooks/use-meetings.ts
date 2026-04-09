import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Meeting {
  id: string;
  user_id: string;
  meeting_link: string | null;
  meeting_date: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
  platform: string;
  created_at: string;
}

export function useUserMeetings(userId: string | undefined) {
  return useQuery({
    queryKey: ["meetings", "user", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", userId)
        .order("meeting_date", { ascending: true });
      if (error) throw error;
      return (data || []) as Meeting[];
    },
    enabled: !!userId,
  });
}

export function useAllMeetings() {
  return useQuery({
    queryKey: ["meetings", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("meeting_date", { ascending: false });
      if (error) throw error;
      return (data || []) as Meeting[];
    },
  });
}

export function useMeetingMutations() {
  const qc = useQueryClient();

  const createMeeting = useMutation({
    mutationFn: async (meeting: Omit<Meeting, "id" | "created_at">) => {
      const { data, error } = await supabase.from("meetings").insert(meeting).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });

  const updateMeeting = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Meeting> & { id: string }) => {
      const { data, error } = await supabase.from("meetings").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });

  return { createMeeting, updateMeeting };
}
