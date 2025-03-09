
import { User, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface Patient {
  name: string;
  id: string;
}

interface PatientSummaryProps {
  patient: Patient;
  destination: string;
  currentProgress: number;
}

export function PatientSummary({ patient, destination, currentProgress }: PatientSummaryProps) {
  return (
    <>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Link 
            to={`/patient/${patient.id}`}
            className="text-sm hover:text-blue-600 transition-colors"
          >
            {patient.name}
          </Link>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{destination}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Transport Progress</span>
          <span>{currentProgress}%</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>
    </>
  );
}
