import { Users } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface CrewTabProps {
  transportRecord: TransportRecord;
}

export function CrewTab({ transportRecord }: CrewTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Assigned Crew</span>
      </div>
      <div className="pl-7">
        {transportRecord.crew_assigned ? (
          <p>{transportRecord.crew_assigned}</p>
        ) : (
          <p className="text-gray-500">No crew assigned yet.</p>
        )}
      </div>
    </div>
  );
}