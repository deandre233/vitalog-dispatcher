import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

interface DispatchTabsProps {
  activeTab: 'active' | 'schedule' | 'calendar';
  onTabChange: (tab: 'active' | 'schedule' | 'calendar') => void;
}

export function DispatchTabs({ activeTab, onTabChange }: DispatchTabsProps) {
  return (
    <div className="flex gap-2 p-4 border-b">
      <Button 
        variant={activeTab === 'active' ? 'default' : 'ghost'}
        onClick={() => onTabChange('active')}
        className="gap-2"
      >
        <Clock className="h-4 w-4" />
        Active
      </Button>
      <Button
        variant={activeTab === 'schedule' ? 'default' : 'ghost'}
        onClick={() => onTabChange('schedule')}
        className="gap-2"
      >
        <Clock className="h-4 w-4" />
        Schedule
      </Button>
      <Button
        variant={activeTab === 'calendar' ? 'default' : 'ghost'}
        onClick={() => onTabChange('calendar')}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </Button>
    </div>
  );
}