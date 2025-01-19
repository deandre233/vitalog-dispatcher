import { 
  MapPin, 
  Clock, 
  Ambulance, 
  User, 
  Building, 
  AlertTriangle, 
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
  XCircle
} from "lucide-react";
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
import { DispatchStatusBar, DispatchStatus } from "./DispatchStatusBar";
import { toast } from "sonner";

interface AIRecommendations {
  route: string;
  crew: string;
  billing: string;
}

interface DispatchItemProps {
  id: string;
  activationTime: string;
  assignedTo: string;
  patient: {
    name: string;
    dob?: string;
    condition?: string;
  };
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
  elapsedTime?: string;
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
  elapsedTime,
}: DispatchItemProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<DispatchStatus>(status.toLowerCase().replace(" ", "") as DispatchStatus);

  const calculateProgress = (status: DispatchStatus): number => {
    const statusValues = {
      dispatch: 0,
      enroute: 20,
      onscene: 40,
      transporting: 60,
      destination: 80,
      available: 100
    };
    return statusValues[status] || 0;
  };

  const handleStatusChange = (newStatus: DispatchStatus) => {
    setCurrentStatus(newStatus);
    toast.success(`Dispatch ${id} status updated to ${newStatus}`);
  };

  const handleUnassign = () => {
    setCurrentAssignedTo("Unassigned");
    toast.success(`Dispatch ${id} has been unassigned`, {
      description: "The dispatch is now available for reassignment"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en route":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col bg-white border rounded-lg hover:bg-gray-50 transition-colors">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">#{id}</span>
            {elapsedTime && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {elapsedTime}
              </div>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {/* Status Bar */}
      <div className="px-4 py-2 border-b">
        <DispatchStatusBar 
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Main Content */}
      <div className="p-4">
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

            {/* Patient Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{patient.name}</span>
              </div>
              {patient.dob && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{patient.dob}</span>
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm truncate max-w-[180px]">{origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm truncate max-w-[180px]">{destination}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">ETA: {eta}</div>
            <div className="flex items-center gap-2">
              {currentAssignedTo !== "Unassigned" ? (
                <>
                  <span className="text-sm font-medium">Assigned to: {currentAssignedTo}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleUnassign}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Unassign
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssignModalOpen(true)}
                >
                  Assign Crew
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Transport Progress</span>
            <span className="text-sm font-medium">{calculateProgress(currentStatus)}%</span>
          </div>
          <Progress value={calculateProgress(currentStatus)} className="h-2" />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            {/* Warnings and Comments */}
            {(warnings || comments || patient.condition) && (
              <div className="space-y-2">
                {warnings && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{warnings}</span>
                  </div>
                )}
                {patient.condition && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Condition: {patient.condition}</span>
                  </div>
                )}
                {comments && (
                  <div className="text-sm text-gray-600">{comments}</div>
                )}
              </div>
            )}

            {/* AI Recommendations */}
            {aiRecommendations && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-700 mb-2">AI Insights</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-600">{aiRecommendations.route}</li>
                  <li className="text-sm text-blue-600">{aiRecommendations.crew}</li>
                  <li className="text-sm text-blue-600">{aiRecommendations.billing}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

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
