
-- Create tables for employee notifications and location tracking

-- Table for employee notifications
CREATE TABLE IF NOT EXISTS public.employee_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'achievement')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_metadata JSONB
);

-- Table for tracking achievement progress
CREATE TABLE IF NOT EXISTS public.employee_achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for employee location tracking
CREATE TABLE IF NOT EXISTS public.employee_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_on_clock BOOLEAN NOT NULL DEFAULT true
);

-- Add RLS policies
ALTER TABLE public.employee_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_locations ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Employees can view their own notifications"
  ON public.employee_notifications
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.employees WHERE id = employee_id
  ));

CREATE POLICY "Employees can update their own notifications"
  ON public.employee_notifications
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.employees WHERE id = employee_id
  ));

-- Achievement progress policies
CREATE POLICY "Employees can view their own achievement progress"
  ON public.employee_achievement_progress
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.employees WHERE id = employee_id
  ));

-- Location policies
CREATE POLICY "Employees can insert their own location"
  ON public.employee_locations
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.employees WHERE id = employee_id
  ));

CREATE POLICY "Employees can view their own locations"
  ON public.employee_locations
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.employees WHERE id = employee_id
  ));

CREATE POLICY "Supervisors can view employee locations"
  ON public.employee_locations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employee_roles er
      JOIN public.employees e ON er.employee_id = e.id
      WHERE e.user_id = auth.uid() AND er.role_name IN ('supervisor', 'manager', 'administrator')
    )
  );

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_locations;
