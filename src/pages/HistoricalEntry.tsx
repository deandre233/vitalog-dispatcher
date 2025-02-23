import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { BackdatedDispatchForm } from "@/components/historical-entry/BackdatedDispatchForm";
import { AlertTriangle } from "lucide-react";

export const HistoricalEntry = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <Card className="p-6 mb-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">
                    You are creating a historical (backdated) dispatch entry. This should only be used for record-keeping purposes.
                  </p>
                </div>
              </Card>
              
              <BackdatedDispatchForm />
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default HistoricalEntry;