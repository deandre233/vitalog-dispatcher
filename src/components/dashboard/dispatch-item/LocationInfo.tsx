
import { MapPin } from "lucide-react";
import { HospitalStatus } from "../HospitalStatus";

interface LocationInfoProps {
  origin: string;
  destination: string;
  patientCondition?: string;
}

export function LocationInfo({ origin, destination, patientCondition }: LocationInfoProps) {
  return (
    <div className="space-y-2">
      {patientCondition && (
        <div className="text-sm text-gray-600">{patientCondition}</div>
      )}
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">From: {origin}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">To: {destination}</span>
      </div>
      
      {destination && (
        <HospitalStatus 
          hospitalName={destination} 
          className="mt-2"
        />
      )}
    </div>
  );
}
