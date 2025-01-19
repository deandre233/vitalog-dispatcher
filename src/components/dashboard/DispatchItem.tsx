import { MapPin, Clock, Ambulance, User, Building, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { CrewAssignmentModal } from "./CrewAssignmentModal";

interface AIRecommendations {
  route: string;
  crew: string;
  billing: string;
}

interface DispatchItemProps {
  id: string;
  activationTime: string;
  assignedTo: string;
  patient: string;
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  aiRecommendations: AIRecommendations;
  eta: string;
  comments?: string;
  warnings?: string;
  progress?: number;
}

export function DispatchItem({
  id,
  activationTime,
  assignedTo,
  patient,
  serviceType,
  origin,
  destination,
  status,
  priority,
  aiRecommendations,
  eta,
  comments,
  warnings,
  progress = 0,
}: DispatchItemProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  return (
    <div className="flex flex-col p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              priority === "high" ? "bg-red-100" : 
              priority === "medium" ? "bg-yellow-100" : 
              "bg-green-100"
            }`}>
              <Ambulance className={`w-5 h-5 ${
                priority === "high" ? "text-red-500" : 
                priority === "medium" ? "text-yellow-500" : 
                "text-green-500"
              }`} />
            </div>
            <div className="text-sm font-medium">{serviceType}</div>
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{activationTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm truncate max-w-[180px]">{origin}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{patient}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm truncate max-w-[180px]">{destination}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">ETA: {eta}</div>
          {status === "Pending" ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssignModalOpen(true)}
              >
                Assign Crew
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "En Route" ? "bg-blue-100 text-blue-700" :
              status === "Pending" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            }`}>
              {status}
            </span>
          )}
        </div>
      </div>

      {(comments || warnings || progress > 0) && (
        <div className="flex flex-col gap-2">
          {progress > 0 && (
            <div className="w-full">
              <Progress value={progress} className="h-2" />
            </div>
          )}
          {(comments || warnings) && (
            <div className="flex items-start gap-2">
              {warnings && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{warnings}</span>
                </div>
              )}
              {comments && (
                <span className="text-sm text-gray-600">{comments}</span>
              )}
            </div>
          )}
        </div>
      )}

      <CrewAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        dispatchId={id}
        serviceType={serviceType}
        origin={{ lat: 33.7720, lng: -84.3960 }}
        onAssign={() => {}}
      />
    </div>
  );
}