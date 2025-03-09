
import { Link } from "react-router-dom";
import { Heart, Home, Truck, Calendar, BarChart, DollarSign, Settings, User, Menu, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";
import { DarkModeToggle } from "@/components/theme/DarkModeToggle";

export function Header({ className = "" }) {
  const isMobile = useMobile();
  
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
    <header className={`bg-[#0f172a] backdrop-blur-lg border-b border-[#1e293b] shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 bg-purple-500/20 blur-sm rounded-full animate-pulse"></div>
              </div>
              <div className="text-xl font-bold text-white">
                NexaCore
              </div>
            </div>
            <Link to="/create">
              <Button 
                variant="ghost" 
                size="sm"
                className="relative overflow-hidden bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white 
                          hover:from-[#7C3AED] hover:to-[#C026D3] 
                          shadow-[0_0_15px_rgba(139,92,246,0.5)]
                          hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]
                          transition-all duration-300 gap-2
                          before:absolute before:inset-0 
                          before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                          before:translate-x-[-200%] before:transition-transform before:duration-[1.5s]
                          hover:before:translate-x-[200%]
                          rounded-full border-none"
              >
                <Plus className="w-4 h-4" />
                New Dispatch
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center">
            <DarkModeToggle />
            
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1e293b] border-[#334155] text-white">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild className="text-gray-300 hover:text-white hover:bg-[#334155] focus:bg-[#334155]">
                      <Link 
                        to={item.path}
                        className="flex items-center gap-2 w-full px-2 py-1.5"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <nav className="hidden sm:flex sm:space-x-1 ml-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1e293b] rounded-md transition-all duration-300 relative group"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300"></div>
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
