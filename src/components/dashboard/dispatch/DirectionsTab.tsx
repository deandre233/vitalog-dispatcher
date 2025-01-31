import { MapPin } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface DirectionsTabProps {
  transportRecord: TransportRecord;
}

export function DirectionsTab({ transportRecord }: DirectionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Route Details</span>
      </div>
      <div className="pl-7 space-y-2">
        <p>From: {transportRecord.origin_address || transportRecord.pickup_location}</p>
        <p>To: {transportRecord.destination_address || transportRecord.dropoff_location}</p>
        {/* TODO: Implement map integration */}
      </div>
    </div>
  );
}