
-- Add sender_name to team_messages table
ALTER TABLE public.team_messages ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Update the column for real-time notifications
ALTER PUBLICATION supabase_realtime DROP TABLE public.team_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;
