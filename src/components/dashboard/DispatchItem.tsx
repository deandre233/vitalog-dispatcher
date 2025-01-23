import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CrewAssignmentModal } from "./CrewAssignmentModal";
import { DispatchStatusBar, type DispatchStatus } from "./DispatchStatusBar";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  User,
  XCircle,
  AlertTriangle,
  Navigation,
  Truck,
  Ambulance,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  name: string;
  dob?: string;
  condition?: string;
  id: string;
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

const getProgressForStatus = (status: DispatchStatus): number => {
  switch (status) {
    case "dispatch":
      return 0;
    case "enroute":
      return 20;
    case "onscene":
      return 40;
    case "transporting":
      return 60;
    case "destination":
      return 80;
    case "available":
      return 100;
    case "canceled":
      return 0;
    default:
      return 0;
  }
};

const getStatusColor = (status: DispatchStatus): string => {
  switch (status) {
    case "dispatch":
      return "bg-gray-100 text-gray-700";
    case "enroute":
      return "bg-blue-100 text-blue-700";
    case "onscene":
      return "bg-green-100 text-green-700";
    case "transporting":
      return "bg-orange-100 text-orange-700";
    case "destination":
      return "bg-yellow-100 text-yellow-700";
    case "available":
      return "bg-emerald-100 text-emerald-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

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
  elapsedTime,
  lastUpdated,
  efficiency,
}: DispatchItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<DispatchStatus>("dispatch");
  const navigate = useNavigate();

  const handleUnassign = async () => {
    try {
      const { error } = await supabase
        .from('transport_records')
        .update({ crew_assigned: null })
        .eq('dispatch_id', id);

      if (error) throw error;
      toast.success(`Crew unassigned from dispatch ${id}`);
    } catch (error) {
      console.error('Error unassigning crew:', error);
      toast.error('Failed to unassign crew');
    }
  };

  const handleCancel = async () => {
    try {
      const { error } = await supabase
        .from('transport_records')
        .update({ dispatch_status: 'Canceled' })
        .eq('dispatch_id', id);

      if (error) throw error;
      toast.success(`Dispatch ${id} has been canceled`);
    } catch (error) {
      console.error('Error canceling dispatch:', error);
      toast.error('Failed to cancel dispatch');
    }
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

  const handleStatusChange = (newStatus: DispatchStatus) => {
    if (assignedTo === "Unassigned") {
      toast.error("Cannot change status until dispatch is assigned to a crew");
      return;
    }
    setCurrentStatus(newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  const currentProgress = getProgressForStatus(currentStatus);
  const timeElapsed = formatDistanceToNow(new Date(activationTime));

  return (
    <div
      className={`border rounded-lg p-4 ${
        priority === "high"
          ? "bg-red-50 border-red-200"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to={`/dispatch/${id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Call #{id}
          </Link>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
          {assignedTo !== "Unassigned" && (
            <div className="flex items-center gap-2">
              <Ambulance className="h-4 w-4 text-gray-500" />
              <Link
                to={`/unit/${assignedTo}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {assignedTo}
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Elapsed: {timeElapsed}</span>
            </div>
            {lastUpdated && (
              <div className="text-xs text-gray-500">
                Last updated: {format(new Date(lastUpdated), 'HH:mm')}
              </div>
            )}
          </div>
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
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Link 
            to={`/patient/${patient.id}`}
            className="text-sm hover:text-blue-600 transition-colors"
          >
            {patient.name}
          </Link>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{destination}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Transport Progress</span>
          <span>{currentProgress}%</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {patient.condition && (
                <div className="text-sm text-gray-600">{patient.condition}</div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">From: {origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">To: {destination}</span>
              </div>
            </div>

            <div className="space-y-2">
              {assignedTo === "Unassigned" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openAssignModal}
                    className="flex-1"
                  >
                    Assign Crew
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel Dispatch
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleUnassign}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Unassign
                  </Button>
                </div>
              )}

              {assignedTo === "Unassigned" ? (
                <div className="bg-yellow-50 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">
                    Assign a crew to enable status updates
                  </span>
                </div>
              ) : (
                <DispatchStatusBar
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          </div>

          {warnings && (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-2 rounded">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{warnings}</span>
            </div>
          )}

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

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTrackTransport}
              className="flex items-center gap-1"
            >
              <Truck className="h-4 w-4" />
              Track Transport
            </Button>
          </div>
        </div>
      )}

      <CrewAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={closeAssignModal}
        transportId={id}
        patientName={patient.name}
        patientId={patient.id}
        pickupLocation={origin}
        dropoffLocation={destination}
        scheduledTime={activationTime}
        warnings={warnings ? [warnings] : []}
      />
    </div>
  );
}
