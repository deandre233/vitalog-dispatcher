import { format, addHours, subHours } from 'date-fns';

export interface TrafficData {
  severity: 'low' | 'medium' | 'high';
  predictedDelay: number;
  alternateRoutes: boolean;
  confidence: number;
}

export interface WeatherData {
  condition: 'clear' | 'rain' | 'snow' | 'cloudy';
  temperature: number;
  visibility: 'good' | 'moderate' | 'poor';
  impact: 'low' | 'medium' | 'high';
}

export interface ResourceMetrics {
  utilizationRate: number;
  availableUnits: number;
  activeDispatches: number;
  pendingAssignments: number;
}

export interface AIRecommendation {
  type: 'scheduling' | 'routing' | 'staffing' | 'weather' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
  description: string;
  confidence: number;
  impact: {
    timesSaved: number;
    costReduction: number;
    satisfactionImprovement: number;
  };
}

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  assignedUnit: string;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  traffic: TrafficData;
  weather: WeatherData;
  aiInsights: {
    riskScore: number;
    optimizationSuggestions: string[];
    predictedDelays: number;
  };
}

const now = new Date();

export const mockTrafficPatterns: Record<number, TrafficData> = {
  7: { severity: 'high', predictedDelay: 25, alternateRoutes: true, confidence: 0.9 },
  8: { severity: 'high', predictedDelay: 30, alternateRoutes: true, confidence: 0.95 },
  9: { severity: 'medium', predictedDelay: 15, alternateRoutes: true, confidence: 0.85 },
  16: { severity: 'high', predictedDelay: 25, alternateRoutes: true, confidence: 0.9 },
  17: { severity: 'high', predictedDelay: 30, alternateRoutes: true, confidence: 0.95 },
  18: { severity: 'medium', predictedDelay: 20, alternateRoutes: true, confidence: 0.85 }
};

export const mockWeatherData: WeatherData = {
  condition: 'clear',
  temperature: 72,
  visibility: 'good',
  impact: 'low'
};

export const mockResourceMetrics: ResourceMetrics = {
  utilizationRate: 75,
  availableUnits: 8,
  activeDispatches: 12,
  pendingAssignments: 5
};

export const mockAIRecommendations: AIRecommendation[] = [
  {
    type: 'scheduling',
    priority: 'high',
    description: 'Redistribute 3 transports from peak hours to reduce congestion',
    confidence: 0.92,
    impact: {
      timesSaved: 45,
      costReduction: 15,
      satisfactionImprovement: 12
    }
  },
  {
    type: 'routing',
    priority: 'medium',
    description: 'Alternative routes available for afternoon dispatches due to construction',
    confidence: 0.85,
    impact: {
      timesSaved: 30,
      costReduction: 10,
      satisfactionImprovement: 8
    }
  },
  {
    type: 'staffing',
    priority: 'high',
    description: 'Additional crew recommended for peak hours based on historical patterns',
    confidence: 0.88,
    impact: {
      timesSaved: 60,
      costReduction: 20,
      satisfactionImprovement: 15
    }
  },
  {
    type: 'weather',
    priority: 'medium',
    description: 'Incoming weather system may affect evening transports',
    confidence: 0.75,
    impact: {
      timesSaved: 20,
      costReduction: 5,
      satisfactionImprovement: 5
    }
  }
];

export const mockScheduleBlocks: ScheduleBlock[] = [
  {
    id: 'SCH-001',
    title: 'Emergency Transport - Downtown',
    startTime: format(addHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    endTime: format(addHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    assignedUnit: 'UNIT-A1',
    priority: 'emergency',
    status: 'scheduled',
    traffic: {
      severity: 'high',
      predictedDelay: 15,
      alternateRoutes: true,
      confidence: 0.9
    },
    weather: mockWeatherData,
    aiInsights: {
      riskScore: 75,
      optimizationSuggestions: [
        'Consider alternate route via 5th Street',
        'High traffic expected - add 15min buffer'
      ],
      predictedDelays: 15
    }
  },
  {
    id: 'SCH-002',
    title: 'Routine Transfer - Northside',
    startTime: format(addHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    endTime: format(addHours(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
    assignedUnit: 'UNIT-B2',
    priority: 'routine',
    status: 'scheduled',
    traffic: {
      severity: 'medium',
      predictedDelay: 10,
      alternateRoutes: false,
      confidence: 0.85
    },
    weather: mockWeatherData,
    aiInsights: {
      riskScore: 45,
      optimizationSuggestions: [
        'Optimal route confirmed',
        'Consider combining with nearby transfer'
      ],
      predictedDelays: 10
    }
  },
  {
    id: 'SCH-003',
    title: 'Urgent Care Transfer - Eastside',
    startTime: format(addHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    endTime: format(addHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    assignedUnit: 'UNIT-C3',
    priority: 'urgent',
    status: 'in-progress',
    traffic: {
      severity: 'low',
      predictedDelay: 5,
      alternateRoutes: true,
      confidence: 0.95
    },
    weather: mockWeatherData,
    aiInsights: {
      riskScore: 60,
      optimizationSuggestions: [
        'Route optimization available',
        'Consider weather impact on return trip'
      ],
      predictedDelays: 5
    }
  }
];

export const mockPerformanceMetrics = {
  responseTime: {
    average: 12,
    trend: 'improving',
    benchmark: 15
  },
  resourceUtilization: {
    current: 85,
    optimal: 90,
    trend: 'stable'
  },
  patientSatisfaction: {
    score: 4.5,
    responses: 150,
    trend: 'improving'
  },
  dispatchEfficiency: {
    onTime: 92,
    delayed: 8,
    averageDelay: 7
  }
};

export const mockAIAnalytics = {
  predictedDemand: {
    morning: 'high',
    afternoon: 'medium',
    evening: 'low',
    confidence: 0.88
  },
  resourceOptimization: {
    suggestions: [
      'Add 2 units during 8-10 AM',
      'Redistribute evening resources',
      'Optimize crew breaks during low demand'
    ],
    potentialImpact: {
      costSavings: '15%',
      efficiencyGain: '22%'
    }
  },
  riskAssessment: {
    overallRisk: 'medium',
    factors: [
      { name: 'Weather', risk: 'low' },
      { name: 'Traffic', risk: 'high' },
      { name: 'Resource Availability', risk: 'medium' }
    ]
  }
};