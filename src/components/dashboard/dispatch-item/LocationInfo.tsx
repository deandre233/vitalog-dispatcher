
import { MapPin, AlertTriangle, Activity, Heart, Baby } from "lucide-react";
import { HospitalStatus } from "../HospitalStatus";
import { Badge } from "@/components/ui/badge";

interface LocationInfoProps {
  origin: string;
  destination: string;
  patientCondition?: string;
}

export function LocationInfo({ origin, destination, patientCondition }: LocationInfoProps) {
  return (
    <div className="space-y-4">
      {patientCondition && (
        <div className="p-2 bg-blue-50 rounded-md">
          <div className="text-sm font-medium text-blue-700">{patientCondition}</div>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Transport Route</h4>
        <div className="p-3 bg-gray-50 rounded-md space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <span className="text-sm">From: <span className="font-medium">{origin}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <span className="text-sm">To: <span className="font-medium">{destination}</span></span>
          </div>
        </div>
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
