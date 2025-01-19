import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Award, Clock } from "lucide-react";
import { recommendCrew } from "@/utils/crewRecommendation";
import { toast } from "sonner";

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
    destination: origin, // Not needed for crew assignment
    serviceType,
  };

  const recommendedCrew = recommendCrew(mockDispatch);

  const handleAssignCrew = () => {
    if (recommendedCrew) {
      // In a real application, this would make an API call to assign the crew
      toast.success(`Crew ${recommendedCrew.name} assigned to dispatch ${dispatchId}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Crew to Dispatch {dispatchId}</DialogTitle>
          <DialogDescription>
            AI has analyzed available crews and recommended the best match based on
            proximity, skills, and current conditions.
          </DialogDescription>
        </DialogHeader>

        {recommendedCrew ? (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-medical-accent">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-medical-primary">
                  Recommended Crew
                </h3>
                <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  Best Match
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-medical-secondary" />
                  <span className="font-medium">{recommendedCrew.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-medical-secondary" />
                  <span>
                    {recommendedCrew.distance.toFixed(2)} km from location
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-medical-secondary" />
                  <span>ETA: {Math.round(recommendedCrew.distance * 2)} minutes</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAssignCrew}>
                Assign Recommended Crew
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No available crews found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}