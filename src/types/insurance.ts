import { SearchableItem } from './common';
import { Json } from '@/integrations/supabase/types';

export interface InsuranceRecord extends SearchableItem {
  id: string; // Required by SearchableItem
  patient_id?: string;
  type: string;
  carrier_type: string;
  carrier_name: string;
  policy_number: string;
  phone?: string;
  claims_zip?: string;
  activation_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InsuranceAnalysis {
  validation: {
    status: 'valid' | 'incomplete' | 'invalid';
    issues: string[];
  };
  suggestions: string[];
  coverage_gaps: string[];
  optimization: {
    recommendations: string[];
    potential_savings?: string;
  };
  compliance: {
    flags: string[];
    required_actions: string[];
  };
}

export interface AIAnalysisResult {
  efficiency_score: number;
  communication_score: number;
  teamwork_score: number;
  technical_skills: number;
  training_needs: string[];
  growth_opportunities: string[];
  performance_insights: string;
}