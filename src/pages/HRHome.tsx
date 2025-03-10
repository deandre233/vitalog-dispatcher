
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { HRStatusCards } from "@/components/hr/dashboard/HRStatusCards";
import { HRQuickActionPanel } from "@/components/hr/dashboard/HRQuickActionPanel";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { HRDashboardHeader } from "@/components/hr/dashboard/HRDashboardHeader";
import { HRDashboardTabs } from "@/components/hr/dashboard/HRDashboardTabs";
import { HRDashboardSidebar } from "@/components/hr/dashboard/HRDashboardSidebar";
import { HRAIRecommendations } from "@/components/hr/dashboard/HRAIRecommendations";

export default function HRHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [statusData, setStatusData] = useState({
    onDuty: 0,
    onCall: 0,
    incidentsOpen: 0,
    scheduleRequests: 0,
    employeesStale: 0,
  });
  
  const [complianceData, setComplianceData] = useState({
    upToDate: 0,
    expiringWithin30Days: 0,
    expired: 0,
    completionRate: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusData({
        onDuty: 11,
        onCall: 4,
        incidentsOpen: 2,
        scheduleRequests: 7,
        employeesStale: 4,
      });
      
      setComplianceData({
        upToDate: 28,
        expiringWithin30Days: 5,
        expired: 2,
        completionRate: 92
      });
      
      setIsLoading(false);
      toast({
        title: "HR Dashboard Refreshed",
        description: "Personnel data has been updated",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HRLayout>
      <div className="container mx-auto py-6 space-y-8">
        <HRDashboardHeader unreadMessages={unreadMessages} />

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <HRStatusCards data={statusData} />
            
            <HRQuickActionPanel />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <HRDashboardTabs />
                <HRAIRecommendations />
              </div>
              
              <div className="md:col-span-1">
                <HRDashboardSidebar />
              </div>
            </div>
          </>
        )}
      </div>
    </HRLayout>
  );
}
