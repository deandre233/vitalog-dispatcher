import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="fixed top-0 w-full z-50" />
      <div className="flex-1 flex pt-16">
        <SidebarProvider>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <AppSidebar />
          </div>
          <div className="flex-1 bg-[#f4f7fc]">
            <DashboardHeader />
            <main className="p-4">
              <DashboardMetrics />
              <DispatchBoard />
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Index;