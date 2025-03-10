
import { Button } from "@/components/ui/button";
import { Users, XCircle, Shield } from "lucide-react";
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
    <div className="space-y-4">
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-600 mr-1.5" />
            <h4 className="text-sm font-medium text-gray-700">Dispatch Actions</h4>
          </div>
        </div>
        
        <div className="p-3">
          {assignedTo === "Unassigned" ? (
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={openAssignModal}
                className="w-full flex items-center justify-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Users className="h-4 w-4" />
                Assign Crew
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Cancel Dispatch
              </Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnassign}
                className="flex items-center gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Unassign
              </Button>
            </div>
          )}
        </div>
      </div>

      {assignedTo === "Unassigned" ? (
        <div className="bg-yellow-50 p-3 rounded-md flex items-center gap-2 border border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <span className="text-sm text-yellow-700">
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
