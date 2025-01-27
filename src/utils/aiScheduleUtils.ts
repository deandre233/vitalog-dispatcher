import { TrafficData, WeatherData, AIRecommendation, ScheduleBlock } from '../data/mockScheduleData';

export const calculateRiskScore = (
  traffic: TrafficData,
  weather: WeatherData,
  priority: ScheduleBlock['priority']
): number => {
  let score = 0;
  
  // Traffic impact
  if (traffic.severity === 'high') score += 30;
  else if (traffic.severity === 'medium') score += 20;
  else score += 10;
  
  // Weather impact
  if (weather.impact === 'high') score += 30;
  else if (weather.impact === 'medium') score += 20;
  else score += 10;
  
  // Priority impact
  if (priority === 'emergency') score += 40;
  else if (priority === 'urgent') score += 30;
  else score += 20;
  
  return Math.min(score, 100);
};

export const generateOptimizationSuggestions = (
  block: ScheduleBlock,
  trafficPatterns: Record<number, TrafficData>
): string[] => {
  const suggestions: string[] = [];
  const hour = new Date(block.startTime).getHours();
  
  if (trafficPatterns[hour]?.severity === 'high') {
    suggestions.push('Consider rescheduling to avoid peak traffic');
    suggestions.push('Alternative routes recommended');
  }
  
  if (block.weather.impact === 'high') {
    suggestions.push('Add weather delay buffer');
    suggestions.push('Check road conditions before dispatch');
  }
  
  if (block.priority === 'emergency') {
    suggestions.push('Notify emergency services for route clearance');
    suggestions.push('Prepare backup unit for critical transport');
  }
  
  return suggestions;
};

export const analyzeResourceUtilization = (
  blocks: ScheduleBlock[],
  totalUnits: number
): {
  utilizationRate: number;
  recommendations: AIRecommendation[];
} => {
  const activeBlocks = blocks.filter(b => b.status === 'in-progress').length;
  const utilizationRate = (activeBlocks / totalUnits) * 100;
  
  const recommendations: AIRecommendation[] = [];
  
  if (utilizationRate > 90) {
    recommendations.push({
      type: 'staffing',
      priority: 'high',
      description: 'High utilization detected. Consider adding additional units.',
      confidence: 0.95,
      impact: {
        timesSaved: 45,
        costReduction: 10,
        satisfactionImprovement: 15
      }
    });
  }
  
  if (utilizationRate < 50) {
    recommendations.push({
      type: 'staffing',
      priority: 'medium',
      description: 'Low utilization detected. Consider optimizing unit distribution.',
      confidence: 0.85,
      impact: {
        timesSaved: 30,
        costReduction: 20,
        satisfactionImprovement: 5
      }
    });
  }
  
  return {
    utilizationRate,
    recommendations
  };
};

export const predictFutureLoad = (
  blocks: ScheduleBlock[],
  hours: number = 24
): {
  predictions: Array<{ hour: number; load: 'low' | 'medium' | 'high' }>;
  confidence: number;
} => {
  const predictions = Array.from({ length: hours }, (_, i) => {
    const hour = i;
    const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
    const isBusinessHour = hour >= 9 && hour <= 17;
    
    return {
      hour,
      load: isPeakHour ? 'high' : isBusinessHour ? 'medium' : 'low'
    };
  });
  
  return {
    predictions,
    confidence: 0.85
  };
};