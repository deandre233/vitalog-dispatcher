import { useEffect, useRef, useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useOperationsMap } from '@/hooks/useOperationsMap';
import { MapPin, AlertTriangle, Cloud, Car, Activity } from 'lucide-react';
import { OperationsSearch } from '@/components/operations/OperationsSearch';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import type { SearchFilters } from '@/types/search';

export function OperationsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { vehicles, insights, filters, setFilters, isLoading } = useOperationsMap();
  const [mapLoading, setMapLoading] = useState(true);

  const handleSearch = (filters: SearchFilters) => {
    // Implement search logic here
    console.log('Search filters:', filters);
    toast.success('Search filters updated');
  };

  // Initialize map
  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!mapContainer.current || !isMounted) return;

      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        
        if (error || !data?.GOOGLE_MAPS_API_KEY) {
          throw new Error('Failed to get map API key');
        }

        mapboxgl.accessToken = data.GOOGLE_MAPS_API_KEY;
        
        if (!isMounted) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-84.3880, 33.7490],
          zoom: 10,
          pitch: 45,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('style.load', () => {
          if (!isMounted || !map.current) return;
          
          map.current.setFog({
            'color': 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
          setMapLoading(false);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        if (isMounted) {
          toast.error('Failed to initialize map. Please try again later.');
          setMapLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle vehicle markers
  useEffect(() => {
    if (!map.current || !vehicles) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    vehicles.forEach(vehicle => {
      if (!map.current) return;

      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.innerHTML = `
        <div class="p-2 bg-medical-primary rounded-full shadow-glow animate-map-pulse">
          <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 16H9m10 0h3m-3 4v-8m0 0V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v8m0 0v8m0-8h3" />
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([vehicle.location.lng, vehicle.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-bold">Vehicle ${vehicle.vehicleId}</h3>
                <p class="text-sm">Status: ${vehicle.status}</p>
                <p class="text-sm">Crew: ${vehicle.crew?.join(', ') || 'Unassigned'}</p>
                ${vehicle.currentDispatch ? `<p class="text-sm">Dispatch: ${vehicle.currentDispatch}</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [vehicles]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <AppSidebar />
        <div className="flex-1 bg-[#f4f7fc] overflow-hidden">
          <main className="h-full relative">
            {/* Map Container */}
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Search Bar Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4">
              <OperationsSearch onSearch={handleSearch} />
            </div>

            {/* Controls Overlay */}
            <div className="absolute top-20 left-4 z-10 space-y-4">
              <Card className="p-4 w-80 bg-white/90 backdrop-blur-sm shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Map Controls</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Show Active Vehicles</label>
                    <Switch
                      checked={filters.showActiveVehicles}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, showActiveVehicles: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Show Traffic Layer</label>
                    <Switch
                      checked={filters.showTrafficLayer}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, showTrafficLayer: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Show Weather Layer</label>
                    <Switch
                      checked={filters.showWeatherLayer}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, showWeatherLayer: checked }))
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* AI Insights Panel */}
              <Card className="p-4 w-80 bg-white/90 backdrop-blur-sm shadow-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  AI Insights
                </h2>
                <div className="space-y-3">
                  {insights?.map((insight, index) => (
                    <div key={index} className="p-3 bg-medical-accent rounded-lg">
                      <div className="flex items-start gap-2">
                        {insight.type === 'traffic' && <Car className="h-4 w-4 text-medical-primary" />}
                        {insight.type === 'weather' && <Cloud className="h-4 w-4 text-medical-primary" />}
                        {insight.type === 'coverage' && <MapPin className="h-4 w-4 text-medical-primary" />}
                        {insight.type === 'demand' && <Activity className="h-4 w-4 text-medical-primary" />}
                        <div>
                          <p className="text-sm font-medium">{insight.message}</p>
                          {insight.recommendation && (
                            <p className="text-xs text-gray-600 mt-1">{insight.recommendation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Loading State */}
            {(isLoading || mapLoading) && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size={32} />
                  <p className="text-lg font-semibold">Loading map data...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
