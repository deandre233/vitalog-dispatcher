import { CrewMember, Location } from "./crewRecommendation";
import { DispatchAnalytics } from "./aiDispatchAnalytics";

export interface MaintenancePrediction {
  vehicleId: string;
  nextMaintenanceDate: Date;
  maintenanceType: "routine" | "preventive" | "urgent";
  reason: string;
  confidence: number;
}

export interface StaffingPrediction {
  timeSlot: string;
  recommendedStaffCount: number;
  confidence: number;
  reason: string;
}

export interface TrafficPattern {
  timeOfDay: string;
  congestionLevel: "low" | "medium" | "high";
  historicalDelay: number;
  confidence: number;
}

// Mock function to simulate AI learning from historical data
export const analyzeHistoricalData = (
  dispatchAnalytics: DispatchAnalytics[],
  timeframe: "day" | "week" | "month"
): {
  patterns: TrafficPattern[];
  recommendations: string[];
} => {
  // Mock traffic patterns based on time of day
  const patterns: TrafficPattern[] = [
    {
      timeOfDay: "morning",
      congestionLevel: "high",
      historicalDelay: 15,
      confidence: 0.85
    },
    {
      timeOfDay: "afternoon",
      congestionLevel: "medium",
      historicalDelay: 10,
      confidence: 0.75
    }
  ];

  // Mock recommendations based on "analyzed" data
  const recommendations = [
    "Consider adding more crews during morning peak hours",
    "Route optimization suggested for afternoon dispatches"
  ];

  return { patterns, recommendations };
};

// Predict maintenance needs for vehicles
export const predictMaintenance = (vehicleId: string): MaintenancePrediction => {
  const randomConfidence = 0.7 + Math.random() * 0.3;
  const maintenanceTypes: ("routine" | "preventive" | "urgent")[] = ["routine", "preventive", "urgent"];
  const randomType = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];

  return {
    vehicleId,
    nextMaintenanceDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
    maintenanceType: randomType,
    reason: `Based on mileage and usage patterns, ${randomType} maintenance recommended`,
    confidence: randomConfidence
  };
};

// Predict optimal staffing levels
export const predictStaffingNeeds = (
  date: Date,
  location: Location
): StaffingPrediction => {
  const timeSlot = date.getHours() < 12 ? "morning" : 
                   date.getHours() < 18 ? "afternoon" : "evening";
  
  return {
    timeSlot,
    recommendedStaffCount: Math.floor(Math.random() * 5) + 3,
    confidence: 0.8 + Math.random() * 0.2,
    reason: `Historical demand patterns suggest increased staffing needs during ${timeSlot}`
  };
};

// Learn from dispatch outcomes
export const learnFromDispatchOutcome = (
  dispatchId: string,
  actualDuration: number,
  predictedDuration: number,
  actualRoute: Location[],
  predictedRoute: Location[]
): void => {
  // In a real implementation, this would update the AI model
  console.log(`Learning from dispatch ${dispatchId}:`, {
    durationDiff: actualDuration - predictedDuration,
    routeDiff: actualRoute.length - predictedRoute.length
  });
};