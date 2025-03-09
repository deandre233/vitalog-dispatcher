
import { Bell, Settings, User } from "lucide-react";
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
    <div className="flex flex-col bg-[#1e293b] border-b border-[#334155]">
      <div className="flex justify-end items-center p-6">
        <div className="flex items-center gap-4">
          <Button
            variant={unattendedMode ? "default" : "outline"}
            onClick={() => setUnattendedMode(!unattendedMode)}
            className={`
              ${unattendedMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-transparent border-[#334155] text-gray-300 hover:text-white hover:bg-[#334155]'}
            `}
          >
            {unattendedMode ? "Exit Unattended Mode" : "Enter Unattended Mode"}
          </Button>
          <button className="relative p-2 hover:bg-[#334155] rounded-full transition-colors">
            <Bell className="w-6 h-6 text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-[#334155] rounded-full transition-colors">
              <User className="w-6 h-6 text-gray-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1e293b] border-[#334155] text-gray-300">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#334155]" />
              <DropdownMenuItem className="hover:bg-[#334155] focus:bg-[#334155] cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#334155] focus:bg-[#334155] cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#334155]" />
              <DropdownMenuItem className="hover:bg-[#334155] focus:bg-[#334155] cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex gap-2 px-6 pb-4">
        <Button
          variant={view === 'active' ? 'default' : 'outline'}
          onClick={() => handleViewChange('active')}
          className={`
            gap-2 
            ${view === 'active' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-transparent border-[#334155] text-gray-300 hover:text-white hover:bg-[#334155]'}
          `}
        >
          Active
        </Button>
        <Button
          variant={view === 'schedule' ? 'default' : 'outline'}
          onClick={() => handleViewChange('schedule')}
          className={`
            gap-2 
            ${view === 'schedule' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-transparent border-[#334155] text-gray-300 hover:text-white hover:bg-[#334155]'}
          `}
        >
          Schedule
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          onClick={() => handleViewChange('calendar')}
          className={`
            gap-2 
            ${view === 'calendar' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-transparent border-[#334155] text-gray-300 hover:text-white hover:bg-[#334155]'}
          `}
        >
          Calendar
        </Button>
      </div>
    </div>
  );
}
