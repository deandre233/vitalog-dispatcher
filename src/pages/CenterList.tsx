import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Check, Phone, MapPin, Building2 } from "lucide-react";

interface Center {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  status: string;
  dispatch_count?: number;
  ai_recommendations?: {
    usage_pattern: string;
    efficiency_score: number;
    suggested_improvements: string[];
  };
}

export const CenterList = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [hideInactive, setHideInactive] = useState(true);
  const [hideNonContract, setHideNonContract] = useState(false);
  const [minDispatches, setMinDispatches] = useState("10");

  const { data: centers, isLoading } = useQuery({
    queryKey: ["centers", { hideInactive, hideNonContract, minDispatches }],
    queryFn: async () => {
      let query = supabase
        .from("centers")
        .select(`
          *,
          dispatch_assignments (count)
        `);

      if (hideInactive) {
        query = query.eq("status", "active");
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Failed to fetch centers");
        throw error;
      }

      // Simulate AI recommendations (in production, this would come from a real AI service)
      return (data || []).map(center => ({
        ...center,
        ai_recommendations: {
          usage_pattern: Math.random() > 0.5 ? "High utilization" : "Normal utilization",
          efficiency_score: Math.floor(Math.random() * 100),
          suggested_improvements: [
            "Consider extending operating hours",
            "Optimize staff scheduling based on peak times",
            "Implement automated dispatch confirmation"
          ]
        }
      }));
    }
  });

  const filteredCenters = centers?.filter(center => {
    if (nameFilter && !center.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (addressFilter && !center.address.toLowerCase().includes(addressFilter.toLowerCase())) return false;
    if (typeFilter && center.type !== typeFilter) return false;
    if (minDispatches && center.dispatch_count < parseInt(minDispatches)) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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
                    <h2 className="text-2xl font-semibold">Facilities List</h2>
                    <Button className="bg-medical-primary hover:bg-medical-primary/90">
                      Add New Facility
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name contains</label>
                      <Input
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        placeholder="Search by name..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Street address contains</label>
                      <Input
                        value={addressFilter}
                        onChange={(e) => setAddressFilter(e.target.value)}
                        placeholder="Search by address..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location type</label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nursing_home">Nursing Home</SelectItem>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="dialysis">Dialysis Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum dispatches</label>
                      <Select value={minDispatches} onValueChange={setMinDispatches}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any</SelectItem>
                          <SelectItem value="10">10+</SelectItem>
                          <SelectItem value="50">50+</SelectItem>
                          <SelectItem value="100">100+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hideInactive"
                        checked={hideInactive}
                        onCheckedChange={(checked) => setHideInactive(checked as boolean)}
                      />
                      <label htmlFor="hideInactive" className="text-sm font-medium">
                        Hide inactive facilities
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hideNonContract"
                        checked={hideNonContract}
                        onCheckedChange={(checked) => setHideNonContract(checked as boolean)}
                      />
                      <label htmlFor="hideNonContract" className="text-sm font-medium">
                        Hide non-contract facilities
                      </label>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <LoadingSpinner size={32} />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>AI Insights</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCenters?.map((center) => (
                            <TableRow key={center.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{center.id}</TableCell>
                              <TableCell>{center.name}</TableCell>
                              <TableCell>{center.type}</TableCell>
                              <TableCell className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                {center.address}
                              </TableCell>
                              <TableCell>{center.city}</TableCell>
                              <TableCell className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                {center.phone}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(center.status)}>
                                  {center.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className={`text-sm font-medium ${getEfficiencyColor(center.ai_recommendations?.efficiency_score || 0)}`}>
                                    Efficiency: {center.ai_recommendations?.efficiency_score}%
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {center.ai_recommendations?.usage_pattern}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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