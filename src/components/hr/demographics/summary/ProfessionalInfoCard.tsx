
import { FileCheck } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { InfoGrid, InfoRow } from "./InfoGrid";
import { Employee } from "@/types/employee";

interface ProfessionalInfoCardProps {
  data: Partial<Employee>;
  formatDate: (date: string | undefined) => string;
}

export function ProfessionalInfoCard({ data, formatDate }: ProfessionalInfoCardProps) {
  return (
    <SummaryCard icon={FileCheck} title="Professional Information">
      <InfoGrid>
        <InfoRow 
          label="Certification Level" 
          value={data.certification_level || "Not specified"} 
        />
        <InfoRow 
          label="Certification Expiry" 
          value={formatDate(data.certification_expiry)} 
        />
        <InfoRow 
          label="Role" 
          value={data.employee_type || "Not specified"} 
        />
      </InfoGrid>
    </SummaryCard>
  );
}
