import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/common/SearchBar";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PartnerTable } from "@/components/partner/PartnerTable";
import { PartnerMetrics } from "@/components/partner/PartnerMetrics";
import { PartnerInsights } from "@/components/partner/PartnerInsights";
import { Tables } from "@/integrations/supabase/types";
import { api } from "@/services/api";

type Partner = Tables<"partners">;

export const PartnerList = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Partner>("partners");
      setPartners(data);
      setFilteredPartners(data);
    } catch (error) {
      toast({
        title: "Error loading partners",
        description: "There was an error loading the partner list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (results: Partner[]) => {
    setFilteredPartners(results);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Partner Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and monitor your business partnerships with AI-powered insights
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size={40} />
                </div>
              ) : (
                <>
                  <PartnerMetrics partners={partners} />

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <Card className="p-6">
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Partner List</h2>
                            <Button className="bg-medical-primary text-white hover:bg-medical-primary/90">
                              Add Partner
                            </Button>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <SearchBar
                                items={partners}
                                searchFields={["name", "contact_name", "partnership_type"]}
                                onResultsChange={handleSearch}
                                placeholder="Search partners..."
                                className="w-full"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="show-inactive"
                                checked={showInactive}
                                onCheckedChange={(checked) => setShowInactive(!!checked)}
                              />
                              <label
                                htmlFor="show-inactive"
                                className="text-sm text-gray-600"
                              >
                                Show inactive
                              </label>
                            </div>
                          </div>

                          <PartnerTable
                            partners={filteredPartners}
                            showInactive={showInactive}
                          />
                        </div>
                      </Card>
                    </div>

                    <div className="lg:col-span-1">
                      <PartnerInsights />
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};