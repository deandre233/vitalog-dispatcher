import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-medical-accent">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main>
            <SidebarTrigger className="lg:hidden" />
            <DashboardMetrics />
            <DispatchBoard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;