
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DispatchAlertProps {
  unassignedCount: number;
  assignedCount: number;
}

export function DispatchAlert({ unassignedCount, assignedCount }: DispatchAlertProps) {
  return (
    <Alert className="mb-4 glass-panel border-purple-500/40 bg-purple-950/60 shadow-md shadow-purple-500/30">
      <AlertTriangle className="h-5 w-5 text-purple-200" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-purple-50 font-medium text-shadow-sm">
          {unassignedCount} dispatches waiting for assignment. 
          {assignedCount > 0 && ` ${assignedCount} active transports progressing normally.`}
        </span>
        <div className="flex gap-2">
          {unassignedCount > 0 && (
            <Badge className="bg-red-800 text-red-50 hover:bg-red-700 font-bold border border-red-500/40 px-3 py-1 shadow shadow-red-500/20">
              {unassignedCount} Unassigned
            </Badge>
          )}
          {assignedCount > 0 && (
            <Badge className="bg-green-800 text-green-50 hover:bg-green-700 font-bold border border-green-500/40 px-3 py-1 shadow shadow-green-500/20">
              {assignedCount} Active
            </Badge>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
