
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/types/employee";
import { MapPin, Navigation } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  updated_at: string;
}

interface EmployeeLocationMapProps {
  locationHistory: Location[];
  employee: Employee;
}

export function EmployeeLocationMap({ locationHistory, employee }: EmployeeLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [path, setPath] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    // Initialize map
    if (mapRef.current && !map) {
      const latestLocation = locationHistory[0] || { latitude: 33.749, longitude: -84.388 }; // Default to Atlanta
      
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: latestLocation.latitude, lng: latestLocation.longitude },
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      });
      
      setMap(newMap);
    }
  }, [mapRef, map, locationHistory]);

  useEffect(() => {
    if (!map || locationHistory.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    if (path) path.setMap(null);
    
    const newMarkers: google.maps.Marker[] = [];
    const pathCoordinates: google.maps.LatLngLiteral[] = [];
    
    // Create markers and path for location history
    locationHistory.forEach((location, index) => {
      const position = { lat: location.latitude, lng: location.longitude };
      pathCoordinates.push(position);
      
      // Only create markers for first, last, and some points in between for performance
      if (index === 0 || index === locationHistory.length - 1 || index % 5 === 0) {
        const isLatest = index === 0;
        const marker = new google.maps.Marker({
          position,
          map,
          title: `${employee.first_name} ${employee.last_name} - ${new Date(location.updated_at).toLocaleString()}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isLatest ? 8 : 5,
            fillColor: isLatest ? '#2563eb' : '#94a3b8',
            fillOpacity: isLatest ? 1 : 0.7,
            strokeColor: 'white',
            strokeWeight: 2
          }
        });
        
        newMarkers.push(marker);
        
        // For the latest location, add info window
        if (isLatest) {
          const infoContent = `
            <div style="padding: 10px; max-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${employee.first_name} ${employee.last_name}</div>
              <div style="font-size: 12px; color: #666;">Last updated: ${new Date(location.updated_at).toLocaleString()}</div>
            </div>
          `;
          
          const infoWindow = new google.maps.InfoWindow({
            content: infoContent
          });
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
          
          // Auto open for latest location
          infoWindow.open(map, marker);
        }
      }
    });
    
    // Create path line
    const newPath = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: 3
    });
    
    newPath.setMap(map);
    
    // Center map on latest location
    if (locationHistory.length > 0) {
      map.setCenter({ 
        lat: locationHistory[0].latitude, 
        lng: locationHistory[0].longitude 
      });
    }
    
    setMarkers(newMarkers);
    setPath(newPath);
    
    // Cleanup
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
      if (newPath) newPath.setMap(null);
    };
  }, [map, locationHistory, employee]);

  return (
    <div className="relative h-full rounded-md overflow-hidden">
      {locationHistory.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-md">
          <MapPin className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">No location data available</p>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="h-full w-full"></div>
          <div className="absolute top-3 left-3 bg-white p-2 rounded-md shadow-md text-sm">
            <div className="flex items-center gap-1.5">
              <Navigation className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{employee.first_name} {employee.last_name}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {locationHistory.length} location points
            </div>
          </div>
        </>
      )}
    </div>
  );
}
