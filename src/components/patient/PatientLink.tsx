import { Link } from "react-router-dom";

interface PatientLinkProps {
  patientId: string;
  firstName: string;
  lastName: string;
  className?: string;
}

export const PatientLink = ({ patientId, firstName, lastName, className }: PatientLinkProps) => {
  return (
    <Link
      to={`/patient/${patientId}`}
      className={`text-blue-600 hover:text-blue-800 hover:underline ${className || ''}`}
    >
      {firstName} {lastName}
    </Link>
  );
};