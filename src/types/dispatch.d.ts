export type ViewType = 'active' | 'schedule' | 'calendar';

export interface Dispatch {
  id: string;
  activationTime: string;
  patient: {
    id: string;
    name: string;
    condition?: string;
  };
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  assignedTo: string;
  eta: string;
  comments?: string;
  warnings?: string;
  progress?: number;
  elapsedTime?: string;
  lastUpdated?: string;
  efficiency?: number;
  aiRecommendations: {
    route: string;
    crew: string;
    billing: string;
    insights?: string[];
    trafficStatus?: {
      congestionLevel: "low" | "medium" | "high";
      estimatedDelay: number;
      alternateRouteAvailable: boolean;
    };
  };
}

export interface TransportRecord {
  id: string;
  patient_id?: string;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date?: string;
  status: string;
  crew_assigned?: string;
  notes?: string;
  warnings?: string[];
  origin_address?: string;
  destination_address?: string;
  scheduled_time?: string;
  dispatch_status?: string;
  transport_type?: string;
}