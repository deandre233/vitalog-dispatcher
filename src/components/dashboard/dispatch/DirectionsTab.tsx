import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { getRouteDetails, geocodeAddress } from '@/services/googleMaps';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Car, AlertTriangle, Info } from 'lucide-react';
import type { RouteData } from '@/types/operations-map';

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
  } | null>(null);

  useEffect(() => {
    if (!mapElement) return;

    const newMap = new google.maps.Map(mapElement, {
      zoom: 12,
      center: { lat: 33.7490, lng: -84.3880 }, // Atlanta coordinates
      mapTypeId: 'terrain',
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#746855' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        }
      ]
    });

    const renderer = new google.maps.DirectionsRenderer({
      map: newMap,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4CAF50',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });

    // Add traffic layer
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(newMap);

    setMap(newMap);
    setDirectionsRenderer(renderer);

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [mapElement]);

  useEffect(() => {
    const calculateRoute = async () => {
      if (!pickupLocation || !dropoffLocation) return;

      try {
        const routeDetails = await getRouteDetails(pickupLocation, dropoffLocation);
        
        if (directionsRenderer && routeDetails.route) {
          directionsRenderer.setDirections(routeDetails.route);
          
          const leg = routeDetails.route.routes[0]?.legs[0];
          if (leg) {
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

            // Calculate traffic severity based on duration difference
            const normalDuration = leg.duration?.value || 0;
            const trafficDuration = leg.duration_in_traffic?.value || normalDuration;
            const delayFactor = (trafficDuration - normalDuration) / normalDuration;
            
            let trafficSeverity: 'low' | 'medium' | 'high' = 'low';
            if (delayFactor > 0.5) trafficSeverity = 'high';
            else if (delayFactor > 0.2) trafficSeverity = 'medium';

            setRouteInfo({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
              trafficDuration: leg.duration_in_traffic?.text || leg.duration?.text || '',
              trafficSeverity
            });

            await supabase
              .from('transport_records')
              .update({
                route_data: routeData as any
              })
              .eq('id', transportId);
          }
        }
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
      <Card className="p-4">
        <div 
          ref={setMapElement}
          style={{ width: '100%', height: '400px' }}
          className="rounded-lg overflow-hidden mb-4"
        />
        
        {routeInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 bg-card p-3 rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Distance</p>
                <p className="text-lg">{routeInfo.distance}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-card p-3 rounded-lg shadow-sm">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Est. Duration</p>
                <p className="text-lg">{routeInfo.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-card p-3 rounded-lg shadow-sm">
              <Car className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Traffic Conditions</p>
                <div className="flex items-center space-x-2">
                  <Badge className={getTrafficColor(routeInfo.trafficSeverity)}>
                    {routeInfo.trafficSeverity.toUpperCase()}
                  </Badge>
                  <span className="text-sm">{routeInfo.trafficDuration}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {routeInfo?.trafficSeverity === 'high' && (
        <Card className="p-4 border-red-500 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-500">Heavy Traffic Alert</h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                Consider alternative routes or adjusting departure time due to significant traffic delays.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/10">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-500">Route Information</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              This route is optimized for emergency medical transport. Traffic conditions are monitored in real-time.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};