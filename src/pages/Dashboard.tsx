import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { useState } from "react";
import type { ViewType } from "@/components/dashboard/DashboardHeader";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("active");

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onViewChange={handleViewChange} defaultView={currentView} />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <WelcomeBanner />
        <DashboardMetrics />
        <DispatchBoard />
      </div>
    </div>
  );
}