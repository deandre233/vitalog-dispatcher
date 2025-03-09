
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { PartnerTable } from "@/components/partner/PartnerTable";
import { PartnerAdvancedSearch } from "@/components/partner/PartnerAdvancedSearch";
import { PartnerMetrics } from "@/components/partner/PartnerMetrics";
import { PartnerInsights } from "@/components/partner/PartnerInsights";
import { MainLayout } from "@/components/layout/MainLayout";

type Partner = Tables<"partners">;

export function PartnerList() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideInactive, setHideInactive] = useState(false);
  const [nameFilter, setNameFilter] = useState<{ type: string; query: string }>({ 
    type: "contains", 
    query: "" 
  });

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

  // Apply filters when they change
  useEffect(() => {
    if (!partners.length) return;
    
    let filtered = [...partners];
    
    // Apply name filter
    if (nameFilter.query) {
      const query = nameFilter.query.toLowerCase();
      
      switch (nameFilter.type) {
        case "contains":
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query)
          );
          break;
        case "starts_with":
          filtered = filtered.filter(p => 
            p.name.toLowerCase().startsWith(query)
          );
          break;
        case "exact_match":
          filtered = filtered.filter(p => 
            p.name.toLowerCase() === query
          );
          break;
      }
    }
    
    // Apply status filter
    if (hideInactive) {
      filtered = filtered.filter(p => p.status === "active");
    }
    
    setFilteredPartners(filtered);
  }, [partners, nameFilter, hideInactive]);

  const handleNameFilterChange = (filter: { type: string; query: string }) => {
    setNameFilter(filter);
  };

  const handleHideInactiveChange = (checked: boolean) => {
    setHideInactive(checked);
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 space-y-6">
            <h1 className="text-3xl font-bold">Partner Management</h1>
            <PartnerAdvancedSearch 
              onNameFilterChange={handleNameFilterChange}
              onHideInactiveChange={handleHideInactiveChange}
              hideInactive={hideInactive}
            />
            <PartnerTable 
              partners={filteredPartners} 
              showInactive={!hideInactive}
            />
          </div>
          <div className="lg:w-1/4 space-y-6">
            <PartnerMetrics partners={partners} />
            <PartnerInsights />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PartnerList;
