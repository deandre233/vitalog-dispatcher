
import { Button } from "@/components/ui/button";
import { Users, XCircle, Shield, AlertCircle, MessageCircle } from "lucide-react";
import { DispatchStatus, DispatchStatusBar } from "../DispatchStatusBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

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
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleMessageCrew = () => {
    if (assignedTo === "Unassigned") {
      toast.error("Cannot message an unassigned crew");
      return;
    }
    
    setIsSendingMessage(true);
    
    // Simulate sending a message
    setTimeout(() => {
      setIsSendingMessage(false);
      toast.success(`Message sent to ${assignedTo}`);
    }, 800);
  };

  // Get the color styling based on the current status
  const getMessageButtonStyles = () => {
    switch (currentStatus) {
      case "dispatch":
        return "border-blue-200 text-blue-700 hover:bg-blue-50";
      case "enroute":
        return "border-indigo-200 text-indigo-700 hover:bg-indigo-50";
      case "onscene":
        return "border-violet-200 text-violet-700 hover:bg-violet-50";
      case "transporting":
        return "border-orange-200 text-orange-700 hover:bg-orange-50";
      case "destination":
        return "border-yellow-200 text-yellow-700 hover:bg-yellow-50";
      case "available":
        return "border-emerald-200 text-emerald-700 hover:bg-emerald-50";
      case "canceled":
        return "border-red-200 text-red-700 hover:bg-red-50";
      default:
        return "border-indigo-200 text-indigo-700 hover:bg-indigo-50";
    }
  };

  // Get the card background color
  const getMessageCardStyles = () => {
    switch (currentStatus) {
      case "dispatch":
        return "bg-blue-50 border-blue-200";
      case "enroute":
        return "bg-indigo-50 border-indigo-200";
      case "onscene":
        return "bg-violet-50 border-violet-200";
      case "transporting":
        return "bg-orange-50 border-orange-200";
      case "destination":
        return "bg-yellow-50 border-yellow-200";
      case "available":
        return "bg-emerald-50 border-emerald-200";
      case "canceled":
        return "bg-red-50 border-red-200";
      default:
        return "bg-indigo-50 border-indigo-200";
    }
  };

  return (
    <div className="space-y-3">
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="py-2 px-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-600 mr-1.5" />
            <h4 className="text-sm font-medium text-gray-700">Dispatch Actions</h4>
          </div>
        </CardHeader>
        
        <CardContent className="p-3">
          {assignedTo === "Unassigned" ? (
            <div className="space-y-2.5">
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
        </CardContent>
      </Card>

      {assignedTo === "Unassigned" ? (
        <Card className="border border-yellow-200 bg-yellow-50 shadow-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700">
              Assign a crew to enable status updates
            </span>
          </CardContent>
        </Card>
      ) : (
        <>
          <DispatchStatusBar
            currentStatus={currentStatus}
            onStatusChange={onStatusChange}
          />
          
          <Card className={`shadow-sm overflow-hidden ${getMessageCardStyles()}`}>
            <CardContent className="p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMessageCrew}
                disabled={isSendingMessage}
                className={`w-full flex items-center justify-center gap-1.5 ${getMessageButtonStyles()}`}
              >
                <MessageCircle className="h-4 w-4" />
                {isSendingMessage ? "Sending Message..." : "Message Crew"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
