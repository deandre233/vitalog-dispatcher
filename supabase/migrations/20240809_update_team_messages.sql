
-- Add announcement and reactions fields to team_messages table
ALTER TABLE public.team_messages 
  ADD COLUMN IF NOT EXISTS is_announcement BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sender_name TEXT DEFAULT NULL;

-- Update the column for real-time notifications
ALTER PUBLICATION supabase_realtime DROP TABLE public.team_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;
