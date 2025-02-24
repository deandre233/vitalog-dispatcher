
export interface AIRecommendation {
  type: string;
  message: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}

export interface AIAnalysisResult {
  id: string;
  patient_id: string;
  transport_id: string;
  analysis_type: string;
  analysis_data: {
    efficiency_score: number;
    communication_score: number;
    teamwork_score: number;
    technical_skills: number;
    training_needs: string[];
    growth_opportunities: string[];
    performance_insights: string;
  };
  suggestions: string[];
  confidence_score: number;
  prediction: string;
  recommendation: string;
  metadata: Record<string, any>;
  created_at: string;
}
