
import { Link } from "react-router-dom";
import { Brain, Heart, Home, Truck, Calendar, BarChart, DollarSign, Settings, User, Menu, Plus, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";
import { ActiveShiftIndicator } from "@/components/dashboard/ActiveShiftIndicator";
import { Badge } from "@/components/ui/badge";

export function Header({ className = "" }) {
  const isMobile = useMobile();
  
  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dispatch", icon: Truck, path: "/dispatch", badge: { count: 7, color: "blue" } },
    { name: "Schedule", icon: Calendar, path: "/schedule" },
    { name: "Performance", icon: BarChart, path: "/performance" },
    { name: "Billing", icon: DollarSign, path: "/billing" },
    { name: "Patients", icon: User, path: "/patients" },
    { name: "AI Insights", icon: Brain, path: "/ai-insights", badge: { text: "New", color: "purple" } },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  return (
    <header className={`bg-gradient-to-r from-[#ea384c] to-[#ff6b81] backdrop-blur-sm border-b border-red-600/20 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Heart className="w-6 h-6 text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 blur-sm rounded-full animate-pulse"></div>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Vitalog
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Active Shift Indicator */}
              <ActiveShiftIndicator count={2} />
              
              {/* Active Dispatch Badge */}
              <div className="hidden sm:flex items-center bg-white/10 px-3 py-1 rounded-full text-white text-sm">
                <Truck className="w-4 h-4 mr-1" />
                <span>7 Active</span>
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
          </div>
          
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      to={item.path}
                      className="flex items-center gap-2 w-full px-2 py-1.5"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge className={`ml-auto bg-${item.badge.color}-500 hover:bg-${item.badge.color}-600`}>
                          {item.badge.count || item.badge.text}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden sm:flex sm:space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-all duration-300 relative group"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      className={`absolute -top-1 -right-1 ${
                        item.badge.color === 'purple' 
                          ? 'bg-purple-500 hover:bg-purple-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {item.badge.count || item.badge.text}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300"></div>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
