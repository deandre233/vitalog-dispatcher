import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/common/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { Tables } from "@/integrations/supabase/types";
import { Phone, MapPin, Building2, Clock } from "lucide-react";

type Partner = Tables<"partners">;

export const PartnerList = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await api.get<Partner>("partners");
      setPartners(data);
      setFilteredPartners(data);
    } catch (error) {
      toast({
        title: "Error loading partners",
        description: "There was an error loading the partner list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (results: Partner[]) => {
    setFilteredPartners(results);
  };

  const getStatusBadge = (status: string | null) => {
    const statusColors = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      pending: "bg-yellow-500",
    };

    return (
      <Badge 
        className={`${statusColors[status?.toLowerCase() ?? "inactive"]} text-white`}
      >
        {status || "Unknown"}
      </Badge>
    );
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
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Partner List</h2>
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
                      <label htmlFor="show-inactive" className="text-sm text-gray-600">
                        Show inactive
                      </label>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Service Level</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Street Address</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Telephone</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPartners
                          .filter(partner => showInactive || partner.status === "active")
                          .map((partner) => (
                            <TableRow key={partner.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <Building2 className="h-4 w-4 text-gray-400" />
                                  <span>{partner.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{partner.partnership_type}</TableCell>
                              <TableCell>{partner.partnership_type}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span>24/7</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span>{partner.contact_name}</span>
                                </div>
                              </TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{partner.contact_phone}</span>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(partner.status)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};