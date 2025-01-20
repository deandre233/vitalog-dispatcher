import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CrewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transportId: string;
  patientName: string;
  patientId: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  warnings?: string[];
}

export function CrewAssignmentModal({
  isOpen,
  onClose,
  transportId,
  patientName,
  patientId,
  pickupLocation,
  dropoffLocation,
  scheduledTime,
  warnings = []
}: CrewAssignmentModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [routeDetails, setRouteDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCrews, setAvailableCrews] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
            pickupLocation
          )}&destination=${encodeURIComponent(dropoffLocation)}&key=${
            process.env.GOOGLE_MAPS_API_KEY
          }`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch route details');
        }

        const data = await response.json();
        setRouteDetails(data);
      } catch (error) {
        console.error('Error fetching route details:', error);
        toast({
          title: "Error",
          description: "Failed to load route details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetails();
  }, [isOpen, pickupLocation, dropoffLocation, toast]);

  useEffect(() => {
    const fetchAvailableCrews = async () => {
      try {
        const { data, error } = await supabase
          .from('crews')
          .select('*')
          .eq('status', 'available');

        if (error) throw error;
        setAvailableCrews(data || []);
      } catch (error) {
        console.error('Error fetching crews:', error);
        toast({
          title: "Error",
          description: "Failed to load available crews",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      fetchAvailableCrews();
    }
  }, [isOpen, toast]);

  const handlePatientClick = () => {
    const fetchPatientDisplayId = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('display_id')
          .eq('id', patientId)
          .single();

        if (error) throw error;

        if (data?.display_id) {
          navigate(`/patient/${data.display_id.toLowerCase()}`);
        } else {
          toast({
            title: "Error",
            description: "Patient profile not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast({
          title: "Error",
          description: "Failed to access patient profile",
          variant: "destructive",
        });
      }
    };

    fetchPatientDisplayId();
  };

  const handleCrewSelect = (crew: any) => {
    setSelectedCrew(crew);
  };

  const handleAssignCrew = async () => {
    if (!selectedCrew) {
      toast({
        title: "Error",
        description: "Please select a crew first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transports')
        .update({
          crew_id: selectedCrew.id,
          status: 'assigned'
        })
        .eq('id', transportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crew assigned successfully",
      });

      onClose();
    } catch (error) {
      console.error('Error assigning crew:', error);
      toast({
        title: "Error",
        description: "Failed to assign crew",
        variant: "destructive",
      });
    }
  };

  const getPolylinePoints = () => {
    if (!routeDetails?.routes?.[0]?.overview_polyline?.points) {
      return null;
    }
    return routeDetails.routes[0].overview_polyline.points;
  };

  const polylinePoints = getPolylinePoints();
  const bounds = polylinePoints ? new google.maps.LatLngBounds() : null;
  
  if (polylinePoints && bounds) {
    const decodedPath = google.maps.geometry.encoding.decodePath(polylinePoints);
    decodedPath.forEach(point => bounds.extend(point));
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Assign Crew</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div 
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handlePatientClick}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{patientName}</h3>
                <div className="flex gap-2">
                  {warnings.map((warning, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {warning}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Pickup: {pickupLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dropoff: {dropoffLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Scheduled: {new Date(scheduledTime).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg p-4">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-center py-4">Loading available crews...</div>
                ) : availableCrews.length === 0 ? (
                  <div className="text-center py-4">No crews available at this time</div>
                ) : (
                  availableCrews.map((crew) => (
                    <div
                      key={crew.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCrew?.id === crew.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCrewSelect(crew)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{crew.name}</span>
                        </div>
                        <Badge variant="outline">
                          {crew.vehicle_type}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div>Current Location: {crew.current_location}</div>
                        <div>Experience Level: {crew.experience_level}</div>
                        <div>Last Assignment: {crew.last_assignment ? new Date(crew.last_assignment).toLocaleString() : 'N/A'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAssignCrew} disabled={!selectedCrew}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}