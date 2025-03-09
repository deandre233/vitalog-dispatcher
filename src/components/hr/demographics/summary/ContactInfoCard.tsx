
import { Phone } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { InfoGrid, InfoRow } from "./InfoGrid";
import { Employee } from "@/types/employee";

interface ContactInfoCardProps {
  data: Partial<Employee>;
  formatPhone: (phone: string | undefined) => string;
}

export function ContactInfoCard({ data, formatPhone }: ContactInfoCardProps) {
  return (
    <SummaryCard icon={Phone} title="Contact Information">
      <InfoGrid>
        <InfoRow 
          label="Email" 
          value={data.email || "Not provided"} 
        />
        <InfoRow 
          label="Mobile Phone" 
          value={formatPhone(data.mobile)} 
        />
        {data.home_phone && (
          <InfoRow 
            label="Home Phone" 
            value={formatPhone(data.home_phone)} 
          />
        )}
        {data.work_phone && (
          <InfoRow 
            label="Work Phone" 
            value={formatPhone(data.work_phone)} 
          />
        )}
        <InfoRow 
          label="Preferred Contact" 
          value={data.preferred_contact_method ? 
            data.preferred_contact_method.charAt(0).toUpperCase() + 
            data.preferred_contact_method.slice(1) : 
            "Not specified"} 
        />
      </InfoGrid>
    </SummaryCard>
  );
}
