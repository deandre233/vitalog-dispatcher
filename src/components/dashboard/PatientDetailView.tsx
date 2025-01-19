import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function PatientDetailView() {
  const { patientId } = useParams();

  return (
    <Card className="p-6 m-6">
      <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
      <p>Patient ID: {patientId}</p>
    </Card>
  );
}