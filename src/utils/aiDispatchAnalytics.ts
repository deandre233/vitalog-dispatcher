import { toast } from "sonner";
import { getTrafficInfo } from "./aiDispatchUtils";
import { calculateDistance, type CrewMember, type Location } from "./crewRecommendation";

export interface DispatchAnalytics {
  efficiency: number;
  suggestedActions: string[];
  riskLevel: "low" | "medium" | "high";
  performanceMetrics: {
    responseTime: number;
    patientSatisfaction: number;
    routeEfficiency: number;
  };
}

export interface WeatherCondition {
  condition: "clear" | "rain" | "snow" | "fog";
  severity: "low" | "medium" | "high";
}

// Mock weather data - in real implementation, this would call a weather API
export const getWeatherConditions = (location: Location): WeatherCondition => {
  const conditions = ["clear", "rain", "snow", "fog"] as const;
  const severities = ["low", "medium", "high"] as const;
  return {
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    severity: severities[Math.floor(Math.random() * severities.length)]
  };
};

export const analyzeDispatchEfficiency = (
  origin: Location,
  destination: Location,
  assignedCrew?: CrewMember,
  elapsedTime?: string
): DispatchAnalytics => {
  const trafficInfo = getTrafficInfo(origin, destination);
  const weather = getWeatherConditions(origin);
  const distance = calculateDistance(origin, destination);
  
  // Calculate base efficiency score
  let efficiency = 100;
  const suggestedActions: string[] = [];
  
  // Traffic impact
  if (trafficInfo.congestionLevel === "high") {
    efficiency -= 20;
    suggestedActions.push("Consider alternate route due to heavy traffic");
  } else if (trafficInfo.congestionLevel === "medium") {
    efficiency -= 10;
    suggestedActions.push("Monitor traffic conditions for potential delays");
  }
  
  // Weather impact
  if (weather.condition !== "clear") {
    const weatherImpact = weather.severity === "high" ? 15 : weather.severity === "medium" ? 10 : 5;
    efficiency -= weatherImpact;
    suggestedActions.push(`Adjust ETA for ${weather.condition} conditions`);
  }
  
  // Distance efficiency
  if (distance > 20) {
    efficiency -= 5;
    suggestedActions.push("Consider closer crew assignment for long-distance dispatch");
  }
  
  // Crew assignment check
  if (!assignedCrew) {
    efficiency -= 25;
    suggestedActions.push("Immediate crew assignment needed");
  }
  
  // Calculate risk level
  const riskLevel = efficiency > 80 ? "low" : efficiency > 60 ? "medium" : "high";
  
  // Mock performance metrics
  const performanceMetrics = {
    responseTime: Math.round(distance * 2 + (trafficInfo.delayMinutes || 0)),
    patientSatisfaction: Math.round(efficiency),
    routeEfficiency: Math.round(efficiency * 0.8)
  };
  
  return {
    efficiency,
    suggestedActions,
    riskLevel,
    performanceMetrics
  };
};

export const monitorDispatchProgress = (
  currentStatus: string,
  elapsedTime: string,
  expectedDuration: number
): void => {
  const elapsedMinutes = parseInt(elapsedTime);
  
  if (elapsedMinutes > expectedDuration * 1.2) {
    toast.warning("Dispatch is taking longer than expected", {
      description: "Consider checking for delays or issues"
    });
  }
  
  if (currentStatus === "en route" && elapsedMinutes > expectedDuration * 0.5) {
    toast.info("Dispatch halfway point reached", {
      description: "Monitoring progress and conditions"
    });
  }
};

export const generateAIInsights = (analytics: DispatchAnalytics): string[] => {
  const insights: string[] = [];
  
  if (analytics.efficiency < 70) {
    insights.push("AI suggests immediate optimization needed");
  }
  
  if (analytics.performanceMetrics.responseTime > 15) {
    insights.push("Response time above target threshold");
  }
  
  if (analytics.riskLevel === "high") {
    insights.push("High-risk dispatch detected - extra monitoring recommended");
  }
  
  return insights;
};