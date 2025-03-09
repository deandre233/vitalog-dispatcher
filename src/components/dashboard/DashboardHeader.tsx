
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
  const [unattendedMode, setUnattendedMode] = useState(false);

  return (
    <div className="bg-white border-b shadow-sm backdrop-blur-sm bg-white/80">
      <div className="flex justify-end items-center p-4">
        <div className="flex items-center gap-4">
          <Button
            variant={unattendedMode ? "default" : "outline"}
            onClick={() => setUnattendedMode(!unattendedMode)}
            className={`transition-all duration-300 ${
              unattendedMode 
                ? "bg-gradient-to-r from-medical-gradient-start to-medical-gradient-end text-white shadow-md" 
                : "hover:bg-medical-accent/20"
            }`}
          >
            {unattendedMode ? "Exit Unattended Mode" : "Enter Unattended Mode"}
          </Button>
          <button className="relative p-2 hover:bg-medical-accent rounded-full transition-colors duration-200">
            <Bell className="w-6 h-6 text-medical-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-medical-accent rounded-full transition-colors duration-200">
              <User className="w-6 h-6 text-medical-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-md border border-gray-100">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
