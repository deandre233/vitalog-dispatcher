import { useParams } from 'react-router-dom';
import { usePatientData } from '@/hooks/usePatientData';

export const PatientRecord = () => {
  const { id } = useParams();
  const { patient, isLoading, error } = usePatientData(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading patient data.</div>;
  }

  return (
    <div>
      <h1>{patient?.first_name} {patient?.last_name}</h1>
      <p>DOB: {patient?.dob}</p>
      <p>Address: {patient?.address}</p>
      <p>Phone: {patient?.phone}</p>
      <p>Email: {patient?.email}</p>
      <h2>Medical Conditions</h2>
      <ul>
        {patient?.medical_conditions?.map((condition, index) => (
          <li key={index}>{condition}</li>
        ))}
      </ul>
      <h2>Medications</h2>
      <ul>
        {patient?.medications?.map((medication, index) => (
          <li key={index}>{medication}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientRecord;
