
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouteOptimization } from "./RouteOptimizationContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initGoogleMaps, getRouteDetails } from "@/utils/googleMapsService";

export function RouteMapDisplay() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const { origin, destination, optimizedRoute, isLoading, error } = useRouteOptimization();
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!mapContainer.current || !isMounted) return;

      try {
        // Initialize Google Maps
        await initGoogleMaps();
        
        if (!isMounted) return;
        
        const mapOptions: google.maps.MapOptions = {
          center: { lat: 33.7490, lng: -84.3880 }, // Default to Atlanta
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        };
        
        const newMap = new google.maps.Map(mapContainer.current, mapOptions);
        map.current = newMap;
        
        // Initialize the DirectionsRenderer
        const renderer = new google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: true, // We'll add custom markers
          polylineOptions: {
            strokeColor: "#4957FB",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          }
        });
        directionsRenderer.current = renderer;
        
        setMapLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize map';
        setMapError(errorMessage);
        if (isMounted) {
          toast.error('Failed to initialize map. Please try again later.');
          setMapLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update map when route changes
  useEffect(() => {
    if (!map.current || !origin || !destination || !optimizedRoute || mapLoading) return;

    const currentMap = map.current;
    
    // Clear existing markers
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => marker.remove());
    
    // Create origin marker
    const originMarker = new google.maps.Marker({
      position: { lat: origin.lat, lng: origin.lng },
      map: currentMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#22c55e", // green-500
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
      title: "Origin"
    });
    
    // Create destination marker
    const destinationMarker = new google.maps.Marker({
      position: { lat: destination.lat, lng: destination.lng },
      map: currentMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#ef4444", // red-500
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
      title: "Destination"
    });
    
    // Display the route
    if (directionsRenderer.current) {
      directionsRenderer.current.setDirections(optimizedRoute.route);
      
      // Fit the map to the route bounds
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      currentMap.fitBounds(bounds);
    }
    
  }, [origin, destination, optimizedRoute, mapLoading]);

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="h-[600px] relative">
        {/* Map Container */}
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Loading State */}
        {(isLoading || mapLoading) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size={32} />
              <p className="text-lg font-semibold">Loading map data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {(error || mapError) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 p-6">
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription>
                {error || mapError || 'An error occurred while loading the map.'}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* No Route Selected State */}
        {!optimizedRoute && !isLoading && !mapLoading && !error && !mapError && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="text-center max-w-md p-6">
              <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Route Selected</h3>
              <p className="text-gray-500">
                Enter origin and destination points and click "Optimize Route" to see the optimal path with AI recommendations.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
