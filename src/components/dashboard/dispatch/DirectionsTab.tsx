import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { getRouteDetails, geocodeAddress } from '@/services/googleMaps';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

  useEffect(() => {
    if (!mapElement) return;

    const newMap = new google.maps.Map(mapElement, {
      zoom: 12,
      center: { lat: 0, lng: 0 },
    });

    const renderer = new google.maps.DirectionsRenderer({ map: newMap });
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

            await supabase
              .from('transport_records')
              .update({
                route_data: routeData as any // Type assertion needed for Supabase Json type
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

  return (
    <Card className="p-4">
      <div 
        ref={setMapElement}
        style={{ width: '100%', height: '400px' }}
        className="rounded-lg overflow-hidden"
      />
    </Card>
  );
};