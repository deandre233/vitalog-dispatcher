import { Bell, Settings, User, Calendar, Clock } from "lucide-react";
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

export type ViewType = 'active' | 'schedule' | 'calendar';

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
        <h1 className="text-2xl font-semibold text-medical-primary">
          Billing Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant={unattendedMode ? "default" : "outline"}
            onClick={() => setUnattendedMode(!unattendedMode)}
          >
            {unattendedMode ? "Exit Unattended Mode" : "Enter Unattended Mode"}
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
      <div className="flex gap-2 px-6 pb-2">
        <Button
          variant={view === 'active' ? 'default' : 'outline'}
          onClick={() => handleViewChange('active')}
          className="gap-2"
        >
          <Clock className="w-4 h-4" />
          Active
        </Button>
        <Button
          variant={view === 'schedule' ? 'default' : 'outline'}
          onClick={() => handleViewChange('schedule')}
          className="gap-2"
        >
          <Clock className="w-4 h-4" />
          Schedule
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          onClick={() => handleViewChange('calendar')}
          className="gap-2"
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </Button>
      </div>
    </div>
  );
}