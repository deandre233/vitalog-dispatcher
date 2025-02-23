
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Clock } from "lucide-react";

interface PatientDetailsProps {
  patientName: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  warnings?: string[];
  onClick: () => void;
}

export function PatientDetails({
  patientName,
  pickupLocation,
  dropoffLocation,
  scheduledTime,
  warnings = [],
  onClick
}: PatientDetailsProps) {
  return (
    <div 
      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{patientName}</h3>
        <div className="flex gap-2">
          {warnings.map((warning, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {warning}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Pickup: {pickupLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Dropoff: {dropoffLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Scheduled: {new Date(scheduledTime).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
