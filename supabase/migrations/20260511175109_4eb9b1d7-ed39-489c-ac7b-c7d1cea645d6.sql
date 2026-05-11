-- Trigger to auto-create admin notifications when a new meeting is booked
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_meeting()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
  booker_name text;
BEGIN
  -- Get booker's name from profiles
  SELECT COALESCE(NULLIF(name, ''), email, 'A user') INTO booker_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Insert a notification for every admin
  FOR admin_record IN
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      admin_record.user_id,
      'New Consultation Booking',
      booker_name || ' booked a session for ' ||
        to_char(NEW.meeting_date AT TIME ZONE 'UTC', 'Mon DD, YYYY HH24:MI') ||
        ' UTC via ' || NEW.platform || '.',
      'booking',
      NEW.id
    );
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS meetings_notify_admins ON public.meetings;
CREATE TRIGGER meetings_notify_admins
AFTER INSERT ON public.meetings
FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_new_meeting();

-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;