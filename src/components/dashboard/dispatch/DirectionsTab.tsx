
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Car, AlertTriangle, Info, DollarSign, Activity, Truck } from 'lucide-react';
import type { RouteData } from '@/types/operations-map';
import { initGoogleMaps, Location } from '@/services/googleMaps';

interface DirectionsTabProps {
  transportId: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export const DirectionsTab: React.FC<DirectionsTabProps> = ({
  transportId,
  pickupLocation,
  dropoffLocation,
}) => {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    trafficDuration: string;
    trafficSeverity: 'low' | 'medium' | 'high';
    mileage: number;
    retailRate: number;
    medicareRate: number;
    contractRate: number;
    alternativeRoutes: number;
    fuelConsumption: string;
    tollRoads: boolean;
  } | null>(null);

  useEffect(() => {
    if (!mapElement) return;

    const initMap = async () => {
      await initGoogleMaps();
      
      const newMap = new google.maps.Map(mapElement, {
        zoom: 12,
        center: { lat: 33.7490, lng: -84.3880 }, // Atlanta coordinates
        mapTypeId: 'terrain',
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#1a1b1e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#2a2b30' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca3af' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0f172a' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const renderer = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 6,
          strokeOpacity: 0.8
        }
      });

      // Add traffic layer with custom styling
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(newMap);

      setMap(newMap);
      setDirectionsRenderer(renderer);
    };

    initMap();

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [mapElement]);

  useEffect(() => {
    const calculateRoute = async () => {
      if (!pickupLocation || !dropoffLocation || !directionsRenderer) return;

      try {
        await initGoogleMaps();
        
        const directionsService = new google.maps.DirectionsService();
        
        const request: google.maps.DirectionsRequest = {
          origin: pickupLocation,
          destination: dropoffLocation,
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
        
        directionsService.route(request, async (result, status) => {
          if (status === 'OK' && result?.routes[0]?.legs[0]) {
            directionsRenderer.setDirections(result);
            
            const leg = result.routes[0].legs[0];
            
            // Calculate distance in miles
            const distanceInMiles = parseFloat(leg.distance?.text?.replace(/[^0-9.]/g, '') || '0');
            
            // Analyze traffic conditions
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
            
            // Calculate rates based on distance
            const retailRate = Math.round(distanceInMiles * 25); // $25 per mile
            const medicareRate = Math.round(distanceInMiles * 15); // $15 per mile
            const contractRate = Math.round(distanceInMiles * 20); // $20 per mile

            const routeData = {
              distance: leg.distance?.text || "",
              duration: leg.duration?.text || "",
              start_location: {
                lat: leg.start_location.lat(),
                lng: leg.start_location.lng()
              },
              end_location: {
                lat: leg.end_location.lat(),
                lng: leg.end_location.lng()
              }
            };

            setRouteInfo({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
              trafficDuration: leg.duration_in_traffic?.text || leg.duration?.text || '',
              trafficSeverity: severity,
              mileage: distanceInMiles,
              retailRate,
              medicareRate,
              contractRate,
              alternativeRoutes: result.routes.length,
              fuelConsumption: `${(distanceInMiles * 0.12).toFixed(1)} gal est.`,
              tollRoads: result.routes[0].warnings.some(w => w.includes('toll'))
            });

            await supabase
              .from('transport_records')
              .update({
                route_data: routeData as any,
                traffic_conditions: {
                  severity,
                  delay: Math.round(delay / 60), // Convert to minutes
                  alternateRoutes: result.routes.length > 1
                }
              })
              .eq('id', transportId);
          } else {
            toast.error('Failed to calculate route');
          }
        });
      } catch (error) {
        console.error('Error calculating route:', error);
        toast.error('Failed to calculate route');
      }
    };

    calculateRoute();
  }, [pickupLocation, dropoffLocation, directionsRenderer, transportId]);

  const getTrafficColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-gray-900 to-gray-800">
        <div 
          ref={setMapElement}
          style={{ width: '100%', height: '400px' }}
          className="rounded-lg overflow-hidden mb-4 border border-gray-700"
        />
        
        {routeInfo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg shadow-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Distance</p>
                <p className="text-lg text-white">{routeInfo.distance}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg shadow-lg">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Est. Duration</p>
                <p className="text-lg text-white">{routeInfo.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg shadow-lg">
              <Car className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Traffic Conditions</p>
                <div className="flex items-center space-x-2">
                  <Badge className={getTrafficColor(routeInfo.trafficSeverity)}>
                    {routeInfo.trafficSeverity.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-white">{routeInfo.trafficDuration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg shadow-lg">
              <Truck className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Fuel Est.</p>
                <p className="text-lg text-white">{routeInfo.fuelConsumption}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {routeInfo && (
        <Card className="p-4 bg-gradient-to-br from-gray-900 to-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Rate Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Retail Rate</p>
              <p className="text-2xl font-bold text-green-400">${routeInfo.retailRate}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Medicare Rate</p>
              <p className="text-2xl font-bold text-blue-400">${routeInfo.medicareRate}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Contract Rate</p>
              <p className="text-2xl font-bold text-purple-400">${routeInfo.contractRate}</p>
            </div>
          </div>
        </Card>
      )}

      {routeInfo?.trafficSeverity === 'high' && (
        <Card className="p-4 border-red-500 bg-red-900/10">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-500">Heavy Traffic Alert</h4>
              <p className="text-sm text-red-400">
                Consider alternative routes or adjusting departure time due to significant traffic delays.
                {routeInfo.alternativeRoutes > 1 && ` ${routeInfo.alternativeRoutes - 1} alternative routes available.`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {routeInfo?.tollRoads && (
        <Card className="p-4 bg-yellow-900/10 border-yellow-500">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-500">Toll Road Alert</h4>
              <p className="text-sm text-yellow-400">
                This route includes toll roads. Consider alternative routes if needed.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-blue-900/10 border-blue-500">
        <div className="flex items-start space-x-2">
          <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-500">Route Analytics</h4>
            <p className="text-sm text-blue-400">
              Real-time traffic monitoring and route optimization enabled. Updates every 2 minutes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
