import { CrewMember, Location } from "./crewRecommendation";

export interface PerformanceMetrics {
  responseTime: number;
  patientSatisfaction: number;
  completedDispatches: number;
  efficiency: number;
}

export interface TrafficInfo {
  congestionLevel: "low" | "medium" | "high";
  delayMinutes: number;
  alternateRouteAvailable: boolean;
}

export function analyzeCrewPerformance(crew: CrewMember): PerformanceMetrics {
  return {
    responseTime: Math.floor(Math.random() * 15) + 5,
    patientSatisfaction: Math.floor(Math.random() * 20) + 80,
    completedDispatches: Math.floor(Math.random() * 50) + 10,
    efficiency: Math.floor(Math.random() * 20) + 80,
  };
}

export function getTrafficInfo(origin: Location, destination: Location): TrafficInfo {
  // Mock traffic data - in a real app, this would fetch from a traffic API
  const congestionLevels = ["low", "medium", "high"] as const;
  const randomIndex = Math.floor(Math.random() * 3);
  
  return {
    congestionLevel: congestionLevels[randomIndex],
    delayMinutes: Math.floor(Math.random() * 15),
    alternateRouteAvailable: Math.random() > 0.5,
  };
}

export function calculateSkillMatch(crewCertification: string, requiredService: string): number {
  if (crewCertification === requiredService) return 1;
  if (crewCertification === "ALS" && requiredService === "BLS") return 0.8;
  return 0.4;
}