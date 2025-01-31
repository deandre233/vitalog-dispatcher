import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export interface Location {
  lat: number;
  lng: number;
}

export interface RouteDetails {
  distance: string;
  duration: string;
  trafficDuration?: string;
  route: google.maps.DirectionsResult;
}

let googleMapsApiKey: string | null = null;
let isInitializing = false;
let initPromise: Promise<boolean> | null = null;

export const initGoogleMaps = async () => {
  if (initPromise) return initPromise;
  if (isInitializing) return initPromise;
  
  isInitializing = true;
  
  initPromise = new Promise(async (resolve, reject) => {
    try {
      if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
        isInitializing = false;
        resolve(true);
        return;
      }

      const { data: { GOOGLE_MAPS_API_KEY }, error } = await supabase
        .functions.invoke('get-google-maps-key');
      
      if (error) throw error;
      
      googleMapsApiKey = GOOGLE_MAPS_API_KEY;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places,directions,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isInitializing = false;
        resolve(true);
      };
      
      script.onerror = (error) => {
        isInitializing = false;
        reject(error);
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      isInitializing = false;
      logger.error('Error initializing Google Maps:', error);
      reject(error);
    }
  });
  
  return initPromise;
};

export const getRouteDetails = async (
  origin: Location | string,
  destination: Location | string
): Promise<RouteDetails> => {
  await initGoogleMaps();
  
  const directionsService = new google.maps.DirectionsService();
  
  const request: google.maps.DirectionsRequest = {
    origin: typeof origin === 'string' ? origin : new google.maps.LatLng(origin.lat, origin.lng),
    destination: typeof destination === 'string' ? destination : new google.maps.LatLng(destination.lat, destination.lng),
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      departureTime: new Date(),
      trafficModel: google.maps.TrafficModel.BEST_GUESS
    },
    optimizeWaypoints: true,
    provideRouteAlternatives: true,
    avoidHighways: false,
    avoidTolls: false
  };
  
  return new Promise((resolve, reject) => {
    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result?.routes[0]?.legs[0]) {
        const leg = result.routes[0].legs[0];
        resolve({
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          trafficDuration: leg.duration_in_traffic?.text,
          route: result
        });
      } else {
        reject(new Error('Route calculation failed'));
      }
    });
  });
};

export const geocodeAddress = async (address: string): Promise<Location> => {
  await initGoogleMaps();
  
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

export const analyzeTrafficConditions = async (
  origin: Location | string,
  destination: Location | string
): Promise<{
  severity: 'low' | 'medium' | 'high';
  delay: number;
  alternateRoutes: boolean;
}> => {
  try {
    const routeDetails = await getRouteDetails(origin, destination);
    const leg = routeDetails.route.routes[0].legs[0];
    
    const normalDuration = leg.duration?.value || 0;
    const trafficDuration = leg.duration_in_traffic?.value || normalDuration;
    const delay = trafficDuration - normalDuration;
    
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
