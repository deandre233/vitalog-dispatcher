import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { useState } from "react";
import type { ViewType } from "@/components/dashboard/DashboardHeader";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("active");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onViewChange={setCurrentView} defaultView="active" />
      <WelcomeBanner />
      <DashboardMetrics />
      <DispatchBoard />
    </div>
  );
}