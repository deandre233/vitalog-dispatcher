import { Location } from "./crewRecommendation";

export interface TrafficPrediction {
  congestionLevel: "low" | "medium" | "high";
  predictedDelayMinutes: number;
  confidence: number;
}

export interface RouteRecommendation {
  route: {
    coordinates: [number, number][];
    distance: number;
    duration: number;
  };
  trafficPrediction: TrafficPrediction;
  alternativeRoutes: {
    coordinates: [number, number][];
    distance: number;
    duration: number;
  }[];
}

export interface GeofenceAlert {
  type: "entry" | "exit";
  location: Location;
  timestamp: string;
  vehicleId: string;
}

export function predictTraffic(
  origin: Location,
  destination: Location,
  departureTime: Date
): TrafficPrediction {
  // This would integrate with real traffic APIs
  // For now, using mock data
  const hour = departureTime.getHours();
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
  
  return {
    congestionLevel: isRushHour ? "high" : "medium",
    predictedDelayMinutes: isRushHour ? 15 : 5,
    confidence: 0.85
  };
}

export function optimizeRoute(
  origin: Location,
  destination: Location,
  departureTime: Date
): RouteRecommendation {
  const traffic = predictTraffic(origin, destination, departureTime);
  
  // Mock route calculation - would use actual routing service
  const baseRoute = {
    coordinates: [
      [origin.lng, origin.lat],
      [destination.lng, destination.lat]
    ],
    distance: calculateDistance(origin, destination),
    duration: calculateBaseDuration(origin, destination, traffic)
  };

  return {
    route: baseRoute,
    trafficPrediction: traffic,
    alternativeRoutes: [
      {
        coordinates: [
          [origin.lng, origin.lat],
          [origin.lng + 0.01, origin.lat + 0.01],
          [destination.lng, destination.lat]
        ],
        distance: baseRoute.distance * 1.1,
        duration: baseRoute.duration * 1.2
      }
    ]
  };
}

export function checkGeofence(
  vehicleLocation: Location,
  targetLocation: Location,
  radius: number
): GeofenceAlert | null {
  const distance = calculateDistance(vehicleLocation, targetLocation);
  
  if (distance <= radius) {
    return {
      type: "entry",
      location: targetLocation,
      timestamp: new Date().toISOString(),
      vehicleId: "mock-vehicle-id"
    };
  }
  
  return null;
}

function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateBaseDuration(
  origin: Location,
  destination: Location,
  traffic: TrafficPrediction
): number {
  const distance = calculateDistance(origin, destination);
  const baseMinutes = (distance / 50) * 60; // Assuming 50 km/h average speed
  return baseMinutes + traffic.predictedDelayMinutes;
}