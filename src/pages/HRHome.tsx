
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
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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

  // Track collapsed state for different sections
  const [collapsedSections, setCollapsedSections] = useState({
    quickActions: false,
    mainContent: false,
    recommendations: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  // Section header with collapsible trigger
  const SectionHeader = ({ title, section, collapsed }) => (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-medium">{title}</h3>
      <Button variant="ghost" size="sm" onClick={() => toggleSection(section)}>
        {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <HRLayout>
      <div className="container mx-auto py-6 space-y-6">
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
            
            <Card className="p-4">
              <SectionHeader 
                title="Quick Actions" 
                section="quickActions"
                collapsed={collapsedSections.quickActions}
              />
              <Collapsible 
                open={!collapsedSections.quickActions}
                className="transition-all duration-200"
              >
                <CollapsibleContent>
                  <HRQuickActionPanel />
                </CollapsibleContent>
              </Collapsible>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-4">
                  <SectionHeader 
                    title="Dashboard Overview" 
                    section="mainContent"
                    collapsed={collapsedSections.mainContent}
                  />
                  <Collapsible 
                    open={!collapsedSections.mainContent}
                    className="transition-all duration-200"
                  >
                    <CollapsibleContent>
                      <HRDashboardTabs />
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
                
                <Card className="p-4">
                  <SectionHeader 
                    title="AI Recommendations" 
                    section="recommendations"
                    collapsed={collapsedSections.recommendations}
                  />
                  <Collapsible 
                    open={!collapsedSections.recommendations}
                    className="transition-all duration-200"
                  >
                    <CollapsibleContent>
                      <HRAIRecommendations />
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
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
