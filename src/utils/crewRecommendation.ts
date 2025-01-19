export interface Location {
  lat: number;
  lng: number;
}

export interface CrewMember {
  id: number;
  name: string;
  certification: string;
  location: Location;
  available: boolean;
}

interface RouteInfo {
  distance: number;
  duration: number;
  route?: {
    geometry: {
      type: string;
      coordinates: number[][];
    };
  };
}

export interface CrewWithRoute extends CrewMember {
  routeInfo: RouteInfo;
}

interface Dispatch {
  id: number;
  origin: Location;
  serviceType: string;
}

// Mock data for crew members
export const crewMembers: CrewMember[] = [
  { 
    id: 1, 
    name: "John Doe", 
    certification: "BLS", 
    location: { lat: 33.7765, lng: -84.3963 }, 
    available: true 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    certification: "ALS", 
    location: { lat: 33.7795, lng: -84.3921 }, 
    available: true 
  }
];

// Calculate distance between two locations using Haversine formula
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
    Math.cos(loc1.lat * Math.PI / 180) * 
    Math.cos(loc2.lat * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in km
}

// Recommend crew based on proximity and availability
export function recommendCrew(dispatch: Dispatch): CrewMember | null {
  const availableCrew = crewMembers.filter(crew => crew.available);
  
  if (availableCrew.length === 0) {
    return null;
  }

  const crewWithDistances = availableCrew.map(crew => ({
    ...crew,
    distance: calculateDistance(crew.location, dispatch.origin)
  }));

  crewWithDistances.sort((a, b) => a.distance - b.distance);

  return crewWithDistances[0];
}

// Mock function to simulate route calculation
export async function recommendCrewWithRoute({ origin, serviceType }: { origin: Location; serviceType: string }): Promise<CrewWithRoute> {
  const closestCrew = recommendCrew({ id: 1, origin, serviceType });
  
  if (!closestCrew) {
    throw new Error('No available crew members');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    ...closestCrew,
    routeInfo: {
      distance: calculateDistance(closestCrew.location, origin),
      duration: calculateDistance(closestCrew.location, origin) * 2, // Rough estimate
      route: {
        geometry: {
          type: 'LineString',
          coordinates: [
            [closestCrew.location.lng, closestCrew.location.lat],
            [origin.lng, origin.lat]
          ]
        }
      }
    }
  };
}