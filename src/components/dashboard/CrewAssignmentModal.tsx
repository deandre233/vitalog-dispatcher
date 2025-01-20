import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Award, Clock, User, AlertTriangle, ThumbsUp, Activity } from "lucide-react";
import { recommendCrewWithRoute, crewMembers, calculateDistance, type CrewMember, type CrewWithRoute, type Location } from "@/utils/crewRecommendation";
import { analyzeCrewPerformance, getTrafficInfo, calculateSkillMatch } from "@/utils/aiDispatchUtils";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { getRouteDetails } from "@/utils/googleMapsService";
import { optimizeRoute, type RouteRecommendation } from "@/utils/aiDispatchOptimization";

interface CrewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatchId: string;
  serviceType: string;
  origin: Location;
  onAssign?: (crewId: number, eta: number) => void;
}

// Helper function to convert kilometers to miles
const kmToMiles = (km: number) => km * 0.621371;

export function CrewAssignmentModal({
  isOpen,
  onClose,
  dispatchId,
  serviceType,
  origin,
  onAssign,
}: CrewAssignmentModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const routeLine = useRef<google.maps.Polyline | null>(null);
  const [recommendedCrew, setRecommendedCrew] = useState<CrewWithRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  const [routeOptimization, setRouteOptimization] = useState<RouteRecommendation | null>(null);

  const handleAssignCrew = (crewId: number) => {
    const crew = crewMembers.find(c => c.id === crewId);
    if (crew) {
      const trafficInfo = getTrafficInfo(origin, crew.location);
      const skillMatch = calculateSkillMatch(crew.certification, serviceType);
      const performance = analyzeCrewPerformance(crew);
      
      const estimatedMinutes = recommendedCrew?.id === crew.id
        ? Math.round(recommendedCrew.routeInfo.duration + trafficInfo.delayMinutes)
        : Math.round(calculateDistance(crew.location, origin) * 2 + trafficInfo.delayMinutes);

      if (!manualOverride && recommendedCrew && crew.id !== recommendedCrew.id) {
        toast.warning("You are assigning a non-recommended crew member", {
          description: "The AI suggests a different crew for optimal response time.",
          action: {
            label: "Proceed Anyway",
            onClick: () => {
              handleConfirmedAssign(crew, estimatedMinutes, skillMatch, performance, trafficInfo);
            },
          },
        });
        return;
      }

      handleConfirmedAssign(crew, estimatedMinutes, skillMatch, performance, trafficInfo);
    }
  };

  const handleConfirmedAssign = (
    crew: CrewMember, 
    estimatedMinutes: number,
    skillMatch: number,
    performance: { responseTime: number, patientSatisfaction: number },
    trafficInfo: { congestionLevel: string, delayMinutes: number }
  ) => {
    toast.success(
      <div className="space-y-2">
        <p>Crew {crew.name} successfully assigned to dispatch {dispatchId}!</p>
        <div className="text-sm text-gray-500">
          <p>ETA: {estimatedMinutes} minutes (including {trafficInfo.delayMinutes}min traffic delay)</p>
          <p>Skill Match: {Math.round(skillMatch * 100)}%</p>
          <p>Avg Response Time: {performance.responseTime}min</p>
          <p>Patient Satisfaction: {performance.patientSatisfaction}%</p>
        </div>
      </div>
    );
    
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
    if (!mapRef.current || !isOpen) return;

    // Initialize Google Map
    googleMap.current = new google.maps.Map(mapRef.current, {
      center: { lat: origin.lat, lng: origin.lng },
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Add dispatch location marker
    markers.current.push(
      new google.maps.Marker({
        position: { lat: origin.lat, lng: origin.lng },
        map: googleMap.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8
        }
      })
    );

    // Add crew markers
    crewMembers.forEach(crew => {
      const color = recommendedCrew?.id === crew.id ? '#00FF00' : '#0000FF';
      markers.current.push(
        new google.maps.Marker({
          position: { lat: crew.location.lat, lng: crew.location.lng },
          map: googleMap.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 8
          }
        })
      );
    });

    // Draw route if recommended crew exists
    if (recommendedCrew) {
      const drawRoute = async () => {
        try {
          const routeDetails = await getRouteDetails(
            origin,
            recommendedCrew.location
          );

          if (routeLine.current) {
            routeLine.current.setMap(null);
          }

          // Fix: Properly access the overview_polyline points from the DirectionsResult
          const path = routeDetails.route.routes[0].overview_polyline?.points;
          if (path) {
            routeLine.current = new google.maps.Polyline({
              path: google.maps.geometry.encoding.decodePath(path),
              geodesic: true,
              strokeColor: '#3b82f6',
              strokeOpacity: 1.0,
              strokeWeight: 4,
              map: googleMap.current
            });
          }
        } catch (error) {
          console.error('Error drawing route:', error);
        }
      };

      drawRoute();
    }

    return () => {
      markers.current.forEach(marker => marker.setMap(null));
      if (routeLine.current) {
        routeLine.current.setMap(null);
      }
    };
  }, [isOpen, origin, recommendedCrew]);

  useEffect(() => {
    if (!isOpen || !recommendedCrew) return;

    // Get AI route optimization
    const optimization = optimizeRoute(
      origin,
      recommendedCrew.location,
      new Date()
    );
    setRouteOptimization(optimization);
  }, [isOpen, origin, recommendedCrew]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Assign Crew to Dispatch {dispatchId}</DialogTitle>
          <DialogDescription>
            AI has analyzed available crews based on proximity, skills, and performance metrics.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div ref={mapRef} className="h-[300px] rounded-lg mb-4" />
            
            {routeOptimization && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-900 mb-2">AI Route Insights</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>Traffic Level: {routeOptimization.trafficPrediction.congestionLevel}</p>
                  <p>Expected Delay: {routeOptimization.trafficPrediction.predictedDelayMinutes} minutes</p>
                  <p>Route Confidence: {Math.round(routeOptimization.trafficPrediction.confidence * 100)}%</p>
                </div>
              </div>
            )}

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
                    const distance = calculateDistance(crew.location, origin);
                    const distanceInMiles = kmToMiles(distance);
                    const skillMatch = calculateSkillMatch(crew.certification, serviceType);
                    const performance = analyzeCrewPerformance(crew);
                    const trafficInfo = getTrafficInfo(crew.location, origin);
                    const estimatedMinutes = isRecommended 
                      ? Math.round(recommendedCrew.routeInfo.duration + trafficInfo.delayMinutes)
                      : Math.round(distance * 2 + trafficInfo.delayMinutes);

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
                              <Award className="w-4 h-4 text-medical-secondary" />
                              <span>
                                Certification: {crew.certification}
                                <span className={`ml-1 ${
                                  skillMatch > 0.8 ? "text-green-500" : 
                                  skillMatch > 0.5 ? "text-yellow-500" : 
                                  "text-red-500"
                                }`}>
                                  ({Math.round(skillMatch * 100)}% match)
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-medical-secondary" />
                              <span>
                                {isRecommended 
                                  ? `${kmToMiles(recommendedCrew.routeInfo.distance).toFixed(2)} miles via route`
                                  : `${distanceInMiles.toFixed(2)} miles direct`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-medical-secondary" />
                              <span>
                                ETA: {estimatedMinutes} min
                                {trafficInfo.delayMinutes > 0 && (
                                  <span className="text-yellow-500 ml-1">
                                    (+{trafficInfo.delayMinutes} traffic delay)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Activity className="w-4 h-4 text-medical-secondary" />
                              <span>
                                Avg Response: {performance.responseTime}min
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ThumbsUp className="w-4 h-4 text-medical-secondary" />
                              <span>
                                Patient Satisfaction: {performance.patientSatisfaction}%
                              </span>
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