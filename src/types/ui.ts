import type { Json } from '@/integrations/supabase/types'

export interface UIPanel {
  id: string
  name: string
  content: Json
  visibility_rule?: string
  linked_page_id?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface UIAction {
  id: string
  action_name: string
  trigger_element: string
  linked_page_id?: string
  linked_panel_id?: string
  event_handler?: Json
  created_at?: string
  updated_at?: string
}