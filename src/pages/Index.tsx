import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-[#f4f7fc]">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1">
            <DashboardHeader />
            <main className="p-4">
              <DashboardMetrics />
              <DispatchBoard />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Index;