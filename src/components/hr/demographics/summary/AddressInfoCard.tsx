
import { MapPin } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { InfoGrid, InfoRow } from "./InfoGrid";
import { Employee } from "@/types/employee";

interface AddressInfoCardProps {
  data: Partial<Employee>;
}

export function AddressInfoCard({ data }: AddressInfoCardProps) {
  return (
    <SummaryCard icon={MapPin} title="Address Information">
      <InfoGrid>
        <InfoRow 
          label="Street Address" 
          value={
            <>
              {data.address_line1 || "Not provided"}
              {data.address_line2 && <div>{data.address_line2}</div>}
            </>
          } 
        />
        <InfoRow 
          label="City, State, ZIP" 
          value={data.city ? `${data.city}, ${data.state} ${data.zip_code}` : "Not provided"} 
        />
      </InfoGrid>
    </SummaryCard>
  );
}
