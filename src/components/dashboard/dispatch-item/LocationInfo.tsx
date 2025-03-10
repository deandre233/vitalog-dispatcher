
import { MapPin, Navigation, User, Clock, Ambulance } from "lucide-react";
import { HospitalStatus } from "../HospitalStatus";
import { Badge } from "@/components/ui/badge";

interface LocationInfoProps {
  origin: string;
  destination: string;
  patientCondition?: string;
  eta?: string;
}

export function LocationInfo({ origin, destination, patientCondition, eta }: LocationInfoProps) {
  return (
    <div className="space-y-4">
      {patientCondition && (
        <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-medium text-blue-700">Patient Condition</div>
          </div>
          <div className="ml-6 mt-1 text-sm text-blue-800">{patientCondition}</div>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
          <div className="flex items-center">
            <Navigation className="h-4 w-4 text-gray-600 mr-1.5" />
            <h4 className="text-sm font-medium text-gray-700">Transport Information</h4>
          </div>
        </div>
        
        <div className="p-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Pickup Location</div>
              <div className="text-sm font-medium">{origin}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-7 h-7 bg-indigo-100 rounded-full flex-shrink-0 mt-0.5">
              <MapPin className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Destination</div>
              <div className="text-sm font-medium">{destination}</div>
            </div>
          </div>
          
          {eta && (
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Estimated Arrival</div>
                <div className="text-sm font-medium">{eta}</div>
              </div>
            </div>
          )}
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
