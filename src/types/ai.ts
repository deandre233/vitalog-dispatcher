export interface AIInsight {
  type: 'optimization' | 'warning' | 'prediction';
  message: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}