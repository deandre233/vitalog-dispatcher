import { useParams, useNavigate } from 'react-router-dom';
import { usePatientData } from '@/hooks/usePatientData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, isLoading, error } = usePatientData(id);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div>Loading patient data...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div>Error loading patient data.</div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card className="p-6">
        <div>Patient not found.</div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">{patient.first_name} {patient.last_name}</h1>
      <div className="space-y-4">
        <p><span className="font-medium">DOB:</span> {patient.dob}</p>
        <p><span className="font-medium">Address:</span> {patient.address}</p>
        <p><span className="font-medium">Phone:</span> {patient.phone}</p>
        <p><span className="font-medium">Email:</span> {patient.email}</p>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Medical Conditions</h2>
          <ul className="list-disc pl-5">
            {patient.medical_conditions?.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Medications</h2>
          <ul className="list-disc pl-5">
            {patient.medications?.map((medication, index) => (
              <li key={index}>{medication}</li>
            ))}
          </ul>
        </div>

        <Button onClick={() => navigate(-1)} variant="outline">
          Back to Directory
        </Button>
      </div>
    </Card>
  );
};

export default PatientRecord;