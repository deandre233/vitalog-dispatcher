import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InsuranceSection } from "./InsuranceSection";
import { Card } from "@/components/ui/card";

interface BillingTabContentProps {
  patientId: string;
}

export const BillingTabContent = ({ patientId }: BillingTabContentProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [insuranceRecords, setInsuranceRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchInsuranceRecords = async () => {
      try {
        if (!patientId) {
          console.log("No patient ID provided");
          setLoading(false);
          return;
        }

        console.log("Fetching insurance records for patient:", patientId);
        const { data, error } = await supabase
          .from("insurance_records")
          .select("*")
          .eq("patient_id", patientId);

        if (error) {
          console.error("Error fetching insurance records:", error);
          throw error;
        }
        
        console.log("Fetched insurance records:", data);
        setInsuranceRecords(data || []);
      } catch (error) {
        console.error("Error in fetchInsuranceRecords:", error);
        toast({
          title: "Error",
          description: "Failed to fetch insurance records",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceRecords();
  }, [patientId, toast]);

  if (!patientId) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">No patient selected</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">Loading insurance records...</p>
      </Card>
    );
  }

  const primaryRecords = insuranceRecords.filter(record => record.type === 'primary');
  const secondaryRecords = insuranceRecords.filter(record => record.type === 'secondary');
  const reservedRecords = insuranceRecords.filter(record => record.type === 'reserved');

  console.log("Filtered records:", {
    primary: primaryRecords,
    secondary: secondaryRecords,
    reserved: reservedRecords
  });

  return (
    <div className="space-y-6">
      <InsuranceSection 
        type="primary" 
        title="Primary Insurance" 
        records={primaryRecords}
      />
      <InsuranceSection 
        type="secondary" 
        title="Secondary Insurance" 
        records={secondaryRecords}
      />
      <InsuranceSection 
        type="reserved" 
        title="Reserved Insurance" 
        records={reservedRecords}
      />
    </div>
  );
};