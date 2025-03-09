
import { Link } from "react-router-dom";
import { Bell, User, Menu, Plus, Zap } from "lucide-react";
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
    { name: "Home", path: "/" },
    { name: "Dispatch", path: "/dispatch" },
    { name: "Schedule", path: "/schedule" },
    { name: "Performance", path: "/performance" },
    { name: "Billing", path: "/billing" },
    { name: "Patients", path: "/patients" },
    { name: "Settings", path: "/settings" }
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
                    <span>{item.name}</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300"></div>
                  </Link>
                ))}
              </nav>
            )}
            
            <div className="flex items-center ml-4">
              <button className="relative p-2 hover:bg-[#334155] rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-[#334155] rounded-full transition-colors">
                  <User className="w-5 h-5 text-gray-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1e293b] border-[#334155] text-white">
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#334155] focus:bg-[#334155]">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#334155] focus:bg-[#334155]">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#334155] focus:bg-[#334155]">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
