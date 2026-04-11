-- Drop the overly permissive policy
DROP POLICY "System can insert notifications" ON public.notifications;

-- Replace with a policy that allows users to insert notifications targeting themselves or others (for trigger logic)
-- The actual notification creation will happen from authenticated context
CREATE POLICY "Authenticated users can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (user_id IS NOT NULL);