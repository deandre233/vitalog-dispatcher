
import { Json } from '@/integrations/supabase/types';

export interface Partner {
  id: string;
  name: string;
  partnership_type: string;
  status: string;
  location?: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  relationship_manager?: string;
  last_interaction?: string;
  satisfaction_score?: number;
  contract_start_date: string;
  contract_end_date: string;
  ai_recommendations: Json;
  performance_metrics?: Json;
  partnership_score?: number;
  next_review_date?: string;
  risk_assessment?: string;
  created_at: string;
  updated_at: string;
}
