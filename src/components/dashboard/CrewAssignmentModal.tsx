import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Award, Clock, CheckCircle, User, AlertTriangle } from "lucide-react";
import { recommendCrewWithRoute, crewMembers, calculateDistance, type CrewMember, type CrewWithRoute, type Location } from "@/utils/crewRecommendation";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CrewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatchId: string;
  serviceType: string;
  origin: Location;
  onAssign?: (crewId: number, eta: number) => void;
}

export function CrewAssignmentModal({
  isOpen,
  onClose,
  dispatchId,
  serviceType,
  origin,
  onAssign,
}: CrewAssignmentModalProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [recommendedCrew, setRecommendedCrew] = useState<CrewWithRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);

  const handleAssignCrew = (crewId: number) => {
    const crew = crewMembers.find(c => c.id === crewId);
    if (crew) {
      const estimatedMinutes = recommendedCrew?.id === crew.id
        ? Math.round(recommendedCrew.routeInfo.duration)
        : Math.round(calculateDistance(crew.location, origin) * 2);
        
      if (!manualOverride && recommendedCrew && crew.id !== recommendedCrew.id) {
        toast.warning("You are assigning a non-recommended crew member", {
          description: "The AI suggests a different crew for optimal response time.",
          action: {
            label: "Proceed Anyway",
            onClick: () => {
              handleConfirmedAssign(crew, estimatedMinutes);
            },
          },
        });
        return;
      }

      handleConfirmedAssign(crew, estimatedMinutes);
    }
  };

  const handleConfirmedAssign = (crew: CrewMember, estimatedMinutes: number) => {
    toast.success(`Crew ${crew.name} successfully assigned to dispatch ${dispatchId}!`, {
      description: `Estimated arrival time: ${estimatedMinutes} minutes`,
    });
    
    if (onAssign) {
      onAssign(crew.id, estimatedMinutes);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const recommended = await recommendCrewWithRoute({ origin, serviceType });
        setRecommendedCrew(recommended);
      } catch (error) {
        console.error('Failed to get recommendations:', error);
        toast.error('Failed to load crew recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [isOpen, origin, serviceType]);

  useEffect(() => {
    if (!mapContainer.current || !isOpen || !recommendedCrew) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [origin.lng, origin.lat],
      zoom: 12
    });

    // Add markers
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([origin.lng, origin.lat])
      .addTo(map.current);

    // Add route if available
    if (recommendedCrew.routeInfo.route) {
      map.current.on('load', () => {
        if (!map.current) return;
        
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: recommendedCrew.routeInfo.route!.geometry.coordinates
            }
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4
          }
        });
      });
    }

    // Add crew markers
    crewMembers.forEach(crew => {
      const color = recommendedCrew.id === crew.id ? '#00FF00' : '#0000FF';
      new mapboxgl.Marker({ color })
        .setLngLat([crew.location.lng, crew.location.lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [isOpen, origin, recommendedCrew]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Assign Crew to Dispatch {dispatchId}</DialogTitle>
          <DialogDescription>
            AI has analyzed available crews and calculated optimal routes based on current traffic conditions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div ref={mapContainer} className="h-[300px] rounded-lg mb-4" />
            <div className="flex gap-2 text-sm mb-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" /> Dispatch Location
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Recommended Crew
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" /> Available Crew
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setManualOverride(!manualOverride)}
            >
              {manualOverride ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                  Manual Override Active
                </>
              ) : (
                "Override AI Recommendation"
              )}
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary" />
              </div>
            ) : crewMembers.filter(crew => crew.available).length > 0 ? (
              <div className="space-y-4">
                {crewMembers
                  .filter(crew => crew.available)
                  .map((crew) => {
                    const isRecommended = recommendedCrew?.id === crew.id;
                    const distance = calculateDistance(crew, origin);
                    const estimatedMinutes = isRecommended 
                      ? Math.round(recommendedCrew.routeInfo.duration)
                      : Math.round(distance * 2);

                    return (
                      <div
                        key={crew.id}
                        className={`p-4 border rounded-lg ${
                          isRecommended && !manualOverride
                            ? "bg-medical-accent border-medical-primary"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-medical-secondary" />
                            <h3 className="text-lg font-semibold text-medical-primary">
                              {crew.name}
                            </h3>
                          </div>
                          {isRecommended && !manualOverride && (
                            <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              Best Match
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-medical-secondary" />
                              <span>Certification: {crew.certification}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-medical-secondary" />
                              <span>
                                {isRecommended 
                                  ? `${recommendedCrew.routeInfo.distance.toFixed(2)} km via route`
                                  : `${distance.toFixed(2)} km direct`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-medical-secondary" />
                              <span>ETA: {estimatedMinutes} minutes</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <Button
                              onClick={() => handleAssignCrew(crew.id)}
                              variant={isRecommended && !manualOverride ? "default" : "outline"}
                            >
                              {isRecommended && !manualOverride ? "Assign Recommended" : "Assign Crew"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No available crews found.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}