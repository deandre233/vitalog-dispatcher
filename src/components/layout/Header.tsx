import { Link } from "react-router-dom";
import { 
  Home,
  Ambulance, 
  PlusCircle, 
  Users, 
  DollarSign,
  FileText,
  Flag,
  Clock,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header({ className = "" }) {
  const navItems = [
    { icon: Ambulance, label: "Emergency Transport", href: "/dispatch" },
    { icon: PlusCircle, label: "Add New Item", href: "/dispatch/new" },
    { icon: Users, label: "Team Management", href: "/crew" },
    { icon: DollarSign, label: "Financial Tracker", href: "/billing" },
    { icon: FileText, label: "Documents & Reports", href: "/reports" },
    { icon: Flag, label: "Flagged Items", href: "/flagged" },
    { icon: Clock, label: "Time Tracker", href: "/time" },
  ];

  return (
    <header className={`bg-medical-primary text-white border-b border-medical-primary/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and Home */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Heart className="w-6 h-6 text-white animate-pulse" />
              <span className="text-xl font-bold hidden sm:inline">Heart Medical Transport</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Center section - Main navigation icons */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-8">
            <TooltipProvider>
              <div className="flex items-center justify-center gap-1">
                {navItems.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Link to={item.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white/80"
                        >
                          <item.icon className="w-5 h-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </nav>

          {/* Right section - Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white/80"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}