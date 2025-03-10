
import { Link } from "react-router-dom";
import { Heart, Home, Truck, Calendar, BarChart, DollarSign, Settings, User, Menu, Plus, Bell, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const isMobile = useMobile();
  const [notifications, setNotifications] = useState(3);
  
  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dispatch", icon: Truck, path: "/dispatch" },
    { name: "Schedule", icon: Calendar, path: "/schedule" },
    { name: "Performance", icon: BarChart, path: "/performance" },
    { name: "Billing", icon: DollarSign, path: "/billing" },
    { name: "Patients", icon: User, path: "/patients" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full py-2 bg-[#FF3366] border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white rounded-full p-1.5">
                <Heart className="w-5 h-5 text-[#FF3366]" />
              </div>
              <span className="text-xl font-bold text-white">
                VitalTrack
              </span>
            </Link>
            
            <div className="hidden md:flex">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white bg-white/10 hover:bg-white/20 
                           border border-white/30 rounded-full pl-3 pr-4"
                onClick={() => window.location.href = '/create'}
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="font-medium">New Dispatch</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10 rounded-full p-2">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-400 text-black text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
              <Clock className="h-5 w-5" />
            </Button>
            
            <div className="hidden lg:flex h-8 w-0.5 bg-white/20 rounded-full mx-1"></div>
            
            <div className="hidden sm:flex items-center gap-3 ml-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                JD
              </div>
              <div className="hidden lg:block text-white text-sm font-medium">
                John Doe
              </div>
            </div>
            
            <nav className="hidden sm:flex items-center space-x-2 ml-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.path}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuItem asChild className="mt-2 border-t pt-1">
                    <Link to="/create" className="flex items-center gap-2 w-full">
                      <Plus className="w-4 h-4" />
                      <span>New Dispatch</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
