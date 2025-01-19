import { MapPin } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface OverviewTabProps {
  transportRecord: TransportRecord;
}

export function OverviewTab({ transportRecord }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Transport Details</span>
      </div>
      <div className="pl-7 space-y-2">
        <p>From: {transportRecord?.pickup_location}</p>
        <p>To: {transportRecord?.dropoff_location}</p>
        <p>Status: {transportRecord?.status}</p>
      </div>
    </div>
  );
}