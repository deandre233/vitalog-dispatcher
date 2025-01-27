export interface AIInsight {
  type: 'optimization' | 'warning' | 'prediction';
  message: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}