
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DirectoryTabsProps {
  children: ReactNode;
  emptyState: ReactNode;
  employeeCount: number;
}

export function DirectoryTabs({ children, emptyState, employeeCount }: DirectoryTabsProps) {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="w-full max-w-md mb-6 bg-[#F1F0FB]">
        <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
          Active Personnel
        </TabsTrigger>
        <TabsTrigger value="inactive" className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
          On Leave
        </TabsTrigger>
        <TabsTrigger value="new" className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
          Recently Added
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="mt-0">
        {employeeCount > 0 ? children : emptyState}
      </TabsContent>
      
      <TabsContent value="inactive" className="mt-0">
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <div className="max-w-md mx-auto">
            <h3 className="font-medium text-gray-900 mb-1">Personnel on Leave</h3>
            <p className="text-gray-500 text-sm">
              This tab will display personnel currently on leave or inactive status
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="new" className="mt-0">
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <div className="max-w-md mx-auto">
            <h3 className="font-medium text-gray-900 mb-1">Recently Added Personnel</h3>
            <p className="text-gray-500 text-sm">
              This tab will display personnel added in the last 30 days
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
