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

interface Dispatch {
  id: string | number;
  origin: Location;
  destination: Location;
  serviceType: string;
}

// Sample data for crew members
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

// Calculate the distance between the dispatch and crew
export function calculateDistance(crew: CrewMember, dispatchLocation: Location): number {
  const R = 6371; // Earth radius in km
  const dLat = (dispatchLocation.lat - crew.location.lat) * Math.PI / 180;
  const dLng = (dispatchLocation.lng - crew.location.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(crew.location.lat * Math.PI / 180) *
    Math.cos(dispatchLocation.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// AI recommends crew based on proximity and availability
export function recommendCrew(dispatch: Dispatch): CrewMember & { distance: number } | null {
  const availableCrew = crewMembers.filter(crew => crew.available);
  if (availableCrew.length === 0) return null;

  const crewWithDistances = availableCrew.map(crew => ({
    ...crew,
    distance: calculateDistance(crew, dispatch.origin)
  }));

  // Sort crew by proximity (shortest distance first)
  crewWithDistances.sort((a, b) => a.distance - b.distance);

  return crewWithDistances[0];
}