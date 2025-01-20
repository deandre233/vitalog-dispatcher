import { supabase } from "@/integrations/supabase/client";

export interface Location {
  lat: number;
  lng: number;
}

export interface RouteDetails {
  distance: string;
  duration: string;
  trafficDuration: string;
  route: google.maps.DirectionsResult;
}

export interface TrafficInfo {
  severity: 'low' | 'medium' | 'high';
  delay: number;
  alternateRoutes: boolean;
}

let googleMapsApiKey: string | null = null;

export const initGoogleMaps = async () => {
  try {
    const { data: { GOOGLE_MAPS_API_KEY }, error } = await supabase
      .functions.invoke('get-google-maps-key');
    
    if (error) throw error;
    
    googleMapsApiKey = GOOGLE_MAPS_API_KEY;
    
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places,directions`;
    script.async = true;
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => resolve(true);
    });
  } catch (error) {
    console.error('Error initializing Google Maps:', error);
    return Promise.reject(error);
  }
};

export const geocodeAddress = async (address: string): Promise<Location> => {
  const geocoder = new google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        reject(new Error('Geocoding failed'));
      }
    });
  });
};

export const getRouteDetails = async (
  origin: Location | string,
  destination: Location | string
): Promise<RouteDetails> => {
  const directionsService = new google.maps.DirectionsService();
  
  const request: google.maps.DirectionsRequest = {
    origin: typeof origin === 'string' ? origin : new google.maps.LatLng(origin.lat, origin.lng),
    destination: typeof destination === 'string' ? destination : new google.maps.LatLng(destination.lat, destination.lng),
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      departureTime: new Date(),
      trafficModel: google.maps.TrafficModel.BEST_GUESS
    }
  };
  
  return new Promise((resolve, reject) => {
    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result?.routes[0]?.legs[0]) {
        const leg = result.routes[0].legs[0];
        resolve({
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          trafficDuration: leg.duration_in_traffic?.text || leg.duration?.text || '',
          route: result
        });
      } else {
        reject(new Error('Route calculation failed'));
      }
    });
  });
};

export const analyzeTraffic = async (
  origin: Location | string,
  destination: Location | string
): Promise<TrafficInfo> => {
  try {
    const routeDetails = await getRouteDetails(origin, destination);
    const leg = routeDetails.route.routes[0].legs[0];
    
    const normalDuration = leg.duration?.value || 0;
    const trafficDuration = leg.duration_in_traffic?.value || normalDuration;
    const delay = trafficDuration - normalDuration;
    
    // Calculate traffic severity based on delay percentage
    const delayPercentage = (delay / normalDuration) * 100;
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    if (delayPercentage > 50) {
      severity = 'high';
    } else if (delayPercentage > 25) {
      severity = 'medium';
    }
    
    return {
      severity,
      delay: Math.round(delay / 60), // Convert to minutes
      alternateRoutes: routeDetails.route.routes.length > 1
    };
  } catch (error) {
    console.error('Error analyzing traffic:', error);
    return {
      severity: 'low',
      delay: 0,
      alternateRoutes: false
    };
  }
};