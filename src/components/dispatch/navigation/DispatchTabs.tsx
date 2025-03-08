
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Clock, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">7</Badge>
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Planning
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Insights
          <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-800 hover:bg-purple-200">New</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
