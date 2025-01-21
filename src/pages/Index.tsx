import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader, ViewType } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ScheduledTransport } from "@/components/dashboard/ScheduledTransport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain } from "lucide-react";
import { useState } from "react";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { useTransportRecords } from "@/hooks/useTransportRecords";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('active');
  
  // Initialize real-time updates
  useRealtimeUpdates();
  
  // Fetch AI recommendations
  const { data: aiRecommendations, isLoading: isLoadingAI } = useAIRecommendations();
  const { transportRecords, isLoading: isLoadingTransports } = useTransportRecords();

  // Show AI insights when relevant
  const showAIInsights = aiRecommendations?.length > 0;

  const renderContent = () => {
    switch (currentView) {
      case 'active':
        return (
          <>
            <WelcomeBanner />
            {showAIInsights && (
              <Alert className="mb-4 bg-medical-highlight border-medical-secondary/20">
                <Brain className="h-4 w-4 text-medical-secondary" />
                <AlertDescription className="text-medical-primary">
                  {aiRecommendations[0].recommendation || aiRecommendations[0].suggestions?.[0] || "No AI recommendations available"}
                </AlertDescription>
              </Alert>
            )}
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