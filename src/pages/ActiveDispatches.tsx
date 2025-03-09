
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const ActiveDispatches = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#0f172a] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <DispatchBoard />
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default ActiveDispatches;
