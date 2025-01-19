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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarRail />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <DashboardHeader />
              <main className="p-4">
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
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}

export default Index;