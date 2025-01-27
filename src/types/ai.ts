export interface AIRecommendation {
  id: string;
  suggestions: string[];
  confidence_score: number;
  created_at: string;
  metadata: Record<string, any>;
  prediction?: string;
  recommendation?: string;
}