
import { Clock, ChevronDown, ChevronUp, Ambulance, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DispatchStatus } from "../DispatchStatusBar";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface DispatchHeaderProps {
  id: string;
  isExpanded: boolean;
  toggleExpand: () => void;
  currentStatus: DispatchStatus;
  assignedTo: string;
  activationTime: string;
  lastUpdated?: string;
  getStatusColor: (status: DispatchStatus) => string;
  priority?: string;
}

export function DispatchHeader({
  id,
  isExpanded,
  toggleExpand,
  currentStatus,
  assignedTo,
  activationTime,
  lastUpdated,
  getStatusColor,
  priority
}: DispatchHeaderProps) {
  const timeElapsed = formatDistanceToNow(new Date(activationTime));

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link 
              to={`/dispatch/${id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Call #{id}
            </Link>
            
            {priority === "high" && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>High Priority</span>
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
              {currentStatus}
            </span>
            
            {assignedTo !== "Unassigned" && (
              <div className="flex items-center gap-1.5">
                <Ambulance className="h-3.5 w-3.5 text-gray-500" />
                <Link
                  to={`/unit/${assignedTo}`}
                  className="text-xs font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {assignedTo}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeElapsed}</span>
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-0.5">
              Updated: {format(new Date(lastUpdated), 'HH:mm')}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="ml-1 h-8 w-8 p-0"
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
