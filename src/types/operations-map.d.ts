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

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface RouteOptions {
  optimizeWaypoints?: boolean;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  departureTime?: Date;
}