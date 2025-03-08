
import { Bell, Settings, User, Brain } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DispatchTabs } from "../dispatch/navigation/DispatchTabs";
import { Badge } from "@/components/ui/badge";

export type ViewType = 'active' | 'schedule' | 'calendar' | 'ai';

interface DashboardHeaderProps {
  onViewChange?: (view: ViewType) => void;
  defaultView?: ViewType;
}

export function DashboardHeader({ onViewChange, defaultView = 'active' }: DashboardHeaderProps) {
  const [view, setView] = useState<ViewType>(defaultView);
  const [unattendedMode, setUnattendedMode] = useState(false);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    onViewChange?.(newView);
  };

  return (
    <div className="flex flex-col bg-white border-b">
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-medical-primary">
            Mission Control
          </h1>
          <Badge variant="outline" className="gap-1 px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3.5 w-3.5" />
            <span>AI Assisted</span>
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={unattendedMode ? "default" : "outline"}
            onClick={() => setUnattendedMode(!unattendedMode)}
            className={unattendedMode ? 
              "bg-green-600 hover:bg-green-700 text-white" : 
              "border-green-200 text-green-600 hover:bg-green-50"
            }
          >
            {unattendedMode ? "Exit Automated Mode" : "Enter Automated Mode"}
          </Button>
          <button className="relative p-2 hover:bg-medical-accent rounded-full">
            <Bell className="w-6 h-6 text-medical-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-medical-accent rounded-full">
              <User className="w-6 h-6 text-medical-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Command Center</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="px-6 pb-2">
        <DispatchTabs activeTab={view} onTabChange={handleViewChange} />
      </div>
    </div>
  );
}
