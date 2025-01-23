import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <DashboardMetrics />
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Active Dispatches</h2>
                <DispatchBoard />
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;