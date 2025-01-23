import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";

export const PatientRecord = () => {
  const { patientName } = useParams();

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
                <h2 className="text-2xl font-semibold mb-6">Patient Record</h2>
                <p className="text-gray-500">Record for patient: {patientName}</p>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};