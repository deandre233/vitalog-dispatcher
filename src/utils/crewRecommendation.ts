interface Location {
  lat: number;
  lng: number;
}

interface CrewMember {
  id: number;
  name: string;
  certification: string;
  location: Location;
  available: boolean;
}

interface RouteInfo {
  distance: number;
  duration: number;
  route: any; // Mapbox route response
}

export const crewMembers: CrewMember[] = [
  {
    id: 1,
    name: "John Doe",
    certification: "BLS",
    location: { lat: 33.7765, lng: -84.3963 },
    available: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    certification: "ALS",
    location: { lat: 33.7795, lng: -84.3921 },
    available: true,
  },
];

// Calculate the straight-line distance between two points
export function calculateDistance(crew: CrewMember, origin: Location): number {
  const R = 6371; // Earth radius in km
  const dLat = (origin.lat - crew.location.lat) * Math.PI / 180;
  const dLng = (origin.lng - crew.location.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(crew.location.lat * Math.PI / 180) *
    Math.cos(origin.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get route information using Mapbox Directions API
async function getRouteInfo(start: Location, end: Location): Promise<RouteInfo> {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?access_token=${mapboxgl.accessToken}`
  );
  const data = await response.json();
  
  if (data.routes && data.routes.length > 0) {
    return {
      distance: data.routes[0].distance / 1000, // Convert to kilometers
      duration: data.routes[0].duration / 60, // Convert to minutes
      route: data.routes[0]
    };
  }
  
  throw new Error('No route found');
}

// Recommend crew based on proximity and route information
export async function recommendCrewWithRoute(dispatch: { origin: Location, serviceType: string }): Promise<(CrewMember & { routeInfo: RouteInfo }) | null> {
  const availableCrew = crewMembers.filter(crew => crew.available);
  if (availableCrew.length === 0) return null;

  // Get route information for all available crews
  const crewWithRoutes = await Promise.all(
    availableCrew.map(async (crew) => {
      try {
        const routeInfo = await getRouteInfo(crew.location, dispatch.origin);
        return { ...crew, routeInfo };
      } catch (error) {
        console.error(`Failed to get route for crew ${crew.id}:`, error);
        // Fallback to straight-line distance if route calculation fails
        return {
          ...crew,
          routeInfo: {
            distance: calculateDistance(crew, dispatch.origin),
            duration: calculateDistance(crew, dispatch.origin) * 2, // Rough estimate
            route: null
          }
        };
      }
    })
  );

  // Sort by duration and return the best option
  crewWithRoutes.sort((a, b) => a.routeInfo.duration - b.routeInfo.duration);
  return crewWithRoutes[0];
}