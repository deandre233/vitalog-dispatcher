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
  Truck,
  Ambulance,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { HospitalStatus } from "./HospitalStatus";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      return "bg-gray-900/50 text-gray-200";
    case "enroute":
      return "bg-blue-900/50 text-blue-200";
    case "onscene":
      return "bg-green-900/50 text-green-200";
    case "transporting":
      return "bg-orange-900/50 text-orange-200";
    case "destination":
      return "bg-yellow-900/50 text-yellow-200";
    case "available":
      return "bg-emerald-900/50 text-emerald-200";
    case "canceled":
      return "bg-red-900/50 text-red-200";
    default:
      return "bg-gray-900/50 text-gray-200";
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
  const timeElapsed = formatDistanceToNow(new Date(activationTime));
  
  const getProgressColor = () => {
    if (!efficiency) return "bg-gray-600";
    if (efficiency > 80) return "bg-gradient-to-r from-emerald-500 to-blue-500";
    if (efficiency > 50) return "bg-gradient-to-r from-yellow-500 to-emerald-500";
    return "bg-gradient-to-r from-red-500 to-yellow-500";
  };

  const getPriorityBadge = () => {
    switch (priority) {
      case "high":
        return "bg-red-900/40 text-red-200 border-red-500/30";
      case "medium":
        return "bg-yellow-900/40 text-yellow-200 border-yellow-500/30";
      default:
        return "bg-blue-900/40 text-blue-200 border-blue-500/30";
    }
  };

  return (
    <div className={`futuristic-card p-4 transition-all duration-300 hover:shadow-purple-500/20 ${
      priority === "high" ? "border-red-500/30 shadow-red-500/10" : "border-[#334155]/50"
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to={`/dispatch/${id}`}
            className="text-lg font-semibold text-white hover:text-purple-300 transition-colors"
          >
            {id}
          </Link>
          <Badge className={`${getStatusColor(currentStatus)} py-1`}>
            {currentStatus}
          </Badge>
          <Badge className={`${getPriorityBadge()} py-1`}>
            {priority}
          </Badge>
          {assignedTo !== "Unassigned" && (
            <div className="flex items-center gap-2">
              <Ambulance className="h-4 w-4 text-blue-400" />
              <Link
                to={`/unit/${assignedTo}`}
                className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
              >
                {assignedTo}
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-400">
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
            className="ml-2 hover:bg-white/5"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-purple-300" />
            ) : (
              <ChevronDown className="h-4 w-4 text-purple-300" />
            )}
          </Button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-purple-400" />
          <Link 
            to={`/patient/${patient.id}`}
            className="text-sm text-gray-300 hover:text-purple-300 transition-colors"
          >
            {patient.name}
          </Link>
          {patient.condition && (
            <Badge variant="outline" className="bg-gray-900/30 text-gray-300 border-gray-700 text-xs">
              {patient.condition}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 justify-end">
          <MapPin className="h-4 w-4 text-red-400" />
          <span className="text-sm text-gray-400">{origin}</span>
          <ArrowRight className="h-3 w-3 text-gray-500" />
          <span className="text-sm text-gray-300">{destination}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Transport Progress</span>
          <span>{currentProgress}%</span>
        </div>
        <Progress value={currentProgress} className="h-2 bg-gray-900/50">
          <div className={`h-full ${getProgressColor()} rounded-full shimmer`} style={{ width: `${currentProgress}%` }} />
        </Progress>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-300">From: <span className="text-white">{origin}</span></div>
                  <div className="text-xs text-gray-500">{aiRecommendations.trafficStatus?.congestionLevel === "high" && (
                    <Badge className="bg-red-900/30 text-red-200 mt-1">High Traffic</Badge>
                  )}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-300">To: <span className="text-white">{destination}</span></div>
                  <div className="text-xs mt-1">
                    <HospitalStatus 
                      hospitalName={destination} 
                      className="bg-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-3 border border-purple-500/20">
                <h4 className="text-sm font-medium text-purple-300 mb-1">AI Recommendations:</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>{aiRecommendations.route}</div>
                  <div>{aiRecommendations.crew}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {assignedTo === "Unassigned" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openAssignModal}
                    className="flex-1 glass-panel bg-purple-900/20 text-purple-200 hover:bg-purple-800/40 border-purple-500/30"
                  >
                    Assign Crew
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancel}
                    className="flex-1 bg-red-900/30 hover:bg-red-800/50 text-red-200"
                  >
                    Cancel Dispatch
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleUnassign}
                          className="bg-red-900/30 hover:bg-red-800/50 text-red-200 flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Unassign
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black/80 text-white border-gray-700">
                        Remove crew assignment
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {assignedTo === "Unassigned" ? (
                <div className="glass-panel p-3 flex items-center gap-2 bg-yellow-950/20 border-yellow-500/30">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-300">
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
            <div className="flex items-center gap-2 text-yellow-300 glass-panel border-yellow-500/20 p-2 bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{warnings}</span>
            </div>
          )}

          {aiRecommendations.insights && aiRecommendations.insights.length > 0 && (
            <div className="glass-panel p-3 border-blue-500/20 bg-blue-950/10">
              <h4 className="font-medium text-blue-300 mb-1 flex items-center gap-2">
                <Settings className="h-3 w-3" />
                AI Insights:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {aiRecommendations.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-blue-200">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              {efficiency && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Efficiency:</span>
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor()}`} 
                      style={{ width: `${efficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-300">{Math.round(efficiency)}%</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTrackTransport}
              className="glass-panel bg-blue-900/20 text-blue-200 hover:bg-blue-800/40 border-blue-500/30 flex items-center gap-1"
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
