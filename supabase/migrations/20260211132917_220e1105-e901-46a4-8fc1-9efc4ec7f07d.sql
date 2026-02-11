-- Remove the broken trigger and function that depend on pg_net
DROP TRIGGER IF EXISTS on_waitlist_insert ON public.waitlist;
DROP FUNCTION IF EXISTS public.notify_signup_webhook();