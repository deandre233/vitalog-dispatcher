export interface RouteData {
  distance: string;
  duration: string;
  start_location: {
    lat: number;
    lng: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
}

export interface VehicleLocation {
  id: string;
  vehicleId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  lastUpdated: string;
  crew: string[];
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
  location?: {
    lat: number;
    lng: number;
  };
  recommendation?: string;
}