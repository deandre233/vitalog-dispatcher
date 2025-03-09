
import { Clock, ChevronDown, ChevronUp, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DispatchStatus } from "../DispatchStatusBar";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

interface DispatchHeaderProps {
  id: string;
  isExpanded: boolean;
  toggleExpand: () => void;
  currentStatus: DispatchStatus;
  assignedTo: string;
  activationTime: string;
  lastUpdated?: string;
  getStatusColor: (status: DispatchStatus) => string;
}

export function DispatchHeader({
  id,
  isExpanded,
  toggleExpand,
  currentStatus,
  assignedTo,
  activationTime,
  lastUpdated,
  getStatusColor
}: DispatchHeaderProps) {
  const timeElapsed = formatDistanceToNow(new Date(activationTime));

  return (
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
  );
}
