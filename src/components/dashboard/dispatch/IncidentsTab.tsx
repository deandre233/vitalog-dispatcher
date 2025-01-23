import { AlertCircle } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface IncidentsTabProps {
  transportRecord: TransportRecord;
}

export function IncidentsTab({ transportRecord }: IncidentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Incidents</span>
      </div>
      <div className="pl-7">
        <p className="text-gray-500">No incidents reported.</p>
      </div>
    </div>
  );
}