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
  suggestions: string[];
  confidence_score: number;
  prediction: string;
  recommendation: string;
  metadata: Record<string, any>;
  created_at: string;
}