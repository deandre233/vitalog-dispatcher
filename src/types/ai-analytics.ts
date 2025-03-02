
export interface AIPrediction {
  id: string;
  type: 'transport' | 'billing' | 'scheduling' | 'resource';
  confidence: number;
  prediction: string;
  recommendation: string;
  createdAt: string;
  metadata: Record<string, any>;
}

export interface AIMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'neutral';
  percentageChange?: number;
  description: string;
}

export interface AIDashboardData {
  predictions: AIPrediction[];
  metrics: AIMetric[];
  insights: string[];
}
