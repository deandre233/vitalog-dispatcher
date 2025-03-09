
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/api";
import { PartnerTable } from "@/components/partner/PartnerTable";
import { PartnerAdvancedSearch } from "@/components/partner/PartnerAdvancedSearch";
import { PartnerMetrics } from "@/components/partner/PartnerMetrics";
import { PartnerInsights } from "@/components/partner/PartnerInsights";
import { MainLayout } from "@/components/layout/MainLayout";

type Partner = {
  id: string;
  name: string;
  partner_type: string;
  status: string;
  location: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contract_start_date: string;
  contract_end_date: string;
  notes: string;
  ai_recommendations: any;
  created_at: string;
  updated_at: string;
};

export function PartnerList() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('partners')
          .select('*');

        if (error) throw error;
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setPartners(data);
          setFilteredPartners(data);
        } else {
          // Handle case where data is not an array
          setPartners([]);
          setFilteredPartners([]);
          console.warn("Expected array of partners but received:", data);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        toast({
          title: "Error",
          description: "Failed to load partner list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [toast]);

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 space-y-6">
            <h1 className="text-3xl font-bold">Partner Management</h1>
            <PartnerAdvancedSearch 
              partners={partners} 
              setFilteredPartners={setFilteredPartners} 
            />
            <PartnerTable 
              partners={filteredPartners} 
              loading={loading} 
            />
          </div>
          <div className="lg:w-1/4 space-y-6">
            <PartnerMetrics partners={partners} />
            <PartnerInsights partners={partners} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PartnerList;
