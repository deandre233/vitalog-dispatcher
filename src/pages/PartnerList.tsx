
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { PartnerTable } from "@/components/partner/PartnerTable";
import { PartnerAdvancedSearch } from "@/components/partner/PartnerAdvancedSearch";
import { PartnerInsights } from "@/components/partner/PartnerInsights";
import { PartnerMetrics } from "@/components/partner/PartnerMetrics";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";

interface Partner {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  contact: string;
  relationship_manager: string;
  last_contact: string;
  satisfaction_score: number;
}

export const PartnerList = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      // Using the updated api.list method
      const response = await api.list<Partner>("partners");
      const partnerData = response.items;
      setPartners(partnerData);
      setFilteredPartners(partnerData);
    } catch (error) {
      toast({
        title: "Error loading partners",
        description: error instanceof Error ? error.message : "Failed to load partner data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleSearch = (searchResults: Partner[]) => {
    setFilteredPartners(searchResults);
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Partner Management</h1>
                <Link to="/partners/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Partner
                  </Button>
                </Link>
              </div>

              <PartnerMetrics partners={partners} isLoading={isLoading} />

              <Tabs defaultValue="listing" className="mt-6">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="listing" className="gap-2">
                    <Search className="h-4 w-4" />
                    Partner Listing
                  </TabsTrigger>
                  <TabsTrigger value="search" className="gap-2">
                    <Search className="h-4 w-4" />
                    Advanced Search
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2">
                    <BarChart className="h-4 w-4" />
                    Partner Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="listing" className="space-y-6">
                  <PartnerTable
                    partners={filteredPartners}
                    isLoading={isLoading}
                    onRefresh={loadPartners}
                  />
                </TabsContent>

                <TabsContent value="search" className="space-y-6">
                  <PartnerAdvancedSearch
                    allPartners={partners}
                    onSearch={handleSearch}
                  />
                  <PartnerTable
                    partners={filteredPartners}
                    isLoading={isLoading}
                    onRefresh={loadPartners}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <PartnerInsights partners={partners} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
