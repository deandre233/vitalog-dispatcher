import { CrewMember, Location } from "./crewRecommendation";

export interface PerformanceMetrics {
  responseTime: number;
  patientSatisfaction: number;
  completedDispatches: number;
}

export interface TrafficInfo {
  congestionLevel: "low" | "medium" | "high";
  delayMinutes: number;
  alternateRouteAvailable: boolean;
}

export function analyzeCrewPerformance(crew: CrewMember): PerformanceMetrics {
  // Mock performance metrics - in a real app, this would fetch from a database
  return {
    responseTime: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
    patientSatisfaction: Math.floor(Math.random() * 20) + 80, // 80-100%
    completedDispatches: Math.floor(Math.random() * 50) + 10, // 10-60 dispatches
  };
}

export function getTrafficInfo(origin: Location, destination: Location): TrafficInfo {
  // Mock traffic data - in a real app, this would fetch from a traffic API
  const congestionLevels = ["low", "medium", "high"] as const;
  return {
    congestionLevel: congestionLevels[Math.floor(Math.random() * 3)],
    delayMinutes: Math.floor(Math.random() * 15),
    alternateRouteAvailable: Math.random() > 0.5,
  };
}

export function calculateSkillMatch(crewCertification: string, requiredService: string): number {
  // Simple skill matching logic
  if (crewCertification === requiredService) return 1;
  if (crewCertification === "ALS" && requiredService === "BLS") return 0.8;
  return 0.4;
}