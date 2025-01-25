import { useParams } from 'react-router-dom';
import { usePatientData } from '@/hooks/usePatientData';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const PatientRecord = () => {
  const { id } = useParams();
  const { patient, isLoading, error } = usePatientData(id);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-[250px]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load patient data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          No patient found with the provided ID.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{patient.first_name} {patient.last_name}</h1>
        <div className="space-y-2">
          <p><span className="font-semibold">DOB:</span> {patient.dob}</p>
          <p><span className="font-semibold">Address:</span> {patient.address}</p>
          <p><span className="font-semibold">Phone:</span> {patient.phone}</p>
          <p><span className="font-semibold">Email:</span> {patient.email}</p>
        </div>
      </Card>

      {patient.medical_conditions && patient.medical_conditions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Medical Conditions</h2>
          <ul className="list-disc list-inside space-y-1">
            {patient.medical_conditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </Card>
      )}

      {patient.medications && patient.medications.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Medications</h2>
          <ul className="list-disc list-inside space-y-1">
            {patient.medications.map((medication, index) => (
              <li key={index}>{medication}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default PatientRecord;