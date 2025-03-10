
import { Link } from "react-router-dom";
import { Heart, Home, Truck, Calendar, BarChart, DollarSign, Settings, User, Menu, Plus, Bell, Search, Clock, Zap } from "lucide-react";
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

export function Header({ className = "" }) {
  const isMobile = useMobile();
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-3'} 
                 ${className} backdrop-blur-md bg-gradient-to-r from-[#FF3366] via-[#FF5F85] to-[#FF7AA0] border-b border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-md group-hover:bg-white/40 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-white to-pink-100 rounded-full p-2 shadow-inner overflow-hidden">
                  <Heart className="w-5 h-5 text-[#FF3366] animate-pulse" strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative">
                <span className="text-xl font-bold text-white tracking-tight">
                  Vital<span className="font-black">Track</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/40 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            </Link>
            
            <div className="hidden lg:flex ml-3 h-8 w-0.5 bg-white/20 rounded-full"></div>
            
            <div className="hidden md:flex">
              <Button 
                as={Link} 
                to="/create"
                variant="ghost" 
                size="sm"
                className="relative overflow-hidden text-white bg-white/10 hover:bg-white/20 
                           shadow-lg hover:shadow-xl transition-all duration-300 gap-2
                           border border-white/30 rounded-full pl-3 pr-4"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                <Plus className="w-4 h-4" />
                <span className="font-medium">New Dispatch</span>
                <div className="absolute -bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
                <Search className="h-[18px] w-[18px]" />
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10 rounded-full p-2">
              <Bell className="h-[18px] w-[18px]" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[#FFD166] text-[#333] text-[10px] border-2 border-white">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
              <Clock className="h-[18px] w-[18px]" />
            </Button>
            
            <div className="hidden lg:flex h-8 w-0.5 bg-white/20 rounded-full mx-1"></div>
            
            <Link to="/profile" className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-2 border-white flex items-center justify-center text-white font-bold text-xs">
                JD
              </div>
              <div className="hidden lg:block text-white text-sm font-medium">
                John Doe
              </div>
            </Link>
          </div>
          
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      to={item.path}
                      className="flex items-center gap-2 w-full px-2 py-1.5 text-gray-700"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuItem asChild className="mt-2 border-t border-gray-100 pt-1">
                  <Link to="/create" className="flex items-center gap-2 w-full px-2 py-1.5 text-pink-600 font-medium">
                    <Zap className="w-4 h-4" />
                    <span>New Dispatch</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden sm:flex sm:space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-all duration-300 relative group"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
