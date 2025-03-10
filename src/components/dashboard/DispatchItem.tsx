
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CrewAssignmentModal } from "./CrewAssignmentModal";
import { DispatchStatus } from "./DispatchStatusBar";
import {
  DispatchHeader,
  PatientSummary,
  DispatchActions,
  LocationInfo,
  DispatchWarnings,
  AIInsightsDisplay,
  DispatchTracker,
  getProgressForStatus,
  getStatusColor
} from "./dispatch-item";

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
  const [currentStatus, setCurrentStatus] = useState<DispatchStatus>(status as DispatchStatus || "dispatch");
  const navigate = useNavigate();

  const handleUnassign = () => {
    toast.success(`Crew unassigned from dispatch ${id}`);
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
  
  // Get background colors based on status
  const getBackgroundColorClass = () => {
    if (priority === "high") {
      return "bg-red-50 border-red-200";
    }
    
    switch (currentStatus) {
      case "dispatch":
        return "bg-gray-50 border-gray-200";
      case "enroute":
        return "bg-blue-50 border-blue-200";
      case "onscene":
        return "bg-green-50 border-green-200";
      case "transporting":
        return "bg-orange-50 border-orange-200";
      case "destination":
        return "bg-yellow-50 border-yellow-200";
      case "available":
        return "bg-emerald-50 border-emerald-200";
      case "canceled":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 hover:bg-opacity-90 transition-colors duration-200 ${
        getBackgroundColorClass()
      }`}
    >
      <DispatchHeader
        id={id}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        currentStatus={currentStatus}
        assignedTo={assignedTo}
        activationTime={activationTime}
        lastUpdated={lastUpdated}
        getStatusColor={getStatusColor}
        priority={priority}
      />

      <PatientSummary
        patient={patient}
        destination={destination}
        currentProgress={currentProgress}
      />

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <LocationInfo
              origin={origin}
              destination={destination}
              patientCondition={patient.condition}
            />

            <DispatchActions
              assignedTo={assignedTo}
              openAssignModal={openAssignModal}
              handleCancel={handleCancel}
              handleUnassign={handleUnassign}
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
            />
          </div>

          <DispatchWarnings warnings={warnings} />
          <AIInsightsDisplay aiRecommendations={aiRecommendations} />
          <DispatchTracker handleTrackTransport={handleTrackTransport} />
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
