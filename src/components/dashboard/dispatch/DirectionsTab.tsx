import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { supabase } from "@/integrations/supabase/client";

interface DirectionsTabProps {
  transportRecord: TransportRecord;
}

export function DirectionsTab({ transportRecord }: DirectionsTabProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        if (!mapRef.current) return;

        // Initialize the map
        const { data: { GOOGLE_MAPS_API_KEY }, error } = await supabase.functions.invoke('get-google-maps-key');
        
        if (error) {
          console.error('Error fetching Google Maps API key:', error);
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,directions`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          const origin = transportRecord.origin_address || transportRecord.pickup_location;
          const destination = transportRecord.destination_address || transportRecord.dropoff_location;

          // Create map instance
          mapInstance.current = new google.maps.Map(mapRef.current, {
            zoom: 12,
            center: { lat: 33.7490, lng: -84.3880 }, // Default to Atlanta
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          });

          // Initialize DirectionsService and DirectionsRenderer
          const directionsService = new google.maps.DirectionsService();
          directionsRenderer.current = new google.maps.DirectionsRenderer({
            map: mapInstance.current,
            suppressMarkers: false,
            preserveViewport: false,
          });

          // Calculate and display route
          directionsService.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                directionsRenderer.current?.setDirections(result);
                
                // Get route details
                const route = result.routes[0];
                const leg = route.legs[0];
                
                // Update route data in transport record if needed
                if (leg) {
                  const routeData = {
                    distance: leg.distance?.text,
                    duration: leg.duration?.text,
                    start_location: leg.start_location.toJSON(),
                    end_location: leg.end_location.toJSON(),
                  };

                  // Store route data in Supabase
                  supabase
                    .from('transport_records')
                    .update({ route_data: routeData })
                    .eq('id', transportRecord.id)
                    .then(({ error }) => {
                      if (error) console.error('Error updating route data:', error);
                    });
                }
              } else {
                console.error('Error calculating route:', status);
              }
            }
          );
        };

        document.head.appendChild(script);

        return () => {
          // Cleanup
          if (directionsRenderer.current) {
            directionsRenderer.current.setMap(null);
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [transportRecord]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Route Details</span>
      </div>
      <div className="pl-7 space-y-2">
        <p>From: {transportRecord.origin_address || transportRecord.pickup_location}</p>
        <p>To: {transportRecord.destination_address || transportRecord.dropoff_location}</p>
      </div>
      <div ref={mapRef} className="w-full h-[400px] rounded-lg border border-gray-200 shadow-sm" />
    </div>
  );
}