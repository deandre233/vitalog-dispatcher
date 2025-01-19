import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InsuranceSection } from "./InsuranceSection";

interface BillingTabContentProps {
  patientId: string;
}

export const BillingTabContent = ({ patientId }: BillingTabContentProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [insuranceRecords, setInsuranceRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!patientId) {
      console.error("No patient ID provided");
      return;
    }

    const fetchInsuranceRecords = async () => {
      try {
        const { data, error } = await supabase
          .from("insurance_records")
          .select("*")
          .eq("patient_id", patientId);

        if (error) throw error;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <InsuranceSection type="primary" title="Primary Insurance" />
      <InsuranceSection type="secondary" title="Secondary Insurance" />
      <InsuranceSection type="reserved" title="Reserved Insurance" />
    </div>
  );
};