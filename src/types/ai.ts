export interface AIInsight {
  type: 'optimization' | 'warning' | 'prediction';
  message: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export interface AIRecommendation {
  id: string;
  type: string;
  prediction: string;
  confidence_score: number;
  metadata: Record<string, any>;
  created_at: string;
  recommendation?: string;
  suggestions?: string[];
}