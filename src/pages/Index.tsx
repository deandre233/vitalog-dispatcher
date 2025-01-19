import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { AlertsConfig } from "@/components/dashboard/AlertsConfig";

const Index = () => {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4">
        <WelcomeBanner />
        <div className="mt-4">
          <DashboardMetrics />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <div className="lg:col-span-3">
            <DispatchBoard />
          </div>
          <div className="lg:col-span-1">
            <AlertsConfig />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;