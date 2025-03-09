
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { DispatchStatus, DispatchStatusBar } from "../DispatchStatusBar";
import { AlertCircle } from "lucide-react";

interface DispatchActionsProps {
  assignedTo: string;
  openAssignModal: () => void;
  handleCancel: () => void;
  handleUnassign: () => void;
  currentStatus: DispatchStatus;
  onStatusChange: (newStatus: DispatchStatus) => void;
}

export function DispatchActions({
  assignedTo,
  openAssignModal,
  handleCancel,
  handleUnassign,
  currentStatus,
  onStatusChange
}: DispatchActionsProps) {
  return (
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
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}
