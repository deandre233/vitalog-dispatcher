
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  User, 
  Shield, 
  Lock, 
  Users, 
  Banknote, 
  Clock, 
  BarChart3, 
  Award, 
  FileText, 
  AlertTriangle, 
  Medal, 
  Bell
} from "lucide-react";

interface EmployeeProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode;
}

export function EmployeeProfileTabs({ activeTab, onTabChange, children }: EmployeeProfileTabsProps) {
  const tabIcons = {
    identity: <User className="mr-1 h-4 w-4" />,
    roles: <Shield className="mr-1 h-4 w-4" />,
    privileges: <Lock className="mr-1 h-4 w-4" />,
    demographics: <Users className="mr-1 h-4 w-4" />,
    payroll: <Banknote className="mr-1 h-4 w-4" />,
    shifts: <Clock className="mr-1 h-4 w-4" />,
    performance: <BarChart3 className="mr-1 h-4 w-4" />,
    certifications: <Award className="mr-1 h-4 w-4" />,
    documents: <FileText className="mr-1 h-4 w-4" />,
    incidents: <AlertTriangle className="mr-1 h-4 w-4" />,
    achievements: <Medal className="mr-1 h-4 w-4" />,
    notifications: <Bell className="mr-1 h-4 w-4" />,
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="border-b sticky top-0 bg-white z-10">
        <TabsList className="h-auto p-0 bg-transparent flex w-full flex-wrap justify-start">
          {Object.entries(tabIcons).map(([key, icon]) => (
            <TabsTrigger 
              key={key}
              value={key} 
              className={cn(
                "py-2 px-3 text-sm rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all flex items-center shrink-0",
              )}
            >
              {icon}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {Object.keys(tabIcons).map((tabKey) => (
        <TabsContent key={tabKey} value={tabKey} className="mt-6">
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
