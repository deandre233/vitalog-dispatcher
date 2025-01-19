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
      <SidebarProvider>
        <div className="flex flex-1 h-screen pt-16">
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <AppSidebar />
          </div>
          <div className="flex-1 ml-64 bg-[#f4f7fc]">
            <DashboardHeader />
            <main className="p-4">
              <DashboardMetrics />
              <DispatchBoard />
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
};

export default Index;