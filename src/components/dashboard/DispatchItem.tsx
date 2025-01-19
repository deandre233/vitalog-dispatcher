import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CrewAssignmentModal } from "./CrewAssignmentModal";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Clock,
  User,
  XCircle,
  AlertTriangle,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

interface Patient {
  name: string;
  dob?: string;
  condition?: string;
  id: string; // Added id for patient
}

interface AIRecommendations {
  route: string;
  crew: string;
  billing: string;
  insights?: string[];
  trafficStatus?: {
    congestionLevel: "low" | "medium" | "high";
    estimatedDelay: number;
    alternateRouteAvailable: boolean;
  };
}

interface DispatchItemProps {
  id: string;
  activationTime: string;
  patient: Patient;
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  assignedTo: string;
  aiRecommendations: AIRecommendations;
  eta: string;
  comments?: string;
  warnings?: string;
  progress?: number;
  elapsedTime?: string;
  lastUpdated?: string;
  efficiency?: number;
}

export function DispatchItem({
  id,
  activationTime,
  patient,
  serviceType,
  origin,
  destination,
  status,
  priority,
  assignedTo,
  aiRecommendations,
  eta,
  comments,
  warnings,
  progress = 0,
  elapsedTime,
  lastUpdated,
  efficiency,
}: DispatchItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleUnassign = () => {
    toast.success(`Crew unassigned from dispatch ${id}`);
  };

  const handleAssign = (crewId: number, estimatedMinutes: number) => {
    toast.success(
      `Crew ${crewId} assigned to dispatch ${id}. ETA: ${estimatedMinutes} minutes`
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const openAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
  };

  const handleTrackTransport = () => {
    navigate(`/dispatch/${id}`);
    toast.success(`Tracking dispatch ${id}`);
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        priority === "high"
          ? "bg-red-50 border-red-200"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              to={`/dispatch/${id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Call #{id}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="ml-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {warnings && (
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{warnings}</span>
            </div>
          )}
        </div>

        <div className="text-right space-y-1">
          <div className="flex items-center gap-2 justify-end">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{activationTime}</span>
          </div>
          {elapsedTime && (
            <div className="text-sm text-gray-500">
              Elapsed: {elapsedTime}
            </div>
          )}
        </div>

      </div>

      <div className={`mt-4 space-y-4 ${isExpanded ? "" : "hidden"}`}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <Link 
                  to={`/patient/${patient.id}`}
                  className="text-base hover:text-blue-600 transition-colors"
                >
                  {patient.name}
                </Link>
              </div>
              {patient.condition && (
                <div className="text-sm text-gray-600">{patient.condition}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{destination}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-end gap-2">
              {assignedTo !== "Unassigned" ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Assigned to: {assignedTo}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleUnassign}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Unassign
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openAssignModal}
                  >
                    Assign Crew
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTrackTransport}
                    className="flex items-center gap-1"
                  >
                    <Navigation className="w-4 h-4" />
                    Track Transport
                  </Button>
                </div>
              )}
            </div>

            {progress !== undefined && progress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {efficiency !== undefined && (
              <div className="text-sm text-gray-600 text-right">
                Efficiency: {Math.round(efficiency * 100)}%
              </div>
            )}

            {lastUpdated && (
              <div className="text-sm text-gray-500 text-right">
                Last updated: {lastUpdated}
              </div>
            )}
          </div>
        </div>

        {aiRecommendations.insights && aiRecommendations.insights.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-medium text-blue-900 mb-1">AI Insights:</h4>
            <ul className="list-disc list-inside space-y-1">
              {aiRecommendations.insights.map((insight, index) => (
                <li key={index} className="text-sm text-blue-800">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CrewAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={closeAssignModal}
        dispatchId={id}
        serviceType={serviceType}
        origin={{ lat: 33.7490, lng: -84.3880 }}
        onAssign={handleAssign}
      />
    </div>
  );
}
