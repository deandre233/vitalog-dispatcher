
export type CongestionLevel = "low" | "medium" | "high";

export interface TrafficStatus {
  congestionLevel: CongestionLevel;
  estimatedDelay: number;
  alternateRouteAvailable: boolean;
}

export interface AIRecommendations {
  route: string;
  crew: string;
  billing: string;
  insights?: string[];
  trafficStatus?: TrafficStatus;
}

export interface Patient {
  name: string;
  dob?: string;
  condition?: string;
  id: string;
}

export interface DispatchData {
  id: string;
  activationTime: string;
  patient: Patient;
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  assignedTo: string;
  aiRecommendations: AIRecommendations;
  eta: string;
  comments?: string;
  warnings?: string;
  progress?: number;
  elapsedTime?: string;
  lastUpdated?: string;
  efficiency?: number;
}

export interface BoardStats {
  totalActive: number;
  unassigned: number;
  inProgress: number;
  highPriority: number;
  averageResponse: number;
  systemEfficiency: string;
}
