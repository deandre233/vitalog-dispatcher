import type { Location } from "@/utils/crewRecommendation";

export interface VehicleLocation {
  id: string;
  vehicleId: string;
  location: Location;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdated: string;
  crew?: string[];
  currentDispatch?: string;
}

export interface MapFilters {
  showActiveVehicles: boolean;
  showInactiveVehicles: boolean;
  showMaintenanceVehicles: boolean;
  showTrafficLayer: boolean;
  showWeatherLayer: boolean;
}

export interface AIMapInsight {
  type: 'traffic' | 'weather' | 'coverage' | 'demand';
  severity: 'low' | 'medium' | 'high';
  message: string;
  location?: Location;
  recommendation?: string;
}