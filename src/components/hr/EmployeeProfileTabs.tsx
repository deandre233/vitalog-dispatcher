
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EmployeeProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function EmployeeProfileTabs({ activeTab, onTabChange, children }: EmployeeProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="border-b sticky top-0 bg-white z-10">
        <TabsList className="h-auto p-0 bg-transparent flex w-full overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="identity" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Identity
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Roles
          </TabsTrigger>
          <TabsTrigger 
            value="privileges" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Privileges
          </TabsTrigger>
          <TabsTrigger 
            value="demographics" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Demographics
          </TabsTrigger>
          <TabsTrigger 
            value="payroll" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Payroll
          </TabsTrigger>
          <TabsTrigger 
            value="certifications" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Certifications
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="incidents" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Incidents
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Stats
          </TabsTrigger>
          <TabsTrigger 
            value="achievements" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className={cn(
              "py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary font-medium transition-all",
            )}
          >
            Notifications
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
