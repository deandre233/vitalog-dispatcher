
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { User, Shield, FileText, Clock, BarChart, Award, FileCheck } from "lucide-react";

interface EmployeeProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function EmployeeProfileTabs({ activeTab, onTabChange, children }: EmployeeProfileTabsProps) {
  // Group tabs by category
  const identityTabs = ["identity", "demographics"];
  const roleTabs = ["roles", "privileges"];
  const workTabs = ["payroll", "shifts", "performance"];
  const documentTabs = ["certifications", "documents"];
  const activityTabs = ["incidents", "stats", "achievements", "notifications"];
  
  // Get appropriate icon for each tab
  const getTabIcon = (tabValue: string) => {
    switch (tabValue) {
      case "identity": return <User className="h-4 w-4 mr-2" />;
      case "roles": return <Shield className="h-4 w-4 mr-2" />;
      case "privileges": return <Shield className="h-4 w-4 mr-2" />;
      case "demographics": return <User className="h-4 w-4 mr-2" />;
      case "payroll": return <FileText className="h-4 w-4 mr-2" />;
      case "shifts": return <Clock className="h-4 w-4 mr-2" />;
      case "performance": return <BarChart className="h-4 w-4 mr-2" />;
      case "certifications": return <Award className="h-4 w-4 mr-2" />;
      case "documents": return <FileCheck className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="border-b sticky top-0 bg-white z-10">
        <TabsList className="h-auto p-0 bg-transparent flex w-full overflow-x-auto no-scrollbar">
          {/* Identity section */}
          {identityTabs.map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className={cn(
                "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all flex items-center",
              )}
            >
              {getTabIcon(tab)}
              {tab === "identity" ? "Identity" : "Demographics"}
            </TabsTrigger>
          ))}

          {/* Divider */}
          <span className="mx-2 self-center text-gray-300">|</span>

          {/* Roles section */}
          {roleTabs.map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className={cn(
                "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all flex items-center",
              )}
            >
              {getTabIcon(tab)}
              {tab === "roles" ? "Roles" : "Privileges"}
            </TabsTrigger>
          ))}

          {/* Divider */}
          <span className="mx-2 self-center text-gray-300">|</span>

          {/* Work section */}
          {workTabs.map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className={cn(
                "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all flex items-center",
              )}
            >
              {getTabIcon(tab)}
              {tab === "payroll" ? "Payroll" : tab === "shifts" ? "Shifts" : "Performance"}
            </TabsTrigger>
          ))}

          {/* Divider */}
          <span className="mx-2 self-center text-gray-300">|</span>

          {/* Documents section */}
          {documentTabs.map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className={cn(
                "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all flex items-center",
              )}
            >
              {getTabIcon(tab)}
              {tab === "certifications" ? "Certifications" : "Documents"}
            </TabsTrigger>
          ))}

          {/* Divider */}
          <span className="mx-2 self-center text-gray-300">|</span>

          {/* Activity section */}
          {activityTabs.map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className={cn(
                "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all flex items-center",
              )}
            >
              {tab === "incidents" ? "Incidents" : tab === "stats" ? "Stats" : tab === "achievements" ? "Achievements" : "Notifications"}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
