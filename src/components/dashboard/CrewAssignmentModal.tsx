import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Award, Clock, CheckCircle, User } from "lucide-react";
import { recommendCrew, crewMembers } from "@/utils/crewRecommendation";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CrewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatchId: string;
  serviceType: string;
  origin: { lat: number; lng: number };
}

export function CrewAssignmentModal({
  isOpen,
  onClose,
  dispatchId,
  serviceType,
  origin,
}: CrewAssignmentModalProps) {
  const mockDispatch = {
    id: dispatchId,
    origin,
    destination: origin,
    serviceType,
  };

  const recommendedCrew = recommendCrew(mockDispatch);
  const availableCrews = crewMembers.filter(crew => crew.available);

  const handleAssignCrew = (crewId: number) => {
    const crew = crewMembers.find(c => c.id === crewId);
    if (crew) {
      toast.success(`Crew ${crew.name} assigned to dispatch ${dispatchId}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Crew to Dispatch {dispatchId}</DialogTitle>
          <DialogDescription>
            AI has analyzed available crews and recommended the best match based on
            proximity, skills, and current conditions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {availableCrews.length > 0 ? (
            <div className="space-y-4">
              {availableCrews.map((crew) => {
                const distance = calculateDistance(crew, origin);
                const estimatedMinutes = Math.round(distance * 2);
                const isRecommended = recommendedCrew?.id === crew.id;

                return (
                  <div
                    key={crew.id}
                    className={`p-4 border rounded-lg ${
                      isRecommended
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
                      {isRecommended && (
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
                          <span>{distance.toFixed(2)} km from location</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-medical-secondary" />
                          <span>ETA: {estimatedMinutes} minutes</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          onClick={() => handleAssignCrew(crew.id)}
                          variant={isRecommended ? "default" : "outline"}
                        >
                          {isRecommended ? "Assign Recommended" : "Assign Crew"}
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
      </DialogContent>
    </Dialog>
  );
}

function calculateDistance(crew: { location: { lat: number; lng: number } }, origin: { lat: number; lng: number }): number {
  const R = 6371; // Earth radius in km
  const dLat = (origin.lat - crew.location.lat) * Math.PI / 180;
  const dLng = (origin.lng - crew.location.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(crew.location.lat * Math.PI / 180) *
    Math.cos(origin.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}