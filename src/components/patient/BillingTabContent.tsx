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
          console.log("Waiting for patient ID...");
          return;
        }

        console.log("Fetching insurance records for patient:", patientId);
        const { data, error } = await supabase
          .from("insurance_records")
          .select("*")
          .eq("patient_id", patientId);

        if (error) throw error;
        
        console.log("Fetched insurance records:", data);
        setInsuranceRecords(data || []);
      } catch (error) {
        console.error("Error fetching insurance records:", error);
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

  return (
    <div className="space-y-6">
      <InsuranceSection 
        type="primary" 
        title="Primary Insurance" 
        records={insuranceRecords.filter(record => record.type === 'primary')}
      />
      <InsuranceSection 
        type="secondary" 
        title="Secondary Insurance" 
        records={insuranceRecords.filter(record => record.type === 'secondary')}
      />
      <InsuranceSection 
        type="reserved" 
        title="Reserved Insurance" 
        records={insuranceRecords.filter(record => record.type === 'reserved')}
      />
    </div>
  );
};