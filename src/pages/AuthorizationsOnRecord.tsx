import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthorizationRecords } from "@/hooks/useAuthorizationRecords";
import { AuthorizationTable } from "@/components/authorization/AuthorizationTable";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const FACILITIES = [
  { value: "candler", label: "Emory Dialysis At Candler" },
  { value: "northside", label: "Emory Dialysis At Northside" },
  { value: "north-decatur", label: "Emory Dialysis At North Decatur" },
  { value: "airport", label: "Atlanta Airport Dialysis" }
] as const;

export const AuthorizationsOnRecord = () => {
  const [showExpired, setShowExpired] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showOneShot, setShowOneShot] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFacility, setSelectedFacility] = useState<string>("");

  const { authorizations, isLoading, error, stats, refetch } = useAuthorizationRecords();

  const handleRefresh = async () => {
    await refetch();
    toast.success("Authorization records refreshed");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Prior Authorizations On File</h2>
                <Button onClick={handleRefresh} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>

              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">Show authorizations as of:</span>
                    <DatePicker
                      date={selectedDate}
                      onDateChange={setSelectedDate}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="expired"
                        checked={showExpired}
                        onCheckedChange={(checked) => setShowExpired(checked as boolean)}
                      />
                      <Label htmlFor="expired">Include recent expirations</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="upcoming"
                        checked={showUpcoming}
                        onCheckedChange={(checked) => setShowUpcoming(checked as boolean)}
                      />
                      <Label htmlFor="upcoming">Include upcoming documents</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="oneshot"
                        checked={showOneShot}
                        onCheckedChange={(checked) => setShowOneShot(checked as boolean)}
                      />
                      <Label htmlFor="oneshot">Hide one-shot documents</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="deleted"
                        checked={showDeleted}
                        onCheckedChange={(checked) => setShowDeleted(checked as boolean)}
                      />
                      <Label htmlFor="deleted">Hide deleted documents</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Destination facility is:</span>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="All Facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      {FACILITIES.map((facility) => (
                        <SelectItem key={facility.value} value={facility.value}>
                          {facility.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <AuthorizationTable 
                    authorizations={authorizations || []} 
                    isLoading={isLoading} 
                  />
                </div>
                <div className="lg:col-span-1">
                  <AIInsightsPanel insights={stats?.aiInsights || []} />
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};
