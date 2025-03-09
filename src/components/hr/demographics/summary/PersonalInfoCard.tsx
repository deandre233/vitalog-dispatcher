
import { UserCircle } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { InfoGrid, InfoRow } from "./InfoGrid";
import { Employee } from "@/types/employee";

interface PersonalInfoCardProps {
  data: Partial<Employee>;
  formatDate: (date: string | undefined) => string;
  calculateAge: (date: string | undefined) => string | number;
}

export function PersonalInfoCard({ data, formatDate, calculateAge }: PersonalInfoCardProps) {
  return (
    <SummaryCard icon={UserCircle} title="Personal Information">
      <InfoGrid>
        <InfoRow 
          label="Full Name" 
          value={`${data.first_name} ${data.last_name}`} 
        />
        <InfoRow 
          label="Date of Birth" 
          value={
            <>
              {formatDate(data.date_of_birth)}
              {data.date_of_birth && (
                <span className="text-muted-foreground ml-1">
                  ({calculateAge(data.date_of_birth)} years)
                </span>
              )}
            </>
          } 
        />
        <InfoRow 
          label="Gender" 
          value={data.gender || "Not specified"} 
        />
        <InfoRow 
          label="Citizenship" 
          value={data.citizenship || "Not specified"} 
        />
        <InfoRow 
          label="Race/Ethnicity" 
          value={data.race_ethnicity || "Not specified"} 
        />
        {data.secondary_race && (
          <InfoRow 
            label="Secondary Race" 
            value={data.secondary_race} 
          />
        )}
      </InfoGrid>
    </SummaryCard>
  );
}
