
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouteOptimization } from "./RouteOptimizationContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

export function RouteMapDisplay() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { origin, destination, optimizedRoute, isLoading, error } = useRouteOptimization();
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    let isMounted = true;
    let mapInstance: mapboxgl.Map | null = null;

    const initializeMap = async () => {
      if (!mapContainer.current || !isMounted) return;

      try {
        // Get Mapbox token from Edge Function
        const { data: { MAPBOX_PUBLIC_TOKEN }, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error || !MAPBOX_PUBLIC_TOKEN) {
          throw new Error('Failed to get Mapbox token');
        }
        
        setMapboxToken(MAPBOX_PUBLIC_TOKEN);
        
        if (!isMounted) return;

        mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
        
        mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-84.3880, 33.7490], // Default to Atlanta
          zoom: 10,
          pitch: 45,
        });

        map.current = mapInstance;

        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

        mapInstance.on('style.load', () => {
          if (!isMounted || !mapInstance) return;
          
          mapInstance.setFog({
            'color': 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
          setMapLoading(false);
        });

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
      
      if (mapInstance) {
        mapInstance.remove();
      }
      map.current = null;
    };
  }, []);

  // Update map when route changes
  useEffect(() => {
    if (!map.current || !origin || !destination || !optimizedRoute || mapLoading) return;

    const currentMap = map.current;

    // Remove any existing routes
    if (currentMap.getSource('route')) {
      currentMap.removeLayer('route-layer');
      currentMap.removeSource('route');
    }

    // Add the new route
    currentMap.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: optimizedRoute.route.coordinates
        }
      }
    });

    currentMap.addLayer({
      id: 'route-layer',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#4957FB',
        'line-width': 5,
        'line-opacity': 0.8
      }
    });

    // Add markers for origin and destination
    // Remove existing markers first
    const existingMarkers = document.querySelectorAll('.marker');
    existingMarkers.forEach(marker => marker.remove());

    // Origin marker
    const originEl = document.createElement('div');
    originEl.className = 'marker origin-marker';
    originEl.innerHTML = `
      <div class="p-2 bg-green-500 rounded-full shadow-md">
        <div class="h-4 w-4 bg-white rounded-full"></div>
      </div>
    `;
    new mapboxgl.Marker(originEl)
      .setLngLat([origin.lng, origin.lat])
      .addTo(currentMap);

    // Destination marker
    const destEl = document.createElement('div');
    destEl.className = 'marker destination-marker';
    destEl.innerHTML = `
      <div class="p-2 bg-red-500 rounded-full shadow-md">
        <div class="h-4 w-4 bg-white rounded-full"></div>
      </div>
    `;
    new mapboxgl.Marker(destEl)
      .setLngLat([destination.lng, destination.lat])
      .addTo(currentMap);

    // Fit the map to the route
    currentMap.fitBounds([
      [Math.min(origin.lng, destination.lng) - 0.05, Math.min(origin.lat, destination.lat) - 0.05],
      [Math.max(origin.lng, destination.lng) + 0.05, Math.max(origin.lat, destination.lat) + 0.05]
    ], { padding: 50 });

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
