import { useEffect, useRef } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useOperationsMap } from '@/hooks/useOperationsMap';
import { MapPin, AlertTriangle, Cloud, Car, Activity } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function OperationsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { vehicles, insights, filters, setFilters, isLoading } = useOperationsMap();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.your_mapbox_token';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-84.3880, 33.7490], // Atlanta coordinates
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !vehicles) return;

    // Add vehicle markers
    vehicles.forEach(vehicle => {
      if (!map.current) return;

      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.innerHTML = `<div class="p-2 bg-medical-primary rounded-full shadow-glow">
        <Car className="h-4 w-4 text-white" />
      </div>`;

      new mapboxgl.Marker(el)
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
    });
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

            {/* Controls Overlay */}
            <div className="absolute top-4 left-4 z-10 space-y-4">
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
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-pulse text-lg font-semibold">Loading map data...</div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}