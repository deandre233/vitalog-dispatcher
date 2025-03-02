
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, AlertTriangle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { formatPhoneNumber } from "@/utils/stringUtils";

type Patient = Tables<"patients">;

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (patient: Patient) => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const lastPhysical = patient.last_physical ? new Date(patient.last_physical) : null;
    
    if (!lastPhysical) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          No Records
        </Badge>
      );
    }
    
    if (lastPhysical < lastYear) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Due Visit
        </Badge>
      );
    }
    
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  return (
    <div className="glass-panel rounded-lg border border-medical-secondary/20">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-medical-secondary/5">
            <TableHead className="text-medical-secondary">ID</TableHead>
            <TableHead className="text-medical-secondary">Name</TableHead>
            <TableHead className="text-medical-secondary">Contact</TableHead>
            <TableHead className="text-medical-secondary">Insurance</TableHead>
            <TableHead className="text-medical-secondary">Last Visit</TableHead>
            <TableHead className="text-medical-secondary">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient: Patient) => (
            <TableRow
              key={patient.id}
              className="cursor-pointer hover:bg-medical-highlight transition-colors duration-300"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <TableCell className="font-medium">
                {patient.legacy_display_id || patient.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{patient.last_name}, {patient.first_name}</div>
                  <div className="text-sm text-gray-500">
                    DOB: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{formatPhoneNumber(patient.phone || '')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{patient.email || 'N/A'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {patient.primary_insurance && (
                    <div className="text-medical-primary">{patient.primary_insurance}</div>
                  )}
                  {patient.secondary_insurance && (
                    <div className="text-sm text-medical-secondary">
                      {patient.secondary_insurance}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {patient.last_physical ? (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(patient.last_physical).toLocaleDateString()}</span>
                  </div>
                ) : (
                  'No records'
                )}
              </TableCell>
              <TableCell>{getStatusBadge(patient)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PatientTable;
