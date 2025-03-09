
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Brain, Clock, LineChart, TrendingUp, Award, User, BarChart, Activity } from "lucide-react";
import { PerformanceRankings } from "@/components/performance/PerformanceRankings";
import { AIEfficiencyCard } from "@/components/performance/AIEfficiencyCard";
import { PerformanceMetricsCard } from "@/components/performance/PerformanceMetricsCard";

const Performance = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              {/* AI Efficiency Card */}
              <AIEfficiencyCard />
              
              {/* AI Performance Rankings */}
              <PerformanceRankings />

              {/* Performance Metrics Card */}
              <PerformanceMetricsCard />
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Performance;
