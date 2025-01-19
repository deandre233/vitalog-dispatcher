import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Clock, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - In a real app, this would come from an API
const patientData = {
  "Turner, Angela": {
    id: "12345",
    dob: "1967-08-17",
    medicalHistory: ["Breathing problems", "Impaired movement"],
    previousDispatches: [
      {
        id: "7684",
        origin: "Emory Dialysis At North Decatur",
        destination: "Emory University Hospital Midtown",
        status: "Completed"
      }
    ]
  }
};

export default function PatientRecord() {
  const { patientName } = useParams();
  const navigate = useNavigate();
  const patient = patientData[patientName as keyof typeof patientData];

  if (!patient) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Patient not found</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Patient Record: {patientName}</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>Patient ID: {patient.id}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Date of Birth: {patient.dob}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Medical History</h3>
            <ul className="list-disc list-inside space-y-2">
              {patient.medicalHistory.map((item, index) => (
                <li key={index} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Previous Dispatches</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transport ID</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.previousDispatches.map((dispatch) => (
                  <TableRow key={dispatch.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => navigate(`/dispatch/${dispatch.id}`)}
                      >
                        {dispatch.id}
                      </Button>
                    </TableCell>
                    <TableCell>{dispatch.origin}</TableCell>
                    <TableCell>{dispatch.destination}</TableCell>
                    <TableCell>{dispatch.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}