import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";

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
                <div className="mt-4">
                  <DispatchBoard />
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