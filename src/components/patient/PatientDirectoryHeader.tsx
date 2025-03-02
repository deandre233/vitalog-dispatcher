
import { PatientInsights } from "@/components/patient/PatientInsights";

export function PatientDirectoryHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-medical-primary mb-6">
        Patient Directory
      </h1>
      <PatientInsights />
    </div>
  );
}

export default PatientDirectoryHeader;
