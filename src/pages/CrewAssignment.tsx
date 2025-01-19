import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";

const CrewAssignment = () => {
  const [selectedCrew, setSelectedCrew] = useState<string>("");

  const handleAssignCrew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrew) {
      toast.error("Please select a crew member");
      return;
    }
    
    toast.success(`Successfully assigned ${selectedCrew} to the dispatch`);
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
              <Card className="max-w-2xl mx-auto p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Assign Crew</h2>
                </div>

                <form onSubmit={handleAssignCrew} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="crew-select" className="text-sm font-medium text-gray-700">
                      Select Crew Member:
                    </label>
                    <Select onValueChange={setSelectedCrew} value={selectedCrew}>
                      <SelectTrigger id="crew-select" className="w-full">
                        <SelectValue placeholder="Select a crew member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MED 1">MED 1</SelectItem>
                        <SelectItem value="MED 2">MED 2</SelectItem>
                        <SelectItem value="MED 3">MED 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Assign Crew
                  </Button>
                </form>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default CrewAssignment;