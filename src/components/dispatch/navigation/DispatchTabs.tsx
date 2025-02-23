
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Clock } from "lucide-react";

interface DispatchTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function DispatchTabs({ activeTab, onTabChange }: DispatchTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-muted/50 backdrop-blur-sm">
        <TabsTrigger value="active" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Operations
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Planning
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
