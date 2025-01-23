import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader, ViewType } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ScheduledTransport } from "@/components/dashboard/ScheduledTransport";
import { useState } from "react";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('active');

  const renderContent = () => {
    switch (currentView) {
      case 'active':
        return (
          <>
            <WelcomeBanner />
            <div className="mt-4">
              <DashboardMetrics />
            </div>
            <div className="mt-4">
              <DispatchBoard />
            </div>
          </>
        );
      case 'schedule':
        return <ScheduledTransport />;
      case 'calendar':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Calendar View</h2>
            <p className="text-gray-500">Calendar view coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarRail />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <DashboardHeader onViewChange={setCurrentView} defaultView={currentView} />
              <main className="p-4">
                {renderContent()}
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